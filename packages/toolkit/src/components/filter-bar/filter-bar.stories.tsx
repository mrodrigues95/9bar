import {
	CircleStackIcon,
	HashtagIcon,
	TagIcon,
	UserIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import type { Key, Selection } from "react-aria-components";
import { Button } from "../button/button";
import { Menu, MenuItem, MenuSeparator, SubmenuTrigger } from "../menu/menu";
import {
	FilterBar,
	FilterBarActions,
	FilterBarAdd,
	FilterBarFilter,
	FilterBarFilterLabel,
	FilterBarFilterOperator,
	FilterBarFilterRemove,
	type FilterBarFilterState,
	FilterBarFilterValue,
	useFilterBarState,
} from "./filter-bar";

const meta = {
	component: FilterBar,
	title: "FilterBar",
	parameters: {
		controls: { disable: true },
		layout: "padded",
	},
} satisfies Meta<typeof FilterBar>;

export default meta;

type Story = StoryObj<typeof FilterBar>;

interface Operator {
	id: "is" | "is-not" | "is-any-of" | "include" | "do-not-include";
	label: string;
}

interface FilterDefinitionOption {
	id: string;
	label: string;
}

interface FilterDefinition {
	id: "status" | "assignee" | "labels" | "priority";
	label: string;
	pluralLabel: string;
	icon: ReactNode;
	operators: Array<Operator>;
	defaultOperatorId: OperatorId;
	options: Array<FilterDefinitionOption>;
}

type OperatorId = Operator["id"];
type FilterId = FilterDefinition["id"];

const definitions = [
	{
		id: "status",
		label: "Status",
		pluralLabel: "statuses",
		icon: <CircleStackIcon />,
		operators: [
			{ id: "is", label: "is" },
			{ id: "is-not", label: "is not" },
			{ id: "is-any-of", label: "is any of" },
		],
		defaultOperatorId: "is",
		options: [
			{ id: "todo", label: "Todo" },
			{ id: "in-progress", label: "In Progress" },
			{ id: "done", label: "Done" },
			{ id: "cancelled", label: "Cancelled" },
		],
	},
	{
		id: "assignee",
		label: "Assignee",
		pluralLabel: "assignees",
		icon: <UserIcon />,
		operators: [
			{ id: "is", label: "is" },
			{ id: "is-not", label: "is not" },
			{ id: "is-any-of", label: "is any of" },
		],
		defaultOperatorId: "is",
		options: [
			{ id: "alice", label: "Alice" },
			{ id: "bob", label: "Bob" },
			{ id: "charlie", label: "Charlie" },
		],
	},
	{
		id: "labels",
		label: "Labels",
		pluralLabel: "labels",
		icon: <TagIcon />,
		operators: [
			{ id: "include", label: "include" },
			{ id: "do-not-include", label: "do not include" },
		],
		defaultOperatorId: "include",
		options: [
			{ id: "bug", label: "Bug" },
			{ id: "feature", label: "Feature" },
			{ id: "improvement", label: "Improvement" },
			{ id: "docs", label: "Documentation" },
		],
	},
	{
		id: "priority",
		label: "Priority",
		pluralLabel: "priorities",
		icon: <HashtagIcon />,
		operators: [
			{ id: "is", label: "is" },
			{ id: "is-not", label: "is not" },
			{ id: "is-any-of", label: "is any of" },
		],
		defaultOperatorId: "is",
		options: [
			{ id: "urgent", label: "Urgent" },
			{ id: "high", label: "High" },
			{ id: "medium", label: "Medium" },
			{ id: "low", label: "Low" },
		],
	},
] as const satisfies Array<FilterDefinition>;

const definitionById = new Map(definitions.map((d) => [d.id, d]));

const getDefinition = (filterId: FilterId) => {
	const def = definitionById.get(filterId);
	if (!def) {
		throw new Error(`Unknown filter: ${filterId}`);
	}
	return def;
};

const formatOptions = (def: FilterDefinition, values: string[]) => {
	if (values.length === 0) {
		return "";
	}
	if (values.length === 1) {
		const firstValue = values[0] ?? "";
		const opt = def.options.find((v) => v.id === firstValue);
		return opt?.label ?? firstValue;
	}
	return `${values.length} ${def.pluralLabel}`;
};

const singularPluralPairs = [["is", "is-any-of"]] as const;

const getVisibleOperators = (
	operators: Array<Operator>,
	valueCount: number,
) => {
	return operators.filter((op) => {
		const pair = singularPluralPairs.find(
			([s, p]) => s === op.id || p === op.id,
		);
		if (!pair) {
			return true;
		}
		const [singular, plural] = pair;
		return valueCount > 1 ? op.id !== singular : op.id !== plural;
	});
};

const resolveOperator = (currentOp: OperatorId, valueCount: number) => {
	for (const [singular, plural] of singularPluralPairs) {
		if (currentOp === singular && valueCount > 1) {
			return plural;
		}
		if (currentOp === plural && valueCount <= 1) {
			return singular;
		}
	}
	return currentOp;
};

const partitionFilterOptions = (def: FilterDefinition, values: string[]) => {
	const selectedSet = new Set(values);
	const selectedOptions: Array<FilterDefinitionOption> = [];
	const unselectedOptions: Array<FilterDefinitionOption> = [];
	for (const val of def.options) {
		if (selectedSet.has(val.id)) {
			selectedOptions.push(val);
		} else {
			unselectedOptions.push(val);
		}
	}
	return [selectedOptions, unselectedOptions] as const;
};

interface FilterBarDemoProps {
	defaultFilters?: Array<FilterBarFilterState<FilterId, OperatorId>>;
}

const FilterBarDemo = ({ defaultFilters }: FilterBarDemoProps) => {
	const filterBar = useFilterBarState<FilterId, OperatorId>({
		...(defaultFilters ? { defaultFilters } : {}),
	});

	const filtersByFilterId = new Map(
		filterBar.filters.map((f) => [f.filterId, f]),
	);

	const onAddNewFilter = (filterId: FilterId, keys: Selection) => {
		if (keys === "all") {
			return;
		}
		const values = [...keys].map((k) => k.toString());
		const existing = filtersByFilterId.get(filterId);
		if (existing) {
			const newOp = resolveOperator(existing.operatorId, values.length);
			if (newOp !== existing.operatorId) {
				filterBar.onUpdateOperator(existing.id, newOp);
			}
			filterBar.onUpdateValues(existing.id, values);
		} else {
			const def = getDefinition(filterId);
			const op = resolveOperator(def.defaultOperatorId, values.length);
			filterBar.onAddFilter(filterId, op, values);
		}
	};

	// TODO: Document all components, props and stories.
	return (
		<FilterBar aria-label="Issue filters">
			{filterBar.filters.map((filter) => {
				const def = getDefinition(filter.filterId);
				const op = def.operators.find((o) => o.id === filter.operatorId);
				const visibleOperators = getVisibleOperators(
					def.operators,
					filter.values.length,
				);
				const [selectedOptions, unselectedOptions] = partitionFilterOptions(
					def,
					filter.values,
				);
				return (
					<FilterBarFilter
						key={filter.id}
						aria-label={`${def.label} ${op?.label} ${formatOptions(def, filter.values)}`}
					>
						<FilterBarFilterLabel>
							{def.icon}
							{def.label}
						</FilterBarFilterLabel>
						<FilterBarFilterOperator label={op?.label}>
							<Menu
								selectionMode="single"
								selectedKeys={new Set<Key>([filter.operatorId])}
								onSelectionChange={(keys) => {
									if (keys === "all") {
										return;
									}
									const selected = [...keys][0] as OperatorId | undefined;
									if (selected) {
										filterBar.onUpdateOperator(filter.id, selected);
									}
								}}
							>
								{visibleOperators.map((o) => (
									<MenuItem key={o.id} id={o.id}>
										{o.label}
									</MenuItem>
								))}
							</Menu>
						</FilterBarFilterOperator>
						<FilterBarFilterValue
							label={formatOptions(def, filter.values)}
							selectedKeys={filter.values}
							onRemove={() => filterBar.onRemoveFilter(filter.id)}
						>
							<Menu
								selectionMode="multiple"
								selectedKeys={filter.values}
								onSelectionChange={(keys) => {
									if (keys === "all") {
										return;
									}
									const newValues = [...keys].map((k) => k.toString());
									const newOp = resolveOperator(
										filter.operatorId,
										newValues.length,
									);
									if (newOp !== filter.operatorId) {
										filterBar.onUpdateOperator(filter.id, newOp);
									}
									filterBar.onUpdateValues(filter.id, newValues);
								}}
							>
								{selectedOptions.map((val) => (
									<MenuItem key={val.id} id={val.id}>
										{val.label}
									</MenuItem>
								))}
								{selectedOptions.length > 0 && unselectedOptions.length > 0 && (
									<MenuSeparator />
								)}
								{unselectedOptions.map((val) => (
									<MenuItem key={val.id} id={val.id}>
										{val.label}
									</MenuItem>
								))}
							</Menu>
						</FilterBarFilterValue>
						<FilterBarFilterRemove
							aria-label={`Remove ${def.label} filter`}
							onPress={() => filterBar.onRemoveFilter(filter.id)}
						>
							<XMarkIcon />
						</FilterBarFilterRemove>
					</FilterBarFilter>
				);
			})}

			<FilterBarAdd>
				<Menu>
					{definitions.map((def) => (
						<SubmenuTrigger key={def.id}>
							<MenuItem textValue={def.label}>
								<span className="[&_svg]:size-4" aria-hidden="true">
									{def.icon}
								</span>
								{def.label}
							</MenuItem>
							<Menu
								selectionMode="multiple"
								selectedKeys={filtersByFilterId.get(def.id)?.values ?? []}
								onSelectionChange={(keys) => onAddNewFilter(def.id, keys)}
							>
								{def.options.map((val) => (
									<MenuItem key={val.id} id={val.id}>
										{val.label}
									</MenuItem>
								))}
							</Menu>
						</SubmenuTrigger>
					))}
				</Menu>
			</FilterBarAdd>

			{filterBar.filters.length > 0 && (
				<FilterBarActions>
					<Button variant="ghost" size="xs" onPress={filterBar.onClearAll}>
						Clear
					</Button>
					<Button variant="outline" size="xs">
						Save
					</Button>
				</FilterBarActions>
			)}
		</FilterBar>
	);
};

export const Default: Story = {
	render: () => <FilterBarDemo />,
};

export const WithActiveFilters: Story = {
	render: () => (
		<FilterBarDemo
			defaultFilters={[
				{
					id: "1",
					filterId: "status",
					operatorId: "is-any-of",
					values: ["todo", "in-progress"],
				},
				{
					id: "2",
					filterId: "labels",
					operatorId: "include",
					values: ["bug"],
				},
				{
					id: "3",
					filterId: "assignee",
					operatorId: "is",
					values: ["alice"],
				},
			]}
		/>
	),
};
