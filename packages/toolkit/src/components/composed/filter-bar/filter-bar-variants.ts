/**
 * Slot classes for the {@link FilterBar} component. Override per slot via
 * `className` on the subcomponents, or reuse these when building custom chrome.
 */
export const filterBarVariants = {
	root: "flex flex-wrap items-center gap-1.5",
	filter: "flex shrink-0 items-center rounded-md bg-white text-xs shadow-sm ring-1 ring-border",
	filterLabel: "flex items-center gap-1 px-1.5 py-1 font-medium text-primary [&_svg]:size-3.5",
	filterOperator: "rounded-none font-normal",
	filterValue: "rounded-none",
	filterRemove: "",
	actions: "ml-auto flex items-center gap-1",
};
