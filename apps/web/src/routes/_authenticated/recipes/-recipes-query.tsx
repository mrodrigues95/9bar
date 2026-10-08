import { createServerFn } from "@tanstack/react-start";
import { BookOpen, CircleDot, Coffee, Cog, Gauge, Scale, Tags } from "lucide-react";
import { z } from "zod";
import type { FilterBarDefinition, FilterBarFilterState } from "@9bar/toolkit/components/composed";
import {
	GRINDER_OPTIONS,
	MACHINE_OPTIONS,
	METHOD_LABELS,
	RECIPE_STATUS_LABELS,
	VERDICT_LABELS,
	getBrewSnapshot,
	getRecipeLogs,
	logs,
	recipes,
	type TBrewSnapshot,
	type TLog,
	type TRecipe,
} from "../../../utils/data";
import { objectKeys } from "../../../utils/utils";

export const PAGE_SIZE = 10;

const OPERATORS = {
	is: { id: "is", label: "is" },
	"is-not": { id: "is-not", label: "is not" },
	"is-any-of": { id: "is-any-of", label: "is any of" },
	"is-none-of": { id: "is-none-of", label: "is none of" },
} as const;

const ATTRIBUTE_OPERATOR_PAIRS = [
	{ singular: "is", plural: "is-any-of" },
	{ singular: "is-not", plural: "is-none-of" },
] as const;

const ATTRIBUTE_OPERATORS = [
	OPERATORS.is,
	OPERATORS["is-not"],
	OPERATORS["is-any-of"],
	OPERATORS["is-none-of"],
];

const toOptions = <T extends string>(labels: Record<T, string>) => {
	return objectKeys(labels).map((id) => ({ id, label: labels[id] }));
};

export const ROW_KIND_LABELS = {
	recipe: "Recipes",
	"attached-log": "Attached logs",
	"quick-log": "Quick logs",
} as const;

export const FILTER_DEFINITIONS = [
	{
		id: "type",
		label: "Type",
		icon: <Tags />,
		pluralLabel: "types",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: toOptions(ROW_KIND_LABELS),
	},
	{
		id: "recipe",
		label: "Recipe",
		icon: <BookOpen />,
		pluralLabel: "recipes",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: recipes.map((recipe) => ({ id: String(recipe.id), label: recipe.name })),
	},
	{
		id: "method",
		label: "Method",
		icon: <Coffee />,
		pluralLabel: "methods",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: toOptions(METHOD_LABELS),
	},
	{
		id: "verdict",
		label: "Verdict",
		icon: <Scale />,
		pluralLabel: "verdicts",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: toOptions(VERDICT_LABELS),
	},
	{
		id: "status",
		label: "Status",
		icon: <CircleDot />,
		pluralLabel: "statuses",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: toOptions(RECIPE_STATUS_LABELS),
	},
	{
		id: "machine",
		label: "Machine",
		icon: <Gauge />,
		pluralLabel: "machines",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: MACHINE_OPTIONS.map((option) => ({ id: option.id, label: option.name })),
	},
	{
		id: "grinder",
		label: "Grinder",
		icon: <Cog />,
		pluralLabel: "grinders",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: GRINDER_OPTIONS.map((option) => ({ id: option.id, label: option.name })),
	},
] as const satisfies ReadonlyArray<FilterBarDefinition>;

type TFilterId = (typeof FILTER_DEFINITIONS)[number]["id"];

export type TFilterSearchParams = Partial<Record<TFilterId, string | undefined>>;

const filterParamSchema = z.string().optional().catch(undefined);

export const FILTER_PARAM_SCHEMA = {
	type: filterParamSchema,
	recipe: filterParamSchema,
	method: filterParamSchema,
	verdict: filterParamSchema,
	status: filterParamSchema,
	machine: filterParamSchema,
	grinder: filterParamSchema,
} satisfies Record<TFilterId, typeof filterParamSchema>;

export type TRecipesRowKind = keyof typeof ROW_KIND_LABELS;

/** One row of the Recipes list: a recipe, an attached log, or a quick log. */
export type TRecipesListRow =
	| {
			kind: "recipe";
			key: string;
			lastActivityAt: string;
			recipe: TRecipe;
			snapshot: TBrewSnapshot;
	  }
	| {
			kind: "log";
			key: string;
			lastActivityAt: string;
			log: TLog;
			snapshot: TBrewSnapshot;
			recipe: TRecipe | null;
	  };

export const getRowKind = (row: TRecipesListRow): TRecipesRowKind => {
	if (row.kind === "recipe") {
		return "recipe";
	}
	return row.recipe ? "attached-log" : "quick-log";
};

/** A recipe's last activity: its newest log, or its last edit. */
const getRecipeLastActivity = (recipe: TRecipe): string => {
	const [latestLog] = getRecipeLogs(recipe.id);
	if (latestLog && latestLog.shotAt > recipe.updatedAt) {
		return latestLog.shotAt;
	}
	return recipe.updatedAt;
};

