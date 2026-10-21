import type { ReactNode } from "react";
import { Button } from "@9bar/toolkit/components";
import {
	FilterBar,
	FilterBarActions,
	type FilterBarDefinition,
	type FilterBarFilterState,
} from "@9bar/toolkit/components/composed";
import { FilterBarAddTrigger } from "./filter-bar-add-trigger";

interface FilterBarPanelProps {
	definitions: ReadonlyArray<FilterBarDefinition>;
	filters: Array<FilterBarFilterState>;
	onFiltersChange: (filters: Array<FilterBarFilterState>) => void;
	label: string;
	leading?: ReactNode;
}

export const FilterBarPanel = ({
	definitions,
	filters,
	onFiltersChange,
	label,
	leading,
}: FilterBarPanelProps) => {
	return (
		<>
			<div className="flex flex-wrap items-center justify-end gap-2">
				{leading}
				<FilterBarAddTrigger
					definitions={definitions}
					filters={filters}
					onFiltersChange={onFiltersChange}
					aria-label={`Add ${label} filter`}
				/>
			</div>
			{filters.length > 0 && (
				<div className="rounded-md bg-muted/50 px-2.5 py-2">
					<FilterBar
						definitions={definitions}
						filters={filters}
						onFiltersChange={onFiltersChange}
						aria-label={`Active ${label} filters`}
					>
						{({ clearAll }) => (
							<FilterBarActions>
								<Button variant="ghost" size="xs" onPress={clearAll}>
									Clear
								</Button>
							</FilterBarActions>
						)}
					</FilterBar>
				</div>
			)}
		</>
	);
};
