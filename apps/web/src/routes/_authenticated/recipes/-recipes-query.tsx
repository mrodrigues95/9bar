import { createServerFn } from "@tanstack/react-start";
import { Cog, Gauge, Tags } from "lucide-react";
import { z } from "zod";
import type { FilterBarDefinition, FilterBarFilterState } from "@9bar/toolkit/components/composed";
import { GRINDER_OPTIONS, MACHINE_OPTIONS, recipes, type TRecipeGraph } from "../../../utils/data";

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

export const FILTER_DEFINITIONS = [
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
	{
		id: "recipe-type",
		label: "Type",
		icon: <Tags />,
		pluralLabel: "types",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: [
			{ id: "quick-brew", label: "Quick Brew" },
			{ id: "recipe", label: "Recipe" },
		],
	},
] as const satisfies ReadonlyArray<FilterBarDefinition>;

type TFilterId = (typeof FILTER_DEFINITIONS)[number]["id"];

export type TFilterSearchParams = Partial<Record<TFilterId, string | undefined>>;

const filterParamSchema = z.string().optional().catch(undefined);

export const FILTER_PARAM_SCHEMA = {
	machine: filterParamSchema,
	grinder: filterParamSchema,
	"recipe-type": filterParamSchema,
} satisfies Record<TFilterId, typeof filterParamSchema>;

const FIELD_BY_FILTER_ID = new Map<string, (recipe: TRecipeGraph) => string>([
	["machine", (recipe) => recipe.snapshot.machine],
	["grinder", (recipe) => recipe.snapshot.grinder],
	["recipe-type", (recipe) => (recipe.isQuickBrew ? "quick-brew" : "recipe")],
]);

export const machineName = (id: string): string => {
	return MACHINE_OPTIONS.find((option) => option.id === id)?.name ?? id;
};

export const grinderName = (id: string): string => {
	return GRINDER_OPTIONS.find((option) => option.id === id)?.name ?? id;
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

/** Applies one filter's operator to a field value; unsupported operators keep the graph. */
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

const matchesFilters = (
	recipe: TRecipeGraph,
	filters: ReadonlyArray<FilterBarFilterState>,
): boolean => {
	return filters.every((filter) => {
		const field = FIELD_BY_FILTER_ID.get(filter.filterId);
		if (!field) {
			return true;
		}
		return matchesOperator(filter.operatorId, filter.values, field(recipe));
	});
};

const matchesSearch = (recipe: TRecipeGraph, search: string): boolean => {
	const query = search.trim().toLowerCase();
	if (!query) {
		return true;
	}
	const haystack = [
		recipe.name ?? "",
		recipe.snapshot.beans,
		machineName(recipe.snapshot.machine),
		grinderName(recipe.snapshot.grinder),
	];
	return haystack.some((value) => value.toLowerCase().includes(query));
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

		const matched = recipes.filter((recipe) => {
			return matchesSearch(recipe, data.search) && matchesFilters(recipe, data.filters);
		});
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
