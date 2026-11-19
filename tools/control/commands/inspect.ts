import { existsSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import type { AxeResults } from "axe-core";
import { withPage } from "../browser.ts";
import { booleanFlag, stringFlag } from "../flags.ts";
import { fail } from "../output.ts";
import { eventsPath, recordedEventSchema, type EventLog } from "../state.ts";
import type { Command, Flags } from "../types.ts";

const readEvents = (target: string, log: EventLog, flags: Flags) => {
	const path = eventsPath(target, log);
	const lines = existsSync(path)
		? readFileSync(path, "utf8")
				.split("\n")
				.filter((line) => line !== "")
		: [];
	if (booleanFlag(flags, "clear")) {
		rmSync(path, { force: true });
	}
	return lines.flatMap((line) => {
		const parsed = recordedEventSchema.safeParse(JSON.parse(line));
		return parsed.success ? [parsed.data] : [];
	});
};

const consoleCommand: Command = {
	summary: "Console messages and page errors recorded while control commands ran.",
	usage: "pnpm control <target> console [--errors] [--clear]",
	options: {
		errors: { type: "boolean", description: "only errors, warnings and uncaught page errors" },
		clear: { type: "boolean", description: "empty the log after printing" },
	},
	run: ({ target, flags }) => {
		const events = readEvents(target.name, "console", flags).filter(
			(event) =>
				!booleanFlag(flags, "errors") ||
				event.kind === "pageerror" ||
				event.type === "error" ||
				event.type === "warning",
		);
		return Promise.resolve({ count: events.length, events });
	},
};

const network: Command = {
	summary: "Document, fetch and failed requests recorded while control commands ran.",
	usage: "pnpm control <target> network [--failed] [--clear]",
	options: {
		failed: { type: "boolean", description: "only failed requests and HTTP status >= 400" },
		clear: { type: "boolean", description: "empty the log after printing" },
	},
	run: ({ target, flags }) => {
		const events = readEvents(target.name, "network", flags).filter(
			(event) =>
				!booleanFlag(flags, "failed") ||
				event.kind === "requestfailed" ||
				(event.status !== undefined && event.status >= 400),
		);
		return Promise.resolve({ count: events.length, events });
	},
};

const axeSource = () =>
	readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

const a11y: Command = {
	summary: "Run axe (same version as the story tests) on the page; fails on violations.",
	usage: "pnpm control <target> a11y [--selector <css>]",
	options: {
		selector: {
			type: "string",
			description: "CSS selector to scope the audit (default the whole document)",
		},
	},
	run: ({ target, flags }) =>
		withPage(target.name, async (page) => {
			const scope = stringFlag(flags, "selector") ?? "html";
			if ((await page.locator(scope).count()) === 0) {
				return fail(
					`--selector ${scope} matches nothing on ${page.url()}.`,
					"Audit an element that exists, or drop --selector.",
				);
			}
			await page.addScriptTag({ content: axeSource() });
			const results = await page.evaluate<AxeResults>(
				`axe.run(${JSON.stringify(scope)}, { resultTypes: ["violations"] })`,
			);
			const violations = results.violations.map((violation) => ({
				id: violation.id,
				impact: violation.impact,
				help: violation.help,
				helpUrl: violation.helpUrl,
				nodes: violation.nodes.slice(0, 5).map((node) => ({
					target: node.target.join(" "),
					summary: node.failureSummary,
				})),
			}));
			return { ok: violations.length === 0, url: page.url(), violations };
		}),
};

export const inspectCommands = { console: consoleCommand, network, a11y };
