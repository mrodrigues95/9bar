import { join } from "node:path";
import type { Page } from "playwright-core";
import { z } from "zod";
import { requireState, settle, withPage } from "../browser.ts";
import { requirePositional, stringFlag } from "../flags.ts";
import { fail } from "../output.ts";
import { repoRoot } from "../state.ts";
import type { Command, Target } from "../types.ts";

const indexSchema = z.object({
	entries: z.record(
		z.string(),
		z.object({ id: z.string(), title: z.string(), name: z.string(), type: z.string() }),
	),
});

const fetchStories = async (baseUrl: string) => {
	const response = await fetch(new URL("/index.json", baseUrl), {
		signal: AbortSignal.timeout(5000),
	});
	const parsed = indexSchema.safeParse(await response.json());
	if (!parsed.success) {
		return fail(
			`${baseUrl}/index.json is not a Storybook index.`,
			"Run `pnpm control toolkit doctor`.",
		);
	}
	return Object.values(parsed.data.entries).filter((entry) => entry.type === "story");
};

const identify = async (baseUrl: string) => {
	try {
		const stories = await fetchStories(baseUrl);
		return stories.length > 0 ? undefined : `${baseUrl}/index.json lists no stories.`;
	} catch {
		return `${baseUrl} is not serving a Storybook index.`;
	}
};

const themes = new Set(["light", "dark"]);

const openStory = async (page: Page, baseUrl: string, id: string, theme: string) => {
	if (!themes.has(theme)) {
		fail(`Unknown theme "${theme}".`, "Use --theme light or --theme dark.");
	}
	const url = new URL("/iframe.html", baseUrl);
	url.searchParams.set("id", id);
	url.searchParams.set("viewMode", "story");
	url.searchParams.set("globals", `theme:${theme}`);
	await page.goto(url.href, { waitUntil: "load" });
	try {
		await page.waitForFunction(
			() =>
				document.body.classList.contains("sb-show-main") ||
				document.body.classList.contains("sb-show-errordisplay"),
			undefined,
			{ timeout: 30_000 },
		);
	} catch {
		fail(
			`Story ${id} did not finish rendering in 30s.`,
			"Run `pnpm control toolkit console --errors`.",
		);
	}
	const error = await page.evaluate(() =>
		document.body.classList.contains("sb-show-errordisplay")
			? (document.querySelector("#error-message")?.textContent ?? "story failed to render")
			: undefined,
	);
	if (error !== undefined) {
		fail(
			`Story ${id} failed to render: ${error}`,
			"Fix the render error; `pnpm control toolkit console --errors` shows the stack.",
		);
	}
	const settled = await settle(page);
	return { url: page.url(), settled };
};

const normalize = (text: string) => text.toLowerCase().replaceAll(/[^a-z0-9]/g, "");

const stories: Command = {
	summary: "List stories from Storybook's index (the toolkit's feature map).",
	usage: "pnpm control toolkit stories [--filter <text>]",
	options: {
		filter: {
			type: "string",
			description: "match on id, title or name, ignoring case and punctuation",
		},
	},
	run: async ({ target, flags }) => {
		const state = requireState(target.name);
		const filter = normalize(stringFlag(flags, "filter") ?? "");
		const matches = (await fetchStories(state.baseUrl))
			.filter((entry) =>
				[entry.id, entry.title, entry.name].some((field) => normalize(field).includes(filter)),
			)
			.map((entry) => ({ id: entry.id, title: entry.title, name: entry.name }));
		return { count: matches.length, stories: matches };
	},
};

const story: Command = {
	summary: "Open one story in isolation (iframe.html) and fail if it does not render.",
	usage: "pnpm control toolkit story <id> [--theme light|dark]",
	options: { theme: { type: "string", description: "light (default) or dark" } },
	run: ({ target, flags, positionals }) => {
		const id = requirePositional(
			positionals,
			"id",
			"pnpm control toolkit story primitive-button--default",
		);
		return withPage(target.name, async (page, state) => {
			const known = await fetchStories(state.baseUrl);
			if (!known.some((entry) => entry.id === id)) {
				return fail(
					`No story with id "${id}".`,
					"Run `pnpm control toolkit stories --filter <text>` to find the id.",
				);
			}
			return {
				id,
				...(await openStory(page, state.baseUrl, id, stringFlag(flags, "theme") ?? "light")),
			};
		});
	},
};

const applyTheme = async (page: Page, theme: string) => {
	const current = new URL(page.url());
	const id = current.searchParams.get("id");
	if (!current.pathname.endsWith("/iframe.html") || id === null) {
		fail("--theme needs a story open.", "Run `pnpm control toolkit story <id>` first.");
		return;
	}
	await openStory(page, current.origin, id, theme);
};

export const toolkit: Target = {
	name: "toolkit",
	description:
		"packages/toolkit Storybook. Stories are the map: list with `stories`, open with `story`.",
	packageDir: join(repoRoot, "packages/toolkit"),
	defaultPort: 6106,
	defaultCdpPort: 9311,
	serverArgs: (port) => ["storybook", "dev", "--port", String(port), "--ci", "--no-open"],
	identify,
	applyTheme,
	commands: { stories, story },
};
