import { spawn } from "node:child_process";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync } from "node:fs";
import { createConnection } from "node:net";
import { dirname } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

interface SpawnOptions {
	command: string;
	args: ReadonlyArray<string>;
	cwd: string;
	logFile: string;
}

export const spawnDetached = (options: SpawnOptions) => {
	mkdirSync(dirname(options.logFile), { recursive: true });
	const log = openSync(options.logFile, "a");
	const child = spawn(options.command, options.args, {
		cwd: options.cwd,
		detached: true,
		stdio: ["ignore", log, log],
		env: { ...process.env, BROWSER: "none", FORCE_COLOR: "0" },
	});
	child.unref();
	closeSync(log);
	if (child.pid === undefined) {
		throw new Error(`Could not start ${options.command}.`);
	}
	return child.pid;
};

export const isAlive = (pid: number) => {
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
};

export const killGroup = async (pid: number) => {
	if (!isAlive(pid)) {
		return false;
	}
	try {
		process.kill(-pid, "SIGTERM");
	} catch {
		process.kill(pid, "SIGTERM");
	}
	for (let attempt = 0; attempt < 50 && isAlive(pid); attempt += 1) {
		await delay(100);
	}
	if (isAlive(pid)) {
		process.kill(-pid, "SIGKILL");
	}
	return true;
};

export const responds = async (url: string) => {
	try {
		const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
		return response.ok;
	} catch {
		return false;
	}
};

interface WaitOptions {
	ready: () => Promise<boolean>;
	pid: number;
	timeoutMs: number;
}

export const waitUntilReady = async (options: WaitOptions) => {
	const deadline = Date.now() + options.timeoutMs;
	while (Date.now() < deadline) {
		if (await options.ready()) {
			return "ready";
		}
		if (!isAlive(options.pid)) {
			return "exited";
		}
		await delay(250);
	}
	return "timeout";
};

export const tail = (path: string, lines = 20) =>
	existsSync(path) ? readFileSync(path, "utf8").trimEnd().split("\n").slice(-lines).join("\n") : "";

export const portOpen = (port: number) =>
	new Promise<boolean>((resolve) => {
		const socket = createConnection({ port, host: "localhost" });
		socket.once("connect", () => {
			socket.destroy();
			resolve(true);
		});
		socket.once("error", () => {
			resolve(false);
		});
	});
