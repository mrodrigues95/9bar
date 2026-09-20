import { Cog, Gauge, Tags } from "lucide-react";
import { z } from "zod";
import type { FilterBarDefinition, FilterBarFilterState } from "@9bar/toolkit/components/composed";
import { GRINDER_OPTIONS, MACHINE_OPTIONS, recipes, type TRecipeGraph } from "../../../utils/data";

/** Rows requested per page. */
export const PAGE_SIZE = 10;

const OPERATORS = {
	/** Matches when the field value equals the selected option. */
	is: { id: "is", label: "is" },
	/** Matches when the field value does not equal the selected option. */
	"is-not": { id: "is-not", label: "is not" },
	/** Matches when the field value equals any one of multiple selected options (OR). */
	"is-any-of": { id: "is-any-of", label: "is any of" },
	/** Matches when the field value does not equal any of the selected options (NOR). */
	"is-none-of": { id: "is-none-of", label: "is none of" },
	/** Matches when the field contains ALL of the selected values (AND). */
	"include-all-of": { id: "include-all-of", label: "include all of" },
	/** Matches when the field contains at least one of the selected values (OR). */
	"include-any-of": { id: "include-any-of", label: "include any of" },
	/** Excludes the item if the field contains ANY of the selected values. */
	"exclude-if-any-of": { id: "exclude-if-any-of", label: "exclude if any of" },
	/** Excludes the item only if the field contains ALL of the selected values. */
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

/** The filterable dimensions of the recipe list, in URL-param order. */
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

/** Id of a filter definition; each one owns a single URL param. */
export type TFilterId = (typeof FILTER_DEFINITIONS)[number]["id"];

/** Active filters as they appear in the URL, one param per definition. */
export type TFilterSearchParams = Partial<Record<TFilterId, string | undefined>>;

const filterParamSchema = z.string().optional().catch(undefined);

/** Search-param schema per filter definition; keys are checked against {@link TFilterId}. */
export const FILTER_PARAM_SCHEMA = {
	machine: filterParamSchema,
	grinder: filterParamSchema,
	"recipe-type": filterParamSchema,
} satisfies Record<TFilterId, typeof filterParamSchema>;

/** Reads the value each filter definition compares against, for one graph. */
const FIELD_BY_FILTER_ID = new Map<string, (recipe: TRecipeGraph) => string>([
	["machine", (recipe: TRecipeGraph) => recipe.snapshot.machine],
	["grinder", (recipe: TRecipeGraph) => recipe.snapshot.grinder],
	["recipe-type", (recipe: TRecipeGraph) => (recipe.isQuickBrew ? "quick-brew" : "recipe")],
]);

/** Human-readable machine name for a snapshot machine id, falling back to the id. */
export const machineName = (id: string): string => {
	return MACHINE_OPTIONS.find((option) => option.id === id)?.name ?? id;
};

/** Human-readable grinder name for a snapshot grinder id, falling back to the id. */
export const grinderName = (id: string): string => {
	return GRINDER_OPTIONS.find((option) => option.id === id)?.name ?? id;
};

/**
 * Reads active filters back out of the URL params, written as
 * `<operatorId>.<value>|<value>`. Unknown definitions, operators, and values
 * are dropped, so a hand-edited URL degrades instead of throwing.
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

/**
 * Writes active filters into URL params, one per definition. Definitions
 * without values are set to `undefined` so a removed chip leaves the URL.
 */
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

/** Whether a graph survives every active filter. */
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

/** Whether a graph matches the free-text query (name, beans, or equipment). */
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

/** Arguments for {@link listRecipes}. */
export interface RecipeListParams {
	/** Free-text query matched against names, beans, and equipment. */
	search: string;
	/** Active filters, already decoded from the URL. */
	filters: ReadonlyArray<FilterBarFilterState>;
	/** Requested page, 1-based. */
	page: number;
	/** Rows per page. */
	pageSize: number;
}

/** One page of recipe graphs plus the counts the footer renders. */
export interface RecipeListPage {
	items: Array<TRecipeGraph>;
	total: number;
	page: number;
	pageSize: number;
}

/**
 * The recipe list's data source. Swap this body for the real API or
 * server-function call; the signature is the seam the route loads through.
 */
export const listRecipes = async ({
	search,
	filters,
	page,
	pageSize,
}: RecipeListParams): Promise<RecipeListPage> => {
	const matched = recipes.filter((recipe) => {
		return matchesSearch(recipe, search) && matchesFilters(recipe, filters);
	});
	const totalPages = Math.max(1, Math.ceil(matched.length / pageSize));
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const offset = (currentPage - 1) * pageSize;

	return {
		items: matched.slice(offset, offset + pageSize),
		total: matched.length,
		page: currentPage,
		pageSize,
	};
};
