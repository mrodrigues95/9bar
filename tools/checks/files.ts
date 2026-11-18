import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

export interface Failure {
	file: string;
	problem: string;
	fix: string;
}

export const repoRoot = resolve(import.meta.dirname, "../..");

export const fromRoot = (...segments: Array<string>) => join(repoRoot, ...segments);

export const toRepoPath = (path: string) => relative(repoRoot, path);

export const readText = (path: string) => readFileSync(path, "utf8");

export const isDirectory = (path: string) => existsSync(path) && statSync(path).isDirectory();

export const listDirectories = (path: string) =>
	isDirectory(path)
		? readdirSync(path, { withFileTypes: true })
				.filter((entry) => entry.isDirectory())
				.map((entry) => entry.name)
				.toSorted()
		: [];

export const walkFiles = (root: string, extensions: ReadonlyArray<string>) => {
	const files: Array<string> = [];
	const pending = isDirectory(root) ? [root] : [];
	for (let directory = pending.pop(); directory !== undefined; directory = pending.pop()) {
		for (const entry of readdirSync(directory, { withFileTypes: true })) {
			const full = join(directory, entry.name);
			if (entry.isDirectory()) {
				if (entry.name !== "node_modules") {
					pending.push(full);
				}
			} else if (extensions.some((extension) => entry.name.endsWith(extension))) {
				files.push(full);
			}
		}
	}
	return files.toSorted();
};

const RELATIVE_IMPORT = /(?:import|export)[^'"]*?from\s+["'](\.{1,2}\/[^"']+)["']/gu;
const RESOLVE_SUFFIXES = [".ts", ".tsx", "/index.ts", "/index.tsx"];

export const relativeImports = (file: string) =>
	[...readText(file).matchAll(RELATIVE_IMPORT)].flatMap((match) => {
		const specifier = match[1];
		if (specifier === undefined) {
			return [];
		}
		const base = resolve(dirname(file), specifier);
		const target = [base, ...RESOLVE_SUFFIXES.map((suffix) => `${base}${suffix}`)].find(
			(candidate) => existsSync(candidate) && statSync(candidate).isFile(),
		);
		return target === undefined ? [] : [target];
	});
