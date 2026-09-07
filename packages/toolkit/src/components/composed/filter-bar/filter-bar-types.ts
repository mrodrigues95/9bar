/** A single selectable value within a {@link FilterBarDefinition}. */
export interface FilterBarOption {
	/** Stable identifier stored in the filter state. */
	id: string;
	/** Human-readable label shown in the value menu. */
	label: string;
}

/**
 * Describes one filterable dimension (e.g. status, method): its operators
 * and its selectable options.
 */
export interface FilterBarDefinition {
	/** Stable identifier referenced by {@link FilterBarFilterState.filterId}. */
	id: string;
	/** Short label shown on the filter chip. */
	label: string;
	/** Plural noun used when several values are selected (e.g. `"3 origins"`). */
	pluralLabel: string;
	/** Operators the user can pick from (e.g. is / is not). */
	operators: ReadonlyArray<{ id: string; label: string }>;
	/** Operator assigned when the filter is added. */
	defaultOperatorId: string;
	/** Values the user can select. */
	options: ReadonlyArray<FilterBarOption>;
	/**
	 * Singular/plural operator pairs that swap automatically with the selection
	 * count (e.g. `is` ↔ `is one of`). Operators not in a pair are always shown.
	 */
	operatorPairs?: ReadonlyArray<{
		singular: string;
		plural: string;
	}>;
}

/**
 * One active filter: a definition plus the user's operator and value
 * selection. At most one filter exists per definition, keyed by `filterId`.
 */
export interface FilterBarFilterState {
	/** Id of the {@link FilterBarDefinition} this filter instantiates. */
	filterId: string;
	/** Id of the currently selected operator. */
	operatorId: string;
	/** Ids of the currently selected options. */
	values: Array<string>;
}

/**
 * State and actions for the {@link FilterBar} component, exposed via the
 * children render prop.
 */
export interface FilterBarState {
	/** The currently active filters. */
	filters: Array<FilterBarFilterState>;
	/** Removes every active filter. */
	clearAll: () => void;
}
