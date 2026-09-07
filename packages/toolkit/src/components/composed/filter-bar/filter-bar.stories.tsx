import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "#components/button";
import { FilterBar } from "./filter-bar";
import { FilterBarActions } from "./filter-bar-actions";
import type { FilterBarDefinition, FilterBarFilterState } from "./filter-bar-types";

const meta = {
	component: FilterBar,
	title: "Composed/FilterBar",
	parameters: {
		controls: {
			include: ["definitions", "aria-label"],
		},
	},
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const STATUS_DEFINITION = {
	id: "status",
	label: "Status",
	pluralLabel: "statuses",
	operators: [
		{ id: "is", label: "is" },
		{ id: "is-not", label: "is not" },
	],
	defaultOperatorId: "is",
	options: [
		{ id: "active", label: "Active" },
		{ id: "draft", label: "Draft" },
		{ id: "archived", label: "Archived" },
	],
} as const satisfies FilterBarDefinition;

const PRIORITY_DEFINITION = {
	id: "priority",
	label: "Priority",
	pluralLabel: "priorities",
	operators: [
		{ id: "is", label: "is" },
		{ id: "is-one-of", label: "is one of" },
	],
	defaultOperatorId: "is",
	operatorPairs: [{ singular: "is", plural: "is-one-of" }],
	options: [
		{ id: "low", label: "Low" },
		{ id: "medium", label: "Medium" },
		{ id: "high", label: "High" },
	],
} as const satisfies FilterBarDefinition;

const DEFINITIONS: ReadonlyArray<FilterBarDefinition> = [STATUS_DEFINITION, PRIORITY_DEFINITION];

/** An empty filter bar showing only the add-filter button. */
export const Empty: Story = {
	args: {
		definitions: DEFINITIONS,
		"aria-label": "Example filters",
	},
};

/** An uncontrolled filter bar with one active filter. */
export const WithDefaultFilter: Story = {
	args: {
		...Empty.args,
		defaultFilters: [{ filterId: "status", operatorId: "is", values: ["active"] }],
	},
};

/** A controlled filter bar with a clear-all action, syncing state to the parent. */
export const Controlled: Story = {
	args: {
		definitions: DEFINITIONS,
		"aria-label": "Example filters",
	},
	render: (props) => {
		const [filters, setFilters] = useState<Array<FilterBarFilterState>>([]);
		return (
			<div className="flex flex-col gap-2">
				<FilterBar {...props} filters={filters} onFiltersChange={setFilters}>
					{(state) =>
						state.filters.length > 0 && (
							<FilterBarActions>
								<Button variant="ghost" size="xs" onPress={state.clearAll}>
									Clear all
								</Button>
							</FilterBarActions>
						)
					}
				</FilterBar>
				<pre className="text-xs text-muted-foreground">{JSON.stringify(filters, null, 2)}</pre>
			</div>
		);
	},
};
