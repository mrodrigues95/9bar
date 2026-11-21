import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { chromium } from "playwright-core";
import type { ConsoleMessage, Page } from "playwright-core";
import { z } from "zod";
import { fail } from "./output.ts";
import { responds } from "./processes.ts";
import { eventsPath, readState } from "./state.ts";
import type { ControlState, EventLog, RecordedEvent } from "./state.ts";

export const chromiumPath = () => chromium.executablePath();

export const chromiumInstalled = () => existsSync(chromiumPath());

export const chromiumArgs = (cdpPort: number, profileDir: string) => [
	"--headless=new",
	`--remote-debugging-port=${cdpPort}`,
	`--user-data-dir=${profileDir}`,
	"--no-first-run",
	"--no-default-browser-check",
	"--no-sandbox",
	"--window-size=1280,800",
	"about:blank",
];

export const cdpUrl = (cdpPort: number) => `http://127.0.0.1:${cdpPort}`;

export const cdpResponds = (cdpPort: number) => responds(`${cdpUrl(cdpPort)}/json/version`);

export const requireState = (target: string) => {
	const state = readState(target);
	if (state === undefined) {
		return fail(
			`No ${target} instance is running under control.`,
			`Run \`pnpm control ${target} launch\` first.`,
		);
	}
	return state;
};

const record = (target: string, event: RecordedEvent) => {
	const log: EventLog =
		event.kind === "console" || event.kind === "pageerror" ? "console" : "network";
	const path = eventsPath(target, log);
	mkdirSync(dirname(path), { recursive: true });
	appendFileSync(path, `${JSON.stringify(event)}\n`);
};

const consoleArgs = async (message: ConsoleMessage) => {
	const values = await Promise.all(message.args().map(async (handle) => handle.jsonValue()));
	const parsed = z.array(z.json()).safeParse(values);
	return parsed.success ? parsed.data : undefined;
};

const recordPageEvents = (target: string, page: Page, pending: Array<Promise<void>>) => {
	const now = () => new Date().toISOString();
	page.on("console", (message) => {
		const at = now();
		pending.push(
			consoleArgs(message)
				.catch(() => undefined)
				.then((args) => {
					record(target, { at, kind: "console", type: message.type(), text: message.text(), args });
				}),
		);
	});
	page.on("pageerror", (error) => {
		record(target, { at: now(), kind: "pageerror", text: error.message });
	});
	page.on("requestfailed", (request) => {
		record(target, {
			at: now(),
			kind: "requestfailed",
			method: request.method(),
			url: request.url(),
			failure: request.failure()?.errorText ?? "unknown",
		});
	});
	page.on("response", (response) => {
		const type = response.request().resourceType();
		if (type === "document" || type === "fetch" || type === "xhr" || response.status() >= 400) {
			record(target, {
				at: now(),
				kind: "request",
				method: response.request().method(),
				url: response.url(),
				status: response.status(),
				type,
			});
		}
	});
};

export const settle = (page: Page, quietMs = 300, timeoutMs = 10_000) =>
	page.evaluate(
		([quiet, timeout]) =>
			new Promise<boolean>((resolve) => {
				const started = performance.now();
				let last = performance.now();
				const observer = new MutationObserver(() => {
					last = performance.now();
				});
				observer.observe(document, { subtree: true, childList: true, attributes: true });
				const check = () => {
					const now = performance.now();
					const quietEnough = now - last >= quiet && document.readyState === "complete";
					if (quietEnough || now - started >= timeout) {
						observer.disconnect();
						resolve(quietEnough);
						return;
					}
					requestAnimationFrame(check);
				};
				requestAnimationFrame(check);
			}),
		[quietMs, timeoutMs] as const,
	);

export const focused = async (page: Page) => {
	const locator = page.locator(":focus");
	return (await locator.count()) === 0
		? "nothing (body)"
		: (await locator.first().ariaSnapshot()).split("\n")[0];
};

export const withPage = async <Result>(
	target: string,
	action: (page: Page, state: ControlState) => Promise<Result>,
) => {
	const state = requireState(target);
	if (!(await cdpResponds(state.cdpPort))) {
		return fail(
			`The ${target} browser is not answering on port ${state.cdpPort}.`,
			`Run \`pnpm control ${target} doctor\`, then \`pnpm control ${target} cleanup\` and \`launch\` if it stays down.`,
		);
	}
	const browser = await chromium.connectOverCDP(cdpUrl(state.cdpPort));
	try {
		const context = browser.contexts()[0] ?? (await browser.newContext());
		const page = context.pages()[0] ?? (await context.newPage());
		const pending: Array<Promise<void>> = [];
		recordPageEvents(target, page, pending);
		try {
			return await action(page, state);
		} finally {
			await Promise.allSettled(pending);
		}
	} finally {
		await browser.close();
	}
};
