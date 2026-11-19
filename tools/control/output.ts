import type { CommandResult } from "./types.ts";

export class ControlError extends Error {
	readonly hint: string;

	constructor(message: string, hint: string) {
		super(message);
		this.hint = hint;
	}
}

export const fail = (message: string, hint: string) => {
	throw new ControlError(message, hint);
};

export const printResult = (result: CommandResult) => {
	console.log(JSON.stringify({ ok: true, ...result }, null, 2));
};

export const printFailure = (message: string, hint: string) => {
	console.log(JSON.stringify({ ok: false, error: message, hint }, null, 2));
	process.exitCode = 1;
};
