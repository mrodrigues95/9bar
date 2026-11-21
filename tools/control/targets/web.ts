import { join } from "node:path";
import type { Page } from "playwright-core";
import { fail } from "../output.ts";
import { repoRoot } from "../state.ts";
import type { Target } from "../types.ts";

const identify = async (baseUrl: string) => {
	try {
		const response = await fetch(baseUrl, { signal: AbortSignal.timeout(5000) });
		const html = await response.text();
		return response.ok && html.includes("Welcome to 9bar")
			? undefined
			: `${baseUrl} answered ${response.status} without the 9bar home page.`;
	} catch {
		return `${baseUrl} is not answering.`;
	}
};

const waitForHydration = async (page: Page) => {
	try {
		await page.waitForFunction(() => !("$_TSR" in window), undefined, { timeout: 30_000 });
	} catch {
		fail(
			"The page did not finish hydrating in 30s.",
			"Run `pnpm control web console --errors` and read tools/control/.runtime/web/server.log for the render error.",
		);
	}
};

export const web: Target = {
	name: "web",
	description: "apps/web (vite dev). Routes like /recipes, /logs.",
	packageDir: join(repoRoot, "apps/web"),
	defaultPort: 3100,
	defaultCdpPort: 9310,
	serverArgs: (port) => ["vite", "dev", "--port", String(port), "--strictPort"],
	identify,
	afterNavigate: waitForHydration,
	commands: {},
};
