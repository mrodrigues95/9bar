import { type ComponentProps } from "react";
import { cn } from "#lib/utils";
import { filterBarVariants } from "./filter-bar-variants";

/** Props for the {@link FilterBarActions} component. */
export interface FilterBarActionsProps extends ComponentProps<"div"> {}

/**
 * Right-aligned container for {@link FilterBar} actions (e.g. a "Clear all"
 * button), rendered inside the toolbar via the children render prop.
 */
export const FilterBarActions = ({ className, ...props }: FilterBarActionsProps) => {
	return (
		<div
			data-slot="filter-bar-actions"
			className={cn(filterBarVariants.actions, className) ?? ""}
			{...props}
		/>
	);
};
