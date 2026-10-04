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

interface FilterBarAddTriggerProps {
	definitions: ReadonlyArray<FilterBarDefinition>;
	filters: Array<FilterBarFilterState>;
	onFiltersChange: (filters: Array<FilterBarFilterState>) => void;
	"aria-label"?: string;
}

export const FilterBarAddTrigger = ({
	definitions,
	filters,
	onFiltersChange,
	"aria-label": ariaLabel = "Add filter",
}: FilterBarAddTriggerProps) => {
	return (
		<MenuTrigger>
			<IconButton aria-label={ariaLabel} variant="ghost" size="sm">
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
