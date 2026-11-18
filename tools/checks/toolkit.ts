import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
	type Failure,
	fromRoot,
	listDirectories,
	readText,
	toRepoPath,
	walkFiles,
} from "./files.ts";

const toolkitSource = fromRoot("packages/toolkit/src");
const componentsRoot = join(toolkitSource, "components");
const overviewRoot = join(toolkitSource, "overview");
const TIERS = ["primitive", "composed"];
const EXPORTED_COMPONENT = /export const ([A-Z]\w*)\s*=/gu;

const componentNames = (directory: string) =>
	walkFiles(directory, [".tsx"])
		.filter((file) => !file.endsWith(".stories.tsx"))
		.flatMap((file) =>
			[...readText(file).matchAll(EXPORTED_COMPONENT)].map((match) => match[1] ?? ""),
		);

const checkComponent = (tier: string, name: string, overviewSource: string) => {
	const directory = join(componentsRoot, tier, name);
	const failures: Array<Failure> = [];
	const tierIndex = join(componentsRoot, tier, "index.ts");

	if (!existsSync(join(directory, "index.ts"))) {
		failures.push({
			file: toRepoPath(directory),
			problem: "component directory has no index.ts",
			fix: `Create ${toRepoPath(join(directory, "index.ts"))} with \`export * from "./${name}";\`.`,
		});
	}
	if (!readText(tierIndex).includes(`export * from "./${name}";`)) {
		failures.push({
			file: toRepoPath(tierIndex),
			problem: `tier barrel does not export ${name}`,
			fix: `Add \`export * from "./${name}";\` to ${toRepoPath(tierIndex)}.`,
		});
	}
	if (!existsSync(join(directory, `${name}.stories.tsx`))) {
		failures.push({
			file: toRepoPath(directory),
			problem: "component has no story",
			fix: `Create ${toRepoPath(join(directory, `${name}.stories.tsx`))} with a JSDoc on each story. Stories run as browser and axe tests.`,
		});
	}
	const names = componentNames(directory);
	if (
		names.length > 0 &&
		!names.some((component) => new RegExp(`\\b${component}\\b`, "u").test(overviewSource))
	) {
		failures.push({
			file: toRepoPath(directory),
			problem: "no export from this component appears on the overview canvas",
			fix: `Render ${names[0] ?? name} in the fitting module under ${toRepoPath(join(overviewRoot, "sections"))}.`,
		});
	}
	if (tier === "composed") {
		for (const file of walkFiles(directory, [".tsx"]).filter(
			(path) => !path.endsWith(".stories.tsx"),
		)) {
			if (readText(file).includes("data-slot")) {
				failures.push({
					file: toRepoPath(file),
					problem: "composed component sets data-slot",
					fix: "Remove data-slot. Composed parts are styled through className and their *Variants slots.",
				});
			}
		}
	}
	return failures;
};

export const checkToolkit = () => {
	const overviewSource = walkFiles(overviewRoot, [".tsx", ".ts"]).map(readText).join("\n");
	const components = TIERS.flatMap((tier) =>
		listDirectories(join(componentsRoot, tier)).flatMap((name) =>
			checkComponent(tier, name, overviewSource),
		),
	);
	const flatFiles = readdirSync(componentsRoot)
		.filter((entry) => entry.endsWith(".tsx"))
		.map((entry) => ({
			file: toRepoPath(join(componentsRoot, entry)),
			problem: "flat component file (written by `shadcn add`)",
			fix: `Move it to src/components/<tier>/${entry.replace(/\.tsx$/u, "")}/ or delete it if that directory already exists.`,
		}));
	return [...components, ...flatFiles];
};
