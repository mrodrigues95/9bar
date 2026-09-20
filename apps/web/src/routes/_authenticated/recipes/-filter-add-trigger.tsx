import { ListFilter } from "lucide-react";
import {
	IconButton,
	Menu,
	MenuItem,
	MenuSub,
	MenuSubContent,
	MenuSubTrigger,
	MenuTrigger,
} from "@9bar/toolkit/components";
import {
	applyFilterSelection,
	type FilterBarDefinition,
	type FilterBarFilterState,
} from "@9bar/toolkit/components/composed";

/** Props for the {@link FilterAddTrigger} component. */
export interface FilterAddTriggerProps {
	/** The filterable dimensions users can add filters from. */
	definitions: ReadonlyArray<FilterBarDefinition>;
	/** The currently active filters. */
	filters: Array<FilterBarFilterState>;
	/** Called with the next filter state when a selection changes. */
	onFiltersChange: (filters: Array<FilterBarFilterState>) => void;
	/** Accessible label for the trigger. Defaults to `"Add filter"`. */
	"aria-label"?: string;
}

/**
 * A second add-filter trigger, placed beside the search field rather than in
 * the filter bar. Selection runs through the toolkit's
 * {@link applyFilterSelection}, so it lands in the same state the filter bar's
 * own trigger produces.
 */
export const FilterAddTrigger = ({
	definitions,
	filters,
	onFiltersChange,
	"aria-label": ariaLabel = "Add filter",
}: FilterAddTriggerProps) => {
	return (
		<MenuTrigger>
			<IconButton data-slot="filter-bar-add" aria-label={ariaLabel} variant="ghost" size="sm">
				<ListFilter className="size-3.5" />
			</IconButton>
			<Menu width="content">
				{definitions.map((definition) => (
					<MenuSub key={definition.id}>
						<MenuSubTrigger textValue={definition.label}>
							{definition.icon}
							{definition.label}
						</MenuSubTrigger>
						<MenuSubContent
							selectionMode="multiple"
							selectedKeys={
								filters.find((filter) => filter.filterId === definition.id)?.values ?? []
							}
							onSelectionChange={(keys) => {
								if (keys !== "all") {
									onFiltersChange(applyFilterSelection({ filters, definition, selectedIds: keys }));
								}
							}}
						>
							{definition.options.map((option) => (
								<MenuItem key={option.id} id={option.id}>
									{option.label}
								</MenuItem>
							))}
						</MenuSubContent>
					</MenuSub>
				))}
			</Menu>
		</MenuTrigger>
	);
};
