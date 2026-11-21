import { existsSync } from "node:fs";
import { relative } from "node:path";
import { cdpResponds, chromiumArgs, chromiumInstalled, chromiumPath } from "../browser.ts";
import { booleanFlag, numberFlag } from "../flags.ts";
import { fail } from "../output.ts";
import { isAlive, killGroup, portOpen, spawnDetached, tail, waitUntilReady } from "../processes.ts";
import {
	artifactsDir,
	logPath,
	readState,
	removeTargetDir,
	repoRoot,
	targetDir,
	writeState,
} from "../state.ts";
import type { ControlState } from "../state.ts";
import type { Command, Target } from "../types.ts";

const fromRoot = (path: string) => relative(repoRoot, path);

const runChecks = async (target: Target, state: ControlState | undefined) => {
	const checks = [
		{
			name: "chromium installed",
			ok: chromiumInstalled(),
			fix: "Run `pnpm toolkit exec playwright install chromium`.",
		},
		{
			name: "instance recorded",
			ok: state !== undefined,
			fix: `Run \`pnpm control ${target.name} launch\`.`,
		},
	];
	if (state === undefined) {
		return checks;
	}
	const identityProblem = await target.identify(state.baseUrl);
	return [
		...checks,
		{
			name: `server process ${state.serverPid} alive`,
			ok: isAlive(state.serverPid),
			fix: `Read ${fromRoot(logPath(target.name, "server"))}, then run cleanup and launch.`,
		},
		{
			name: `${state.baseUrl} serves ${target.name}`,
			ok: identityProblem === undefined,
			fix: identityProblem ?? "",
		},
		{
			name: `browser process ${state.browserPid} alive`,
			ok: isAlive(state.browserPid),
			fix: `Read ${fromRoot(logPath(target.name, "browser"))}, then run cleanup and launch.`,
		},
		{
			name: `browser answers on CDP port ${state.cdpPort}`,
			ok: await cdpResponds(state.cdpPort),
			fix: "Run cleanup and launch.",
		},
	];
};

const doctor: Command = {
	summary: "Read-only health check: is this instance worth driving?",
	usage: "pnpm control <target> doctor",
	options: {},
	run: async ({ target }) => {
		const state = readState(target.name);
		const checks = await runChecks(target, state);
		const failing = checks.filter((check) => !check.ok);
		return {
			ok: failing.length === 0,
			baseUrl: state?.baseUrl,
			checks: checks.map((check) => ({ name: check.name, ok: check.ok })),
			fixes: failing.map((check) => check.fix),
		};
	},
};

const launch: Command = {
	summary: "Start a dev server and a headless Chromium owned by control; idempotent.",
	usage: "pnpm control <target> launch [--port <n>] [--cdp-port <n>]",
	options: {
		port: { type: "string", description: "dev server port (default: the target's control port)" },
		"cdp-port": { type: "string", description: "Chromium remote debugging port" },
	},
	run: async ({ target, flags }) => {
		const existing = readState(target.name);
		if (existing !== undefined) {
			const checks = await runChecks(target, existing);
			if (checks.every((check) => check.ok)) {
				return { alreadyRunning: true, baseUrl: existing.baseUrl };
			}
			return fail(
				`A ${target.name} instance is recorded but unhealthy.`,
				`Run \`pnpm control ${target.name} doctor\` to see why, then \`pnpm control ${target.name} cleanup\` and launch again.`,
			);
		}
		const port = numberFlag(flags, "port") ?? target.defaultPort;
		const cdpPort = numberFlag(flags, "cdp-port") ?? target.defaultCdpPort;
		for (const [label, candidate] of [
			["--port", port],
			["--cdp-port", cdpPort],
		] as const) {
			if (await portOpen(candidate)) {
				fail(
					`Port ${candidate} is already in use by a process control did not start.`,
					`Control never drives an instance it did not launch. Stop that process or pass ${label} <free port>.`,
				);
			}
		}
		if (!chromiumInstalled()) {
			fail("Chromium is not installed.", "Run `pnpm toolkit exec playwright install chromium`.");
		}
		removeTargetDir(target.name);
		const baseUrl = `http://localhost:${port}`;
		const serverLog = logPath(target.name, "server");
		const serverPid = spawnDetached({
			command: "pnpm",
			args: ["exec", ...target.serverArgs(port)],
			cwd: target.packageDir,
			logFile: serverLog,
		});
		const serverStatus = await waitUntilReady({
			pid: serverPid,
			timeoutMs: 120_000,
			ready: async () => (await target.identify(baseUrl)) === undefined,
		});
		if (serverStatus !== "ready") {
			await killGroup(serverPid);
			return fail(
				`The ${target.name} dev server ${serverStatus === "exited" ? "exited" : "did not become ready in 120s"}.\n${tail(serverLog)}`,
				`Read ${fromRoot(serverLog)}; fix the startup error, then launch again.`,
			);
		}
		const profileDir = `${targetDir(target.name)}/profile`;
		const browserLog = logPath(target.name, "browser");
		const browserPid = spawnDetached({
			command: chromiumPath(),
			args: chromiumArgs(cdpPort, profileDir),
			cwd: repoRoot,
			logFile: browserLog,
		});
		const browserStatus = await waitUntilReady({
			pid: browserPid,
			timeoutMs: 15_000,
			ready: () => cdpResponds(cdpPort),
		});
		if (browserStatus !== "ready") {
			await killGroup(browserPid);
			await killGroup(serverPid);
			return fail(
				`Chromium did not start.\n${tail(browserLog)}`,
				`Read ${fromRoot(browserLog)}; run \`pnpm toolkit exec playwright install chromium\` if the binary is missing.`,
			);
		}
		writeState(target.name, {
			baseUrl,
			port,
			cdpPort,
			serverPid,
			browserPid,
			profileDir,
			startedAt: new Date().toISOString(),
		});
		return {
			baseUrl,
			cdpPort,
			logs: [fromRoot(serverLog), fromRoot(browserLog)],
			artifacts: fromRoot(artifactsDir(target.name)),
		};
	},
};

const cleanup: Command = {
	summary: "Stop the server and browser this target launched; keeps artifacts.",
	usage: "pnpm control <target> cleanup [--dry-run]",
	options: {
		"dry-run": {
			type: "boolean",
			description: "list what would be stopped and removed, change nothing",
		},
	},
	run: async ({ target, flags }) => {
		const state = readState(target.name);
		const directory = targetDir(target.name);
		const steps = [
			...(state === undefined
				? []
				: [
						{
							action: "stop server process group",
							pid: state.serverPid,
							alive: isAlive(state.serverPid),
						},
						{
							action: "stop browser process group",
							pid: state.browserPid,
							alive: isAlive(state.browserPid),
						},
					]),
			...(existsSync(directory)
				? [{ action: "remove state, logs and profile", path: fromRoot(directory) }]
				: []),
		];
		const kept = fromRoot(artifactsDir(target.name));
		if (booleanFlag(flags, "dry-run")) {
			return { dryRun: true, steps, kept };
		}
		if (state !== undefined) {
			await killGroup(state.browserPid);
			await killGroup(state.serverPid);
		}
		removeTargetDir(target.name);
		return { steps, kept };
	},
};

export const lifecycleCommands = { doctor, launch, cleanup };
