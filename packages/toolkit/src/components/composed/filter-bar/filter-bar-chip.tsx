import { X } from "lucide-react";
import { Group as AriaGroup, type Key, type Selection } from "react-aria-components";
import { Button } from "#components/button";
import { IconButton } from "#components/icon-button";
import { Menu, MenuItem, MenuTrigger } from "#components/menu";
import type {
	FilterBarDefinition,
	FilterBarFilterState,
	FilterBarOption,
} from "./filter-bar-types";
import { resolveOperator } from "./utils";

interface FilterBarChipProps {
	filter: FilterBarFilterState;
	definition: FilterBarDefinition;
	onUpdate: (filterId: string, changes: { operatorId?: string; values?: Array<string> }) => void;
	onRemove: (filterId: string) => void;
}

export const FilterBarChip = ({ filter, definition, onUpdate, onRemove }: FilterBarChipProps) => {
	const currentOp = definition.operators.find((o) => o.id === filter.operatorId);
	const visibleOperators = getVisibleOperators(
		definition.operators,
		filter.values.length,
		definition.operatorPairs,
	);

	const valueLabel = formatValues(filter.values, definition.options, definition.pluralLabel);

	const onOperatorChange = (keys: Selection) => {
		if (keys === "all") {
			return;
		}
		const selected = [...keys][0]?.toString();
		if (selected) {
			onUpdate(filter.filterId, { operatorId: selected });
		}
	};

	const onValueChange = (keys: Selection) => {
		if (keys === "all") {
			return;
		}
		const newValues = [...keys].map((k) => k.toString());
		const newOp = resolveOperator(filter.operatorId, newValues.length, definition.operatorPairs);
		const valueChanges = { values: newValues };
		onUpdate(
			filter.filterId,
			newOp !== filter.operatorId ? { ...valueChanges, operatorId: newOp } : valueChanges,
		);
	};

	return (
		<AriaGroup
			data-slot="filter-bar-filter"
			aria-label={`${definition.label} ${currentOp?.label} ${valueLabel}`}
			className="flex shrink-0 items-center rounded-md bg-white text-xs shadow-sm ring-1 ring-border"
		>
			<span
				data-slot="filter-bar-filter-label"
				className="flex items-center gap-1 px-1.5 py-1 font-medium text-primary"
			>
				{definition.label}
			</span>

			<MenuTrigger>
				<Button
					data-slot="filter-bar-filter-operator"
					variant="ghost"
					size="xs"
					className="font-normal"
				>
					{currentOp?.label}
				</Button>
				<Menu
					selectionMode="single"
					selectedKeys={new Set<Key>([filter.operatorId])}
					onSelectionChange={onOperatorChange}
				>
					{visibleOperators.map((o) => (
						<MenuItem key={o.id} id={o.id}>
							{o.label}
						</MenuItem>
					))}
				</Menu>
			</MenuTrigger>

			<MenuTrigger
				onOpenChange={(isOpen) => {
					if (!isOpen && filter.values.length === 0) {
						onRemove(filter.filterId);
					}
				}}
			>
				<Button data-slot="filter-bar-filter-value" variant="ghost" size="xs">
					{filter.values.length > 0 ? valueLabel : "\u2026"}
				</Button>
				<Menu
					selectionMode="multiple"
					selectedKeys={filter.values}
					onSelectionChange={onValueChange}
				>
					{definition.options.map((opt) => (
						<MenuItem key={opt.id} id={opt.id}>
							{opt.label}
						</MenuItem>
					))}
				</Menu>
			</MenuTrigger>

			<IconButton
				data-slot="filter-bar-filter-remove"
				aria-label={`Remove ${definition.label} filter`}
				variant="ghost"
				size="xs"
				className="mr-1.5"
				onPress={() => onRemove(filter.filterId)}
			>
				<X />
			</IconButton>
		</AriaGroup>
	);
};

/** Hides the inapplicable half of each operator pair for the current selection count. */
const getVisibleOperators = (
	operators: ReadonlyArray<{ id: string; label: string }>,
	valueCount: number,
	operatorPairs?: ReadonlyArray<{ singular: string; plural: string }>,
): Array<{ id: string; label: string }> => {
	if (!operatorPairs) {
		return [...operators];
	}
	return operators.filter((op) => {
		const pair = operatorPairs.find(
			({ singular, plural }) => singular === op.id || plural === op.id,
		);
		if (!pair) {
			return true;
		}
		return valueCount > 1 ? op.id !== pair.singular : op.id !== pair.plural;
	});
};

/** Chip label: the option label for one value, `"N <pluralLabel>"` for several. */
const formatValues = (
	values: ReadonlyArray<string>,
	options: ReadonlyArray<FilterBarOption>,
	pluralLabel: string,
): string => {
	if (values.length === 0) {
		return "";
	}
	if (values.length === 1) {
		const firstValue = values[0] ?? "";
		const opt = options.find((o) => o.id === firstValue);
		return opt?.label ?? firstValue;
	}
	return `${values.length} ${pluralLabel}`;
};
