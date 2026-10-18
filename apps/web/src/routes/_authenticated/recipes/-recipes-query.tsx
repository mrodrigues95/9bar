import { createServerFn } from "@tanstack/react-start";
import { BookOpen, CircleDot, Coffee, Cog, Gauge, Scale, Tags } from "lucide-react";
import type { FilterBarDefinition, FilterBarFilterState } from "@9bar/toolkit/components/composed";
import {
	GRINDER_OPTIONS,
	MACHINE_OPTIONS,
	METHOD_OPTIONS,
	RECIPE_STATUS_OPTIONS,
	VERDICT_OPTIONS,
	getBrewSnapshot,
	getRecipeLogs,
	logs,
	recipes,
	type BrewSnapshot,
	type Log,
	type Recipe,
} from "../../../utils/data";
import {
	DEFAULT_FILTER_OPERATOR_ID,
	FILTER_OPERATOR_PAIRS,
	FILTER_OPERATORS,
	decodeFilters as decodeSharedFilters,
	encodeFilters as encodeSharedFilters,
	filterParamSchema,
	matchesOperator,
} from "../../../utils/filter-codec";
import { simulateLatency } from "../../../utils/simulate-latency";
import { toLabels } from "../../../utils/utils";

export const PAGE_SIZE = 10;

const toFilterOptions = (options: ReadonlyArray<{ id: string; name: string }>) => {
	return options.map((option) => ({ id: option.id, label: option.name }));
};

const ROW_KIND_OPTIONS = [
	{ id: "recipe", name: "Recipe", pluralName: "Recipes" },
	{ id: "attached-log", name: "Attached log", pluralName: "Attached logs" },
	{ id: "quick-log", name: "Quick log", pluralName: "Quick logs" },
] as const;

export const ROW_KIND_NAMES = toLabels(ROW_KIND_OPTIONS);

export const FILTER_DEFINITIONS = [
	{
		id: "type",
		label: "Type",
		icon: <Tags />,
		pluralLabel: "types",
		operators: FILTER_OPERATORS,
		defaultOperatorId: DEFAULT_FILTER_OPERATOR_ID,
		operatorPairs: FILTER_OPERATOR_PAIRS,
		options: ROW_KIND_OPTIONS.map(({ id, pluralName }) => ({ id, label: pluralName })),
	},
	{
		id: "recipe",
		label: "Recipe",
		icon: <BookOpen />,
		pluralLabel: "recipes",
		operators: FILTER_OPERATORS,
		defaultOperatorId: DEFAULT_FILTER_OPERATOR_ID,
		operatorPairs: FILTER_OPERATOR_PAIRS,
		options: recipes.map((recipe) => ({ id: String(recipe.id), label: recipe.name })),
	},
	{
		id: "method",
		label: "Method",
		icon: <Coffee />,
		pluralLabel: "methods",
		operators: FILTER_OPERATORS,
		defaultOperatorId: DEFAULT_FILTER_OPERATOR_ID,
		operatorPairs: FILTER_OPERATOR_PAIRS,
		options: toFilterOptions(METHOD_OPTIONS),
	},
	{
		id: "verdict",
		label: "Verdict",
		icon: <Scale />,
		pluralLabel: "verdicts",
		operators: FILTER_OPERATORS,
		defaultOperatorId: DEFAULT_FILTER_OPERATOR_ID,
		operatorPairs: FILTER_OPERATOR_PAIRS,
		options: toFilterOptions(VERDICT_OPTIONS),
	},
	{
		id: "status",
		label: "Status",
		icon: <CircleDot />,
		pluralLabel: "statuses",
		operators: FILTER_OPERATORS,
		defaultOperatorId: DEFAULT_FILTER_OPERATOR_ID,
		operatorPairs: FILTER_OPERATOR_PAIRS,
		options: toFilterOptions(RECIPE_STATUS_OPTIONS),
	},
	{
		id: "machine",
		label: "Machine",
		icon: <Gauge />,
		pluralLabel: "machines",
		operators: FILTER_OPERATORS,
		defaultOperatorId: DEFAULT_FILTER_OPERATOR_ID,
		operatorPairs: FILTER_OPERATOR_PAIRS,
		options: toFilterOptions(MACHINE_OPTIONS),
	},
	{
		id: "grinder",
		label: "Grinder",
		icon: <Cog />,
		pluralLabel: "grinders",
		operators: FILTER_OPERATORS,
		defaultOperatorId: DEFAULT_FILTER_OPERATOR_ID,
		operatorPairs: FILTER_OPERATOR_PAIRS,
		options: toFilterOptions(GRINDER_OPTIONS),
	},
] as const satisfies ReadonlyArray<FilterBarDefinition>;

type FilterId = (typeof FILTER_DEFINITIONS)[number]["id"];

export type FilterSearchParams = Partial<Record<FilterId, string | undefined>>;

export const FILTER_PARAM_SCHEMA = {
	type: filterParamSchema,
	recipe: filterParamSchema,
	method: filterParamSchema,
	verdict: filterParamSchema,
	status: filterParamSchema,
	machine: filterParamSchema,
	grinder: filterParamSchema,
} satisfies Record<FilterId, typeof filterParamSchema>;

