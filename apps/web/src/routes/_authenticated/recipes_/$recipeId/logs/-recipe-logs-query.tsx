import { createServerFn } from "@tanstack/react-start";
import { Coffee, Scale } from "lucide-react";
import type { FilterBarDefinition, FilterBarFilterState } from "@9bar/toolkit/components/composed";
import {
	METHOD_OPTIONS,
	VERDICT_OPTIONS,
	getBrewSnapshot,
	getRecipe,
	getRecipeLogs,
	type BrewSnapshot,
	type Log,
} from "../../../../../utils/data";
import {
	DEFAULT_FILTER_OPERATOR_ID,
	FILTER_OPERATOR_PAIRS,
	FILTER_OPERATORS,
	decodeFilters,
	encodeFilters,
	filterParamSchema,
	matchesOperator,
} from "../../../../../utils/filter-codec";
import { simulateLatency } from "../../../../../utils/simulate-latency";

export const LOGS_PAGE_SIZE = 10;

const toFilterOptions = (options: ReadonlyArray<{ id: string; name: string }>) => {
	return options.map((option) => ({ id: option.id, label: option.name }));
};

export const LOG_FILTER_DEFINITIONS = [
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
] as const satisfies ReadonlyArray<FilterBarDefinition>;

type LogFilterId = (typeof LOG_FILTER_DEFINITIONS)[number]["id"];

export type LogFilterSearchParams = Partial<Record<LogFilterId, string | undefined>>;

export const LOG_FILTER_PARAM_SCHEMA = {
	method: filterParamSchema,
	verdict: filterParamSchema,
} satisfies Record<LogFilterId, typeof filterParamSchema>;

export const decodeLogFilters = (params: LogFilterSearchParams) => {
	return decodeFilters(LOG_FILTER_DEFINITIONS, params);
};

export const encodeLogFilters = (filters: Array<FilterBarFilterState>) => {
	return encodeFilters(LOG_FILTER_DEFINITIONS, filters);
};

export interface RecipeLogRow {
	log: Log;
	snapshot: BrewSnapshot;
	pinned: boolean;
}

const matchesLogFilters = (row: RecipeLogRow, filters: ReadonlyArray<FilterBarFilterState>) => {
	return filters.every((filter) => {
		if (filter.filterId === "method") {
			return matchesOperator(filter.operatorId, filter.values, row.snapshot.method);
		}
		if (filter.filterId === "verdict") {
			return matchesOperator(filter.operatorId, filter.values, row.log.verdict);
		}
		return true;
	});
};

interface ListRecipeLogsInput {
	recipeId: number;
	filters: Array<FilterBarFilterState>;
	page: number;
	pageSize: number;
}

export const listRecipeLogs = createServerFn({ method: "GET" })
	.validator((data: ListRecipeLogsInput) => data)
	.handler(async ({ data }) => {
		await simulateLatency();

		const pinnedLogId = getRecipe(data.recipeId)?.pinnedLogId ?? null;
		const matched: Array<RecipeLogRow> = [];
		for (const log of getRecipeLogs(data.recipeId)) {
			const snapshot = getBrewSnapshot(log.brewSnapshotId);
			if (!snapshot) {
				continue;
			}
			matched.push({ log, snapshot, pinned: log.id === pinnedLogId });
		}

		const filtered = matched
			.filter((row) => matchesLogFilters(row, data.filters))
			.sort(
				(a, b) => Number(b.pinned) - Number(a.pinned) || b.log.shotAt.localeCompare(a.log.shotAt),
			);

		const totalPages = Math.max(1, Math.ceil(filtered.length / data.pageSize));
		const currentPage = Math.min(Math.max(1, data.page), totalPages);
		const offset = (currentPage - 1) * data.pageSize;

		return {
			items: filtered.slice(offset, offset + data.pageSize),
			total: filtered.length,
			page: currentPage,
			pageSize: data.pageSize,
		};
	});
