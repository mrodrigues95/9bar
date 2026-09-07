import type { ReactNode } from "react";

/** A single selectable value within a {@link FilterBarDefinition}. */
export interface FilterBarOption {
	/** Stable identifier stored in the filter state. */
	id: string;
	/** Human-readable label shown in the value menu. */
	label: string;
}

/**
 * Describes one filterable dimension (e.g. status, method): its operators,
 * its selectable options, and how selected values are displayed.
 */
export interface FilterBarDefinition<
	TFilterId extends string = string,
	TOperatorId extends string = string,
> {
	/** Stable identifier referenced by {@link FilterBarFilterState.filterId}. */
	id: TFilterId;
	/** Short label shown on the filter chip. */
	label: string;
	/** Plural noun used when several values are selected (e.g. `"3 origins"`). */
	pluralLabel: string;
	/** Optional icon rendered before the chip label. */
	icon?: ReactNode;
	/** Operators the user can pick from (e.g. is / is not). */
	operators: ReadonlyArray<{ id: TOperatorId; label: string }>;
	/** Operator assigned when the filter is added. */
	defaultOperatorId: TOperatorId;
	/** Values the user can select. */
	options: ReadonlyArray<FilterBarOption>;
	/**
	 * Singular/plural operator pairs that swap automatically with the selection
	 * count (e.g. `is` ↔ `is one of`). Operators not in a pair are always shown.
	 */
	operatorPairs?: ReadonlyArray<{
		singular: TOperatorId;
		plural: TOperatorId;
	}>;
	/** Formats the selected values for the chip. Defaults to the option label or `"N <pluralLabel>"`. */
	formatValue?: (values: ReadonlyArray<string>, options: ReadonlyArray<FilterBarOption>) => string;
	/** Whether to partition value menu options (selected first, then unselected). Defaults to `true`. */
	partitionOptions?: boolean;
}

/** One active filter: a definition plus the user's operator and value selection. */
export interface FilterBarFilterState<
	TFilterId extends string = string,
	TOperatorId extends string = string,
> {
	/** Unique instance id (distinct from the definition id). */
	id: string;
	/** Id of the {@link FilterBarDefinition} this filter instantiates. */
	filterId: TFilterId;
	/** Id of the currently selected operator. */
	operatorId: TOperatorId;
	/** Ids of the currently selected options. */
	values: Array<string>;
}

/** State and actions for the {@link FilterBar} component, exposed via context and the children render prop. */
export interface FilterBarState<
	TFilterId extends string = string,
	TOperatorId extends string = string,
> {
	/** The currently active filters. */
	filters: Array<FilterBarFilterState<TFilterId, TOperatorId>>;
	/** Removes every active filter. */
	clearAll: () => void;
	/** Removes the filter with the given instance id. */
	removeFilter: (id: string) => void;
	/** Adds a filter instance, returning its id. */
	addFilter: (filterId: TFilterId, operatorId: TOperatorId, values?: Array<string>) => string;
	/** Replaces the operator of the filter with the given instance id. */
	updateOperator: (id: string, operatorId: TOperatorId) => void;
	/** Replaces the values of the filter with the given instance id. */
	updateValues: (id: string, values: Array<string>) => void;
}
