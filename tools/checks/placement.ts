import { existsSync } from "node:fs";
import { basename, dirname, join, relative, sep } from "node:path";
import { fromRoot, relativeImports, toRepoPath, walkFiles } from "./files.ts";
import type { Failure } from "./files.ts";

const webSource = fromRoot("apps/web/src");
const routesRoot = join(webSource, "routes");
const SHARED_AREAS = new Set(["components", "utils"]);

const isSourceFile = (file: string) =>
	!basename(file).includes(".gen.") && !basename(file).includes(".test.");

const sharedModuleOf = (file: string) => {
	const [area, name] = relative(webSource, file).split(sep);
	if (area === undefined || !SHARED_AREAS.has(area) || name === undefined) {
		return undefined;
	}
	return join(webSource, area, name.replace(/\.tsx?$/u, ""));
};

const routeOwnerOf = (file: string) => {
	if (!file.startsWith(routesRoot + sep)) {
		return toRepoPath(file);
	}
	let directory = dirname(file);
	while (directory !== routesRoot && !existsSync(join(directory, "route.tsx"))) {
		directory = dirname(directory);
	}
	return toRepoPath(directory === routesRoot ? file : directory);
};

const collectImporters = (files: ReadonlyArray<string>) => {
	const importers = new Map<string, Set<string>>();
	for (const file of files) {
		for (const target of relativeImports(file)) {
			const shared = sharedModuleOf(target);
			if (shared === undefined || shared === sharedModuleOf(file)) {
				continue;
			}
			importers.set(shared, (importers.get(shared) ?? new Set<string>()).add(file));
		}
	}
	return importers;
};

const consumersOf = (
	module: string,
	importers: ReadonlyMap<string, ReadonlySet<string>>,
	visited: Set<string>,
) => {
	const owners = new Set<string>();
	for (const importer of importers.get(module) ?? []) {
		const shared = sharedModuleOf(importer);
		if (shared === undefined) {
			owners.add(routeOwnerOf(importer));
		} else if (!visited.has(shared)) {
			visited.add(shared);
			consumersOf(shared, importers, visited).forEach((owner) => owners.add(owner));
		}
	}
	return owners;
};

export const checkPlacement = () => {
	const files = walkFiles(webSource, [".ts", ".tsx"]).filter(isSourceFile);
	const importers = collectImporters(files);
	const modules = new Set(
		files.flatMap((file) => {
			const module = sharedModuleOf(file);
			return module === undefined ? [] : [module];
		}),
	);

	const placement = [...modules].toSorted().flatMap((module) => {
		const owners = consumersOf(module, importers, new Set([module]));
		if (owners.size >= 2) {
			return [];
		}
		return [
			{
				file: toRepoPath(module),
				problem: `shared module has ${owners.size} route consumer(s)${owners.size > 0 ? `: ${[...owners].join(", ")}` : ""}`,
				fix: "Move it next to its only consumer as a `-`-prefixed sibling, or delete it if unused. Shared code is earned by a second route.",
			} satisfies Failure,
		];
	});

	const barrels = walkFiles(routesRoot, ["index.ts"]).map((file) => ({
		file: toRepoPath(file),
		problem: "barrel file under src/routes",
		fix: "Delete it and import colocated modules by their own path.",
	}));

	return [...placement, ...barrels];
};