const buildRows = (): Array<TRecipesListRow> => {
	const rows: Array<TRecipesListRow> = [];

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

	for (const log of logs) {
		const snapshot = getBrewSnapshot(log.brewSnapshotId);
		if (!snapshot) {
			continue;
		}
		const recipe =
			log.recipeId === null ? null : (recipes.find((row) => row.id === log.recipeId) ?? null);
		rows.push({
			kind: "log",
			key: `log-${log.id}`,
			lastActivityAt: log.shotAt,
			log,
			snapshot,
			recipe,
		});
	}

	return rows;
};

/**
 * Reads active filters from URL params written as `<operatorId>.<value>|<value>`,
 * dropping unknown definitions, operators, and values so a hand-edited URL
 * degrades instead of throwing.
 */
export const decodeFilters = (params: TFilterSearchParams): Array<FilterBarFilterState> => {
	const filters: Array<FilterBarFilterState> = [];
	for (const definition of FILTER_DEFINITIONS) {
		const param = params[definition.id];
		if (!param) {
			continue;
		}
		const operatorSeparator = param.indexOf(".");
		if (operatorSeparator < 0) {
			continue;
		}
		const operatorId = param.slice(0, operatorSeparator);
		if (!definition.operators.some((operator) => operator.id === operatorId)) {
			continue;
		}
		const values = param
			.slice(operatorSeparator + 1)
			.split("|")
			.filter((value) => definition.options.some((option) => option.id === value));
		if (values.length === 0) {
			continue;
		}
		filters.push({ filterId: definition.id, operatorId, values });
	}
	return filters;
};

/** Writes active filters into URL params; empty filters become `undefined` so a removed chip leaves the URL. */
export const encodeFilters = (filters: Array<FilterBarFilterState>): TFilterSearchParams => {
	const params: TFilterSearchParams = {};
	const filterByFilterId = new Map<string, FilterBarFilterState>(
		filters.map((filter) => [filter.filterId, filter]),
	);
	for (const definition of FILTER_DEFINITIONS) {
		const filter = filterByFilterId.get(definition.id);
		params[definition.id] = filter?.values.length
			? `${filter.operatorId}.${filter.values.join("|")}`
			: undefined;
	}
	return params;
};

/** Applies one filter's operator to a field value; unsupported operators keep the row. */
const matchesOperator = (operatorId: string, selected: Array<string>, value: string): boolean => {
	const isSelected = selected.includes(value);
	if (operatorId === "is" || operatorId === "is-any-of") {
		return isSelected;
	}
	if (operatorId === "is-not" || operatorId === "is-none-of") {
		return !isSelected;
	}
	return true;
};

/**
 * Row-scoped filter fields. `null` means the row has no value for that filter, and never matches —
 * so a Verdict filter hides recipe rows and a Status filter hides log rows.
 */
const FIELD_BY_FILTER_ID = new Map<string, (row: TRecipesListRow) => string | null>([
	["type", (row) => getRowKind(row)],
	["recipe", (row) => (row.recipe ? String(row.recipe.id) : null)],
	["method", (row) => row.snapshot.method],
	["verdict", (row) => (row.kind === "log" ? row.log.verdict : null)],
	[
		"status",
		(row) => {
			if (row.kind === "recipe") {
				return row.recipe.status;
			}
			// Selecting Retired also brings back a retired recipe's attached logs.
			return row.recipe?.status === "retired" ? row.recipe.status : null;
		},
	],
	["machine", (row) => row.snapshot.machine],
	["grinder", (row) => row.snapshot.grinder],
]);

const matchesFilters = (
	row: TRecipesListRow,
	filters: ReadonlyArray<FilterBarFilterState>,
): boolean => {
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

const matchesQuery = (values: Array<string>, query: string): boolean => {
	return values.some((value) => value.toLowerCase().includes(query));
};

/** Search matches recipe names and beans only. */
const matchesSearch = (row: TRecipesListRow, query: string): boolean => {
	if (!query) {
		return true;
	}
	if (row.kind === "recipe") {
		return matchesQuery([row.recipe.name, row.snapshot.beans], query);
	}
	return matchesQuery([row.snapshot.beans, row.recipe?.name ?? ""], query);
};

/** Retired recipes and their attached logs are hidden unless Status = Retired or a search matches them. */
const isRetiredHidden = (
	row: TRecipesListRow,
	filters: ReadonlyArray<FilterBarFilterState>,
	query: string,
): boolean => {
	if (row.recipe?.status !== "retired") {
		return false;
	}
	const statusFilter = filters.find((filter) => filter.filterId === "status");
	if (statusFilter?.values.includes("retired")) {
		return false;
	}
	return !query;
};

const LATENCY_MIN_MS = 100;
const LATENCY_MAX_MS = 750;

const simulateLatency = (): Promise<void> => {
	const delay = LATENCY_MIN_MS + Math.random() * (LATENCY_MAX_MS - LATENCY_MIN_MS);
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
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
