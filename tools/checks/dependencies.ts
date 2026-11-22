import { readdirSync } from "node:fs";
import { builtinModules } from "node:module";
import { join } from "node:path";
import { z } from "zod";
import {
	fromRoot,
	isDirectory,
	listDirectories,
	readText,
	toRepoPath,
	walkFiles,
} from "./files.ts";

const manifestSchema = z.object({
	name: z.string(),
	workspaces: z.array(z.string()).optional(),
	dependencies: z.record(z.string(), z.string()).optional(),
	devDependencies: z.record(z.string(), z.string()).optional(),
	peerDependencies: z.record(z.string(), z.string()).optional(),
	optionalDependencies: z.record(z.string(), z.string()).optional(),
});

type Manifest = z.infer<typeof manifestSchema>;

const SOURCE_EXTENSIONS = [".ts", ".tsx", ".mts", ".cts", ".js", ".jsx", ".mjs", ".cjs"];
const GENERATED = /\/(?:dist|storybook-static|\.tanstack)\/|\.gen\.[^/]+$/u;
const SPECIFIER =
	/(?:^|[\s;])(?:import|export)\s+(?:[^'"]*?\sfrom\s+)?["']([^"']+)["']|\bimport\(\s*["']([^"']+)["']\s*\)/gu;
const NOT_A_PACKAGE = /^(?:\.|\/|#|~\/|@\/|node:|virtual:)/u;
const builtins = new Set(builtinModules);

const readManifest = (directory: string) =>
	manifestSchema.parse(JSON.parse(readText(join(directory, "package.json"))));

const packageName = (specifier: string) =>
	specifier
		.split("/")
		.slice(0, specifier.startsWith("@") ? 2 : 1)
		.join("/");

const bareImports = (file: string) =>
	new Set(
		[...readText(file).matchAll(SPECIFIER)].flatMap((match) => {
			const specifier = match[1] ?? match[2];
			if (specifier === undefined || NOT_A_PACKAGE.test(specifier)) {
				return [];
			}
			const name = packageName(specifier);
			return builtins.has(name) ? [] : [name];
		}),
	);

const declared = (manifest: Manifest) =>
	new Set([
		manifest.name,
		...Object.keys(manifest.dependencies ?? {}),
		...Object.keys(manifest.devDependencies ?? {}),
		...Object.keys(manifest.peerDependencies ?? {}),
		...Object.keys(manifest.optionalDependencies ?? {}),
	]);

const workspaceDirectories = (patterns: ReadonlyArray<string>) =>
	patterns.flatMap((pattern) =>
		pattern.endsWith("/*")
			? listDirectories(fromRoot(pattern.slice(0, -2))).map((name) =>
					fromRoot(pattern.slice(0, -2), name),
				)
			: [fromRoot(pattern)],
	);

const rootFiles = () =>
	readdirSync(fromRoot(), { withFileTypes: true }).flatMap((entry) =>
		entry.isFile() && SOURCE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))
			? [fromRoot(entry.name)]
			: [],
	);

const undeclaredImports = (directory: string, files: ReadonlyArray<string>) => {
	const manifest = readManifest(directory);
	const allowed = declared(manifest);
	const manifestPath = toRepoPath(join(directory, "package.json")) || "package.json";
	return files
		.filter((file) => !GENERATED.test(file))
		.flatMap((file) =>
			[...bareImports(file)].flatMap((name) =>
				allowed.has(name)
					? []
					: [
							{
								file: toRepoPath(file),
								problem: `imports "${name}", which ${manifestPath} does not declare`,
								fix: `Add "${name}" to ${manifestPath}. When another package already declares it, add it to the catalog in pnpm-workspace.yaml and use "catalog:".`,
							},
						],
			),
		);
};

export const checkDependencies = () => {
	const root = readManifest(fromRoot());
	const rootDependencies =
		Object.keys(root.dependencies ?? {}).length > 0
			? [
					{
						file: "package.json",
						problem: "the workspace root declares runtime dependencies",
						fix: "Move each one into the packages that import it. The root holds only repo tooling, in devDependencies.",
					},
				]
			: [];
	const packages = workspaceDirectories(root.workspaces ?? [])
		.filter((directory) => isDirectory(directory))
		.flatMap((directory) => undeclaredImports(directory, walkFiles(directory, SOURCE_EXTENSIONS)));
	return [...rootDependencies, ...undeclaredImports(fromRoot(), rootFiles()), ...packages];
};
