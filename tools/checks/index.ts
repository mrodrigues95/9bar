import { checkDependencies } from "./dependencies.ts";
import { checkPlacement } from "./placement.ts";
import { checkSkills } from "./skills.ts";
import { checkToolkit } from "./toolkit.ts";

const groups = [
	{ name: "placement (apps/web)", failures: checkPlacement() },
	{ name: "toolkit structure", failures: checkToolkit() },
	{ name: "forked skills", failures: checkSkills() },
	{ name: "dependencies", failures: checkDependencies() },
];

const total = groups.reduce((count, group) => count + group.failures.length, 0);

for (const group of groups) {
	for (const failure of group.failures) {
		console.error(`${group.name}: ${failure.file}\n  ${failure.problem}\n  fix: ${failure.fix}`);
	}
}

if (total > 0) {
	console.error(`\ncheck:structure found ${total} problem(s).`);
	process.exit(1);
}

console.log("check:structure passed.");
