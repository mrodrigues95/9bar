import { parseArgs, stripVTControlCharacters } from "node:util";
import { z } from "zod";
import { inspectCommands } from "./commands/inspect.ts";
import { lifecycleCommands } from "./commands/lifecycle.ts";
import { pageCommands } from "./commands/page.ts";
import { ControlError, printFailure, printResult } from "./output.ts";
import { toolkit } from "./targets/toolkit.ts";
import { web } from "./targets/web.ts";
import type { Command, Flags, Target } from "./types.ts";

const targets = new Map([web, toolkit].map((target) => [target.name, target]));

const commandsFor = (target: Target) =>
	new Map<string, Command>(
		Object.entries({
			...lifecycleCommands,
			...pageCommands,
			...inspectCommands,
			...target.commands,
		}),
	);

const parseFlags = (command: Command, args: Array<string>) => {
	const { values, positionals } = parseArgs({
		args,
		allowPositionals: true,
		strict: true,
		options: Object.fromEntries(
			Object.entries(command.options).map(([name, spec]) => [name, { type: spec.type }]),
		),
	});
	const flags: Flags = { strings: new Map(), booleans: new Set() };
	for (const [name, spec] of Object.entries(command.options)) {
		if (spec.type === "string") {
			const value = z.string().optional().parse(values[name]);
			if (value !== undefined) {
				flags.strings.set(name, value);
			}
		} else if (z.boolean().optional().parse(values[name]) === true) {
			flags.booleans.add(name);
		}
	}
	return { flags, positionals };
};

const rootHelp = () =>
	[
		"pnpm control <target> <command> [flags]",
		"",
		"Drives a dev server and headless Chromium that control launched. Output is JSON.",
		"Start with `launch`, check with `doctor`, finish with `cleanup` (artifacts are kept).",
		"",
		"Targets:",
		...[...targets.values()].map((target) => `  ${target.name.padEnd(10)}${target.description}`),
		"",
		"Run `pnpm control <target> --help` for its commands.",
	].join("\n");

const targetHelp = (target: Target) =>
	[
		`pnpm control ${target.name} <command> [flags]`,
		"",
		target.description,
		"",
		"Commands:",
		...[...commandsFor(target)].map(([name, command]) => `  ${name.padEnd(13)}${command.summary}`),
		"",
		`Run \`pnpm control ${target.name} <command> --help\` for flags.`,
	].join("\n");

const commandHelp = (target: Target, command: Command) =>
	[
		command.usage.replace("<target>", target.name),
		"",
		command.summary,
		...(Object.keys(command.options).length === 0
			? []
			: [
					"",
					"Flags:",
					...Object.entries(command.options).map(
						([name, flag]) =>
							`  --${(flag.type === "string" ? `${name} <value>` : name).padEnd(22)}${flag.description}`,
					),
				]),
	].join("\n");

const run = async (argv: Array<string>) => {
	const [targetName, commandName, ...rest] = argv;
	if (targetName === undefined || targetName === "--help" || targetName === "-h") {
		console.log(rootHelp());
		return;
	}
	const target = targets.get(targetName);
	if (target === undefined) {
		printFailure(`Unknown target "${targetName}".`, `Targets: ${[...targets.keys()].join(", ")}.`);
		return;
	}
	if (commandName === undefined || commandName === "--help" || commandName === "-h") {
		console.log(targetHelp(target));
		return;
	}
	const command = commandsFor(target).get(commandName);
	if (command === undefined) {
		printFailure(
			`Unknown command "${commandName}" for ${target.name}.`,
			`Run \`pnpm control ${target.name} --help\` to list commands.`,
		);
		return;
	}
	if (rest.includes("--help") || rest.includes("-h")) {
		console.log(commandHelp(target, command));
		return;
	}
	const { flags, positionals } = parseFlags(command, rest);
	const result = await command.run({ target, flags, positionals });
	printResult(result);
	if (result["ok"] === false) {
		process.exitCode = 1;
	}
};

try {
	await run(process.argv.slice(2));
} catch (error) {
	if (error instanceof ControlError) {
		printFailure(error.message, error.hint);
	} else {
		const raw = error instanceof Error ? error.message : String(error);
		const message = stripVTControlCharacters(raw).split("\nCall log:")[0] ?? raw;
		printFailure(
			message.trim(),
			raw.includes("element is inert") || raw.includes("intercepts pointer events")
				? "A menu, popover or dialog covers the element. Run snapshot to see it; press Escape to close it."
				: "Run `pnpm control <target> doctor` to see whether the instance is healthy.",
		);
	}
}
