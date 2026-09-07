import { type ComponentProps } from "react";
import { cn } from "#lib/utils";

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
			className={cn("ml-auto flex items-center gap-1", className)}
			{...props}
		/>
	);
};