export type RecipesListRow =
	| {
			kind: "recipe";
			key: string;
			lastActivityAt: string;
			recipe: Recipe;
			snapshot: BrewSnapshot;
	  }
	| {
			kind: "attached-log";
			key: string;
			lastActivityAt: string;
			log: Log;
			snapshot: BrewSnapshot;
			recipe: Recipe;
	  }
	| {
			kind: "quick-log";
			key: string;
			lastActivityAt: string;
			log: Log;
			snapshot: BrewSnapshot;
	  };

const getRecipeLastActivity = (recipe: Recipe) => {
	const [latestLog] = getRecipeLogs(recipe.id);
	if (latestLog && latestLog.shotAt > recipe.updatedAt) {
		return latestLog.shotAt;
	}
	return recipe.updatedAt;
};

const buildRows = () => {
	const rows: Array<RecipesListRow> = [];

	for (const recipe of recipes) {
		const snapshot = getBrewSnapshot(recipe.brewSnapshotId);
		if (!snapshot) {
			continue;
		}
		rows.push({
			kind: "recipe",
			key: `recipe-${recipe.id}`,
			lastActivityAt: getRecipeLastActivity(recipe),
			recipe,
			snapshot,
		});
	}

	const recipesById = new Map<number, Recipe>(recipes.map((recipe) => [recipe.id, recipe]));

	for (const log of logs) {
		const snapshot = getBrewSnapshot(log.brewSnapshotId);
		if (!snapshot) {
			continue;
		}
		const key = `log-${log.id}`;
		if (log.recipeId === null) {
			rows.push({ kind: "quick-log", key, lastActivityAt: log.shotAt, log, snapshot });
			continue;
		}
		const recipe = recipesById.get(log.recipeId);
		if (!recipe) {
			continue;
		}
		rows.push({ kind: "attached-log", key, lastActivityAt: log.shotAt, log, snapshot, recipe });
	}

	return rows;
};

export const decodeFilters = (params: FilterSearchParams) => {
	return decodeSharedFilters(FILTER_DEFINITIONS, params);
};

export const encodeFilters = (filters: Array<FilterBarFilterState>) => {
	return encodeSharedFilters(FILTER_DEFINITIONS, filters);
};

const FIELD_BY_FILTER_ID = new Map<string, (row: RecipesListRow) => string | null>([
	["type", (row) => row.kind],
	["recipe", (row) => (row.kind === "quick-log" ? null : String(row.recipe.id))],
	["method", (row) => row.snapshot.method],
	["verdict", (row) => (row.kind === "recipe" ? null : row.log.verdict)],
	[
		"status",
		(row) => {
			if (row.kind === "recipe") {
				return row.recipe.status;
			}
			return row.kind === "attached-log" && row.recipe.status === "retired"
				? row.recipe.status
				: null;
		},
	],
	["machine", (row) => row.snapshot.machine],
	["grinder", (row) => row.snapshot.grinder],
]);

const matchesFilters = (row: RecipesListRow, filters: ReadonlyArray<FilterBarFilterState>) => {
	return filters.every((filter) => {
		const readField = FIELD_BY_FILTER_ID.get(filter.filterId);
		if (!readField) {
			return true;
		}
		const value = readField(row);
		if (value === null) {
			return false;
		}
		return matchesOperator(filter.operatorId, filter.values, value);
	});
};

const matchesQuery = (values: Array<string>, query: string) => {
	return values.some((value) => value.toLowerCase().includes(query));
};

const matchesSearch = (row: RecipesListRow, query: string) => {
	if (!query) {
		return true;
	}
	return matchesQuery([row.snapshot.beans, row.kind === "quick-log" ? "" : row.recipe.name], query);
};

const isRetiredHidden = (
	row: RecipesListRow,
	filters: ReadonlyArray<FilterBarFilterState>,
	query: string,
) => {
	if (row.kind === "quick-log" || row.recipe.status !== "retired") {
		return false;
	}
	const statusFilter = filters.find((filter) => filter.filterId === "status");
	if (statusFilter?.values.includes("retired")) {
		return false;
	}
	return !query;
};

interface ListRecipesInput {
	search: string;
	filters: Array<FilterBarFilterState>;
	page: number;
	pageSize: number;
}

export const listRecipes = createServerFn({ method: "GET" })
	.validator((data: ListRecipesInput) => data)
	.handler(async ({ data }) => {
		await simulateLatency();

		const query = data.search.trim().toLowerCase();
		const matched = buildRows()
			.filter((row) => matchesSearch(row, query))
			.filter((row) => matchesFilters(row, data.filters))
			.filter((row) => !isRetiredHidden(row, data.filters, query))
			.sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));

		const totalPages = Math.max(1, Math.ceil(matched.length / data.pageSize));
		const currentPage = Math.min(Math.max(1, data.page), totalPages);
		const offset = (currentPage - 1) * data.pageSize;

		return {
			items: matched.slice(offset, offset + data.pageSize),
			total: matched.length,
			page: currentPage,
			pageSize: data.pageSize,
		};
	});
