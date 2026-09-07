import { createContext, useContext } from "react";
import type { FilterBarState } from "./filter-bar-types";

/** Context carrying the {@link FilterBar} state and actions to descendants. */
export const FilterBarContext = createContext<FilterBarState<any, any> | null>(null);

/**
 * Reads the {@link FilterBar} state and actions from the nearest provider.
 * Must be used within a {@link FilterBar}.
 */
export const useFilterBarContext = <
	TFilterId extends string = string,
	TOperatorId extends string = string,
>(): FilterBarState<TFilterId, TOperatorId> => {
	const ctx = useContext(FilterBarContext);
	if (!ctx) {
		throw new Error("useFilterBarContext must be used within a FilterBar");
	}
	return ctx;
};
