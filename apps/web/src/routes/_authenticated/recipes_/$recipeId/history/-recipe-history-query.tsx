import { createServerFn } from "@tanstack/react-start";
import { Tag } from "lucide-react";
import type { FilterBarDefinition, FilterBarFilterState } from "@9bar/toolkit/components/composed";
import {
	HISTORY_FIELD_LABELS,
	HISTORY_FIELDS,
	getRecipeHistoryEvents,
	type HistoryEvent,
} from "../../-recipe-history/history-events";
import {
	DEFAULT_FILTER_OPERATOR_ID,
	FILTER_OPERATOR_PAIRS,
	FILTER_OPERATORS,
	decodeFilters,
	encodeFilters,
	filterParamSchema,
} from "../../../../../utils/filter-codec";
import { paginate } from "../../../../../utils/paginate";
import { simulateLatency } from "../../../../../utils/simulate-latency";

export const HISTORY_PAGE_SIZE = 4;

export const HISTORY_FILTER_DEFINITIONS = [
	{
		id: "field",
		label: "Field",
		icon: <Tag />,
		pluralLabel: "fields",
		operators: FILTER_OPERATORS,
		defaultOperatorId: DEFAULT_FILTER_OPERATOR_ID,
		operatorPairs: FILTER_OPERATOR_PAIRS,
		options: HISTORY_FIELDS.map((field) => ({
			id: field,
			label: HISTORY_FIELD_LABELS[field],
		})),
	},
] as const satisfies ReadonlyArray<FilterBarDefinition>;

type HistoryFilterId = (typeof HISTORY_FILTER_DEFINITIONS)[number]["id"];

export type HistoryFilterSearchParams = Partial<Record<HistoryFilterId, string | undefined>>;

export const HISTORY_FILTER_PARAM_SCHEMA = {
	field: filterParamSchema,
} satisfies Record<HistoryFilterId, typeof filterParamSchema>;

export const decodeHistoryFilters = (params: HistoryFilterSearchParams) => {
	return decodeFilters(HISTORY_FILTER_DEFINITIONS, params);
};

export const encodeHistoryFilters = (filters: Array<FilterBarFilterState>) => {
	return encodeFilters(HISTORY_FILTER_DEFINITIONS, filters);
};

const matchesHistoryFilters = (
	event: HistoryEvent,
	filters: ReadonlyArray<FilterBarFilterState>,
) => {
	return filters.every((filter) => {
		if (filter.filterId !== "field") {
			return true;
		}
		const isSelected = event.changes.some((change) => filter.values.includes(change.field));
		if (filter.operatorId === "is-not" || filter.operatorId === "is-none-of") {
			return !isSelected;
		}
		return isSelected;
	});
};

interface ListRecipeHistoryInput {
	recipeId: number;
	filters: Array<FilterBarFilterState>;
	page: number;
	pageSize: number;
}

export const listRecipeHistory = createServerFn({ method: "GET" })
	.validator((data: ListRecipeHistoryInput) => data)
	.handler(async ({ data }) => {
		await simulateLatency();

		const filtered = getRecipeHistoryEvents(data.recipeId).filter((event) =>
			matchesHistoryFilters(event, data.filters),
		);

		return paginate(filtered, data.page, data.pageSize);
	});
