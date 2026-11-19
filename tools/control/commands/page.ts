import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { focused, settle, withPage } from "../browser.ts";
import {
	booleanFlag,
	locatorFlags,
	numberFlag,
	requirePositional,
	stringFlag,
	timeoutFlag,
} from "../flags.ts";
import { buildLocator, hasLocator, resolveLocator } from "../locator.ts";
import { fail } from "../output.ts";
import { artifactsDir, repoRoot } from "../state.ts";
import type { Command } from "../types.ts";

const outputPath = (path: string | undefined, fallback: string) => {
	const absolute = resolve(process.env["INIT_CWD"] ?? process.cwd(), path ?? fallback);
	mkdirSync(dirname(absolute), { recursive: true });
	return absolute;
};

const goto: Command = {
	summary: "Open a path on the target's base URL and wait for the page to settle.",
	usage: "pnpm control <target> goto <path>",
	options: {},
	run: async ({ target, positionals }) => {
		const path = requirePositional(positionals, "path", "pnpm control <target> goto /recipes");
		return withPage(target.name, async (page, state) => {
			const response = await page.goto(new URL(path, state.baseUrl).href, { waitUntil: "load" });
			await target.afterNavigate?.(page);
			const settled = await settle(page);
			return { url: page.url(), status: response?.status(), title: await page.title(), settled };
		});
	},
};

const history = (direction: "back" | "forward") =>
	({
		summary: `Go ${direction} in browser history, like the browser's ${direction} button.`,
		usage: `pnpm control <target> ${direction}`,
		options: {},
		run: ({ target }) =>
			withPage(target.name, async (page) => {
				const before = page.url();
				await (direction === "back" ? page.goBack() : page.goForward());
				await target.afterNavigate?.(page);
				const settled = await settle(page);
				return { from: before, url: page.url(), settled, focused: await focused(page) };
			}),
	}) satisfies Command;

const snapshot: Command = {
	summary: "Print the ARIA snapshot (roles and accessible names) of the page or an element.",
	usage: "pnpm control <target> snapshot [--selector <css>] [--path <file>]",
	options: {
		selector: { type: "string", description: "CSS selector to scope the snapshot (default body)" },
		path: { type: "string", description: "also write the snapshot to this file" },
	},
	run: ({ target, flags }) =>
		withPage(target.name, async (page) => {
			const text = await page.locator(stringFlag(flags, "selector") ?? "body").ariaSnapshot();
			const path = stringFlag(flags, "path");
			if (path === undefined) {
				return { url: page.url(), focused: await focused(page), snapshot: text };
			}
			const file = outputPath(path, path);
			writeFileSync(file, `${text}\n`);
			return {
				url: page.url(),
				focused: await focused(page),
				path: relative(repoRoot, file),
				snapshot: text,
			};
		}),
};

const click: Command = {
	summary: "Click one element, then wait for the page to settle.",
	usage: 'pnpm control <target> click --role button --name "Log a shot"',
	options: { ...locatorFlags, ...timeoutFlag },
	run: ({ target, flags }) =>
		withPage(target.name, async (page) => {
			const { locator, description } = await resolveLocator(page, flags, target.name);
			await locator.click({ timeout: numberFlag(flags, "timeout") ?? 5000 });
			const settled = await settle(page);
			return { clicked: description, url: page.url(), settled, focused: await focused(page) };
		}),
};

const type: Command = {
	summary: "Replace a field's value (or type key by key with --keys), then settle.",
	usage: 'pnpm control <target> type --label "Search" --value "ethiopia" [--keys]',
	options: {
		...locatorFlags,
		...timeoutFlag,
		value: { type: "string", description: "text to enter" },
		keys: {
			type: "boolean",
			description: "type key by key into the current value instead of replacing it",
		},
	},
	run: ({ target, flags }) => {
		const value = stringFlag(flags, "value");
		if (value === undefined) {
			return fail("Missing --value.", 'Pass --value "<text>"; use --value "" to clear a field.');
		}
		return withPage(target.name, async (page) => {
			const { locator, description } = await resolveLocator(page, flags, target.name);
			await (booleanFlag(flags, "keys") ? locator.pressSequentially(value) : locator.fill(value));
			const settled = await settle(page);
			return {
				typed: value,
				into: description,
				url: page.url(),
				settled,
				focused: await focused(page),
			};
		});
	},
};

const press: Command = {
	summary: "Press keys in order, on the focused element or on one element given by locator flags.",
	usage:
		"pnpm control <target> press <key> [key …] [--role … --name …]   e.g. Enter, Escape, k Backspace",
	options: { ...locatorFlags, ...timeoutFlag },
	run: ({ target, flags, positionals }) => {
		requirePositional(positionals, "key", "pnpm control <target> press Escape");
		return withPage(target.name, async (page) => {
			const resolved = hasLocator(flags)
				? await resolveLocator(page, flags, target.name)
				: undefined;
			for (const key of positionals) {
				await (resolved === undefined ? page.keyboard.press(key) : resolved.locator.press(key));
			}
			return {
				pressed: positionals,
				on: resolved?.description ?? "focused element",
				url: page.url(),
				settled: await settle(page),
				focused: await focused(page),
			};
		});
	},
};

const count: Command = {
	summary: "Count elements matching locator flags right now (no waiting); use to assert a state.",
	usage: "pnpm control <target> count --selector '[aria-busy=\"true\"]'",
	options: locatorFlags,
	run: ({ target, flags }) =>
		withPage(target.name, async (page) => {
			const locator = buildLocator(page, flags);
			if (locator === undefined) {
				return fail(
					"No element given.",
					"Pass --role with --name, or --label, --text, --placeholder, --testid, --selector.",
				);
			}
			return { count: await locator.count(), url: page.url() };
		}),
};

const screenshot: Command = {
	summary: "Save a PNG of the viewport (or the full page) as evidence.",
	usage: "pnpm control <target> screenshot [path] [--full] [--theme light|dark]",
	options: {
		full: { type: "boolean", description: "capture the full scrollable page" },
		theme: {
			type: "string",
			description: "toolkit only: reload the current story in this theme first",
		},
	},
	run: ({ target, flags, positionals }) =>
		withPage(target.name, async (page) => {
			const theme = stringFlag(flags, "theme");
			if (theme !== undefined) {
				if (target.applyTheme === undefined) {
					return fail(`--theme is not supported for ${target.name}.`, "Drop --theme.");
				}
				await target.applyTheme(page, theme);
			}
			const stamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
			const file = outputPath(positionals[0], `${artifactsDir(target.name)}/${stamp}.png`);
			await page.screenshot({ path: file, fullPage: booleanFlag(flags, "full") });
			return { path: relative(repoRoot, file), url: page.url() };
		}),
};

const waitSettle: Command = {
	summary: "Wait until the DOM stops changing (no mutations for --quiet ms).",
	usage: "pnpm control <target> wait-settle [--quiet 300] [--timeout 10000]",
	options: {
		quiet: { type: "string", description: "quiet period in ms (default 300)" },
		timeout: { type: "string", description: "give up after this many ms (default 10000)" },
	},
	run: ({ target, flags }) =>
		withPage(target.name, async (page) => ({
			settled: await settle(
				page,
				numberFlag(flags, "quiet") ?? 300,
				numberFlag(flags, "timeout") ?? 10_000,
			),
			url: page.url(),
		})),
};

export const pageCommands = {
	goto,
	back: history("back"),
	forward: history("forward"),
	snapshot,
	click,
	type,
	press,
	count,
	screenshot,
	"wait-settle": waitSettle,
};
