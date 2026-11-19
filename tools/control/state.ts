import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";

export const repoRoot = resolve(import.meta.dirname, "../..");

const controlRoot = join(repoRoot, ".control");

export const targetDir = (target: string) => join(controlRoot, target);

export const artifactsDir = (target: string) => join(controlRoot, "artifacts", target);

export const logPath = (target: string, name: string) => join(targetDir(target), `${name}.log`);

export type EventLog = "console" | "network";

export const eventsPath = (target: string, log: EventLog) =>
	join(targetDir(target), `${log}.jsonl`);

const stateSchema = z.object({
	baseUrl: z.string(),
	port: z.number(),
	cdpPort: z.number(),
	serverPid: z.number(),
	browserPid: z.number(),
	profileDir: z.string(),
	startedAt: z.string(),
});

export const recordedEventSchema = z.object({
	at: z.string(),
	kind: z.enum(["console", "pageerror", "request", "requestfailed"]),
	type: z.string().optional(),
	text: z.string().optional(),
	args: z.array(z.json()).optional(),
	method: z.string().optional(),
	url: z.string().optional(),
	status: z.number().optional(),
	failure: z.string().optional(),
});

export type RecordedEvent = z.infer<typeof recordedEventSchema>;

export type ControlState = z.infer<typeof stateSchema>;

const statePath = (target: string) => join(targetDir(target), "state.json");

export const readState = (target: string) => {
	const path = statePath(target);
	if (!existsSync(path)) {
		return undefined;
	}
	const parsed = stateSchema.safeParse(JSON.parse(readFileSync(path, "utf8")));
	return parsed.success ? parsed.data : undefined;
};

export const writeState = (target: string, state: ControlState) => {
	mkdirSync(targetDir(target), { recursive: true });
	writeFileSync(statePath(target), `${JSON.stringify(state, null, 2)}\n`);
};

export const removeTargetDir = (target: string) => {
	rmSync(targetDir(target), { recursive: true, force: true });
};
