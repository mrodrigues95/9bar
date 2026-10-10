import { createServerFn } from "@tanstack/react-start";
import { BookOpen, CircleDot, Coffee, Cog, Gauge, Scale, Tags } from "lucide-react";
import { z } from "zod";
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
	type TBrewSnapshot,
	type TLog,
	type TRecipe,
} from "../../../utils/data";
import { toLabels } from "../../../utils/utils";

export const PAGE_SIZE = 10;

const OPERATORS = {
	is: { id: "is", label: "is" },
	"is-not": { id: "is-not", label: "is not" },
	"is-any-of": { id: "is-any-of", label: "is any of" },
	"is-none-of": { id: "is-none-of", label: "is none of" },
	"include-all-of": { id: "include-all-of", label: "include all of" },
	"include-any-of": { id: "include-any-of", label: "include any of" },
	"exclude-if-any-of": { id: "exclude-if-any-of", label: "exclude if any of" },
	"exclude-if-all": { id: "exclude-if-all", label: "exclude if all" },
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
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: ROW_KIND_OPTIONS.map(({ id, pluralName }) => ({ id, label: pluralName })),
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
		options: toFilterOptions(METHOD_OPTIONS),
	},
	{
		id: "verdict",
		label: "Verdict",
		icon: <Scale />,
		pluralLabel: "verdicts",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: toFilterOptions(VERDICT_OPTIONS),
	},
	{
		id: "status",
		label: "Status",
		icon: <CircleDot />,
		pluralLabel: "statuses",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: toFilterOptions(RECIPE_STATUS_OPTIONS),
	},
	{
		id: "machine",
		label: "Machine",
		icon: <Gauge />,
		pluralLabel: "machines",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: toFilterOptions(MACHINE_OPTIONS),
	},
	{
		id: "grinder",
		label: "Grinder",
		icon: <Cog />,
		pluralLabel: "grinders",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: toFilterOptions(GRINDER_OPTIONS),
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

export type TRecipesListRow =
	| {
			kind: "recipe";
			key: string;
			lastActivityAt: string;
			recipe: TRecipe;
			snapshot: TBrewSnapshot;
	  }
	| {
			kind: "attached-log";
			key: string;
			lastActivityAt: string;
			log: TLog;
			snapshot: TBrewSnapshot;
			recipe: TRecipe;
	  }
	| {
			kind: "quick-log";
			key: string;
			lastActivityAt: string;
			log: TLog;
			snapshot: TBrewSnapshot;
	  };

const getRecipeLastActivity = (recipe: TRecipe) => {
	const [latestLog] = getRecipeLogs(recipe.id);
	if (latestLog && latestLog.shotAt > recipe.updatedAt) {
		return latestLog.shotAt;
	}
	return recipe.updatedAt;
};

const buildRows = () => {
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
		const key = `log-${log.id}`;
		if (log.recipeId === null) {
			rows.push({ kind: "quick-log", key, lastActivityAt: log.shotAt, log, snapshot });
			continue;
		}
		const recipe = recipes.find((row) => row.id === log.recipeId);
		if (!recipe) {
			continue;
		}
		rows.push({ kind: "attached-log", key, lastActivityAt: log.shotAt, log, snapshot, recipe });
	}

	return rows;
};

/**
 * Reads active filters from URL params written as `<operatorId>.<value>|<value>`,
 * dropping unknown definitions, operators, and values so a hand-edited URL
 * degrades instead of throwing.
 */
export const decodeFilters = (params: TFilterSearchParams) => {
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
		if (!values.length) {
			continue;
		}
		filters.push({ filterId: definition.id, operatorId, values });
	}
	return filters;
};

/** Writes active filters into URL params; empty filters become `undefined` so a removed chip leaves the URL. */
export const encodeFilters = (filters: Array<FilterBarFilterState>) => {
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
const matchesOperator = (operatorId: string, selected: Array<string>, value: string) => {
	const isSelected = selected.includes(value);
	if (operatorId === "is" || operatorId === "is-any-of") {
		return isSelected;
	}
	if (operatorId === "is-not" || operatorId === "is-none-of") {
		return !isSelected;
	}
	return true;
};

const FIELD_BY_FILTER_ID = new Map<string, (row: TRecipesListRow) => string | null>([
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

const matchesFilters = (row: TRecipesListRow, filters: ReadonlyArray<FilterBarFilterState>) => {
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

const matchesSearch = (row: TRecipesListRow, query: string) => {
	if (!query) {
		return true;
	}
	return matchesQuery([row.snapshot.beans, row.kind === "quick-log" ? "" : row.recipe.name], query);
};

const isRetiredHidden = (
	row: TRecipesListRow,
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
