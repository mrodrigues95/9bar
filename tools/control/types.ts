import type { Page } from "playwright-core";

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Array<JsonValue>
	| { [key: string]: JsonValue };

export type CommandResult = { [key: string]: JsonValue };

export interface Flags {
	strings: Map<string, string>;
	booleans: Set<string>;
}

export interface CommandContext {
	target: Target;
	flags: Flags;
	positionals: Array<string>;
}

export interface FlagSpec {
	type: "string" | "boolean";
	description: string;
}

export interface Command {
	summary: string;
	usage: string;
	options: Record<string, FlagSpec>;
	run: (context: CommandContext) => Promise<CommandResult>;
}

export interface Target {
	name: string;
	description: string;
	packageDir: string;
	defaultPort: number;
	defaultCdpPort: number;
	serverArgs: (port: number) => Array<string>;
	identify: (baseUrl: string) => Promise<string | undefined>;
	afterNavigate?: (page: Page) => Promise<void>;
	applyTheme?: (page: Page, theme: string) => Promise<void>;
	commands: Record<string, Command>;
}
