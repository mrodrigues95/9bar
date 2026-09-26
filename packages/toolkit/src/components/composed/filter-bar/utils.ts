import type { FilterBarDefinition, FilterBarFilterState } from "./filter-bar-types";

/** Swaps a paired operator when the selection count crosses the singular/plural boundary. */
export const resolveOperator = (
	currentOp: string,
	valueCount: number,
	operatorPairs?: ReadonlyArray<{ singular: string; plural: string }>,
): string => {
	if (!operatorPairs) {
		return currentOp;
	}
	for (const { singular, plural } of operatorPairs) {
		if (currentOp === singular && valueCount > 1) {
			return plural;
		}
		if (currentOp === plural && valueCount <= 1) {
			return singular;
		}
	}
	return currentOp;
};

/** Options for {@link applyFilterSelection}. */
export interface ApplyFilterSelectionOptions {
	/** The current filter state. */
	filters: Array<FilterBarFilterState>;
	/** The definition being added or updated. */
	definition: FilterBarDefinition;
	/** Ids of the newly selected options. */
	selectedIds: Iterable<string | number>;
}

/**
 * Adds or updates one definition's filter in `filters`, resolving the paired
 * operator for the new selection count (e.g. `is` → `is-any-of`). Returns the
 * next filter state; at most one filter exists per definition.
 */
export const applyFilterSelection = ({
	filters,
	definition,
	selectedIds,
}: ApplyFilterSelectionOptions): Array<FilterBarFilterState> => {
	const values = [...selectedIds].map((id) => id.toString());
	const existing = filters.find((filter) => filter.filterId === definition.id);
	if (!existing) {
		return [
			...filters,
			{
				filterId: definition.id,
				operatorId: resolveOperator(
					definition.defaultOperatorId,
					values.length,
					definition.operatorPairs,
				),
				values,
			},
		];
	}

	return filters.map((filter) => {
		if (filter.filterId !== definition.id) {
			return filter;
		}
		return {
			...filter,
			operatorId: resolveOperator(filter.operatorId, values.length, definition.operatorPairs),
			values,
		};
	});
};
