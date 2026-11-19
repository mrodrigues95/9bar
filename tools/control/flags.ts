import { fail } from "./output.ts";
import type { FlagSpec, Flags } from "./types.ts";

export const stringFlag = (flags: Flags, name: string) => flags.strings.get(name);

export const booleanFlag = (flags: Flags, name: string) => flags.booleans.has(name);

export const numberFlag = (flags: Flags, name: string) => {
	const raw = stringFlag(flags, name);
	if (raw === undefined) {
		return undefined;
	}
	const parsed = Number(raw);
	if (!Number.isInteger(parsed) || parsed < 0) {
		return fail(`--${name} must be a whole number, got "${raw}".`, `Pass --${name} <number>.`);
	}
	return parsed;
};

export const requirePositional = (positionals: Array<string>, name: string, usage: string) => {
	const value = positionals[0];
	if (value === undefined || value === "") {
		return fail(`Missing <${name}>.`, `Usage: ${usage}`);
	}
	return value;
};

export const locatorFlags = {
	role: { type: "string", description: "ARIA role, e.g. button, link, textbox (pair with --name)" },
	name: { type: "string", description: "accessible name, substring and case-insensitive" },
	exact: { type: "boolean", description: "match --name exactly and case-sensitively" },
	label: { type: "string", description: "form control label text" },
	text: { type: "string", description: "visible text" },
	placeholder: { type: "string", description: "input placeholder" },
	testid: { type: "string", description: "data-testid value" },
	selector: { type: "string", description: "CSS selector, last resort" },
	nth: { type: "string", description: "pick the nth match (0-based) when several match" },
} satisfies Record<string, FlagSpec>;

export const timeoutFlag = {
	timeout: { type: "string", description: "milliseconds to wait for the element (default 5000)" },
} satisfies Record<string, FlagSpec>;
