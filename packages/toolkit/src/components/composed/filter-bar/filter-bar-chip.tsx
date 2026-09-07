import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Group as AriaGroup, type Key, type Selection } from "react-aria-components";
import { Button } from "#components/button";
import { IconButton } from "#components/icon-button";
import { Menu, MenuItem, MenuSeparator, MenuTrigger } from "#components/menu";
import type {
	FilterBarDefinition,
	FilterBarFilterState,
	FilterBarOption,
} from "./filter-bar-types";
import { resolveOperator } from "./utils";

interface FilterBarChipProps {
	filter: FilterBarFilterState;
	definition: FilterBarDefinition;
	onUpdate: (id: string, changes: { operatorId?: string; values?: Array<string> }) => void;
	onRemove: (id: string) => void;
}

export const FilterBarChip = ({ filter, definition, onUpdate, onRemove }: FilterBarChipProps) => {
	const currentOp = definition.operators.find((o) => o.id === filter.operatorId);
	const visibleOperators = getVisibleOperators(
		definition.operators,
		filter.values.length,
		definition.operatorPairs,
	);

	const valueLabel = definition.formatValue
		? definition.formatValue(filter.values, definition.options)
		: formatValuesDefault(filter.values, definition.options, definition.pluralLabel);

	const shouldPartition = definition.partitionOptions !== false;
	const [selectedOptions, unselectedOptions] = shouldPartition
		? partitionFilterOptions(definition.options, filter.values)
		: [[], []];

	// Auto-remove when value menu closes with no selections
	const selectedKeysRef = useRef(filter.values);
	useEffect(() => {
		selectedKeysRef.current = filter.values;
	}, [filter.values]);

	const handleValueMenuOpenChange = useCallback(
		(isOpen: boolean) => {
			if (!isOpen && selectedKeysRef.current.length === 0) {
				onRemove(filter.id);
			}
		},
		[onRemove, filter.id],
	);

	const handleOperatorChange = useCallback(
		(keys: Selection) => {
			if (keys === "all") return;
			const selected = [...keys][0]?.toString();
			if (selected) {
				onUpdate(filter.id, { operatorId: selected });
			}
		},
		[onUpdate, filter.id],
	);

	const handleValueChange = useCallback(
		(keys: Selection) => {
			if (keys === "all") return;
			const newValues = [...keys].map((k) => k.toString());
			const newOp = resolveOperator(filter.operatorId, newValues.length, definition.operatorPairs);
			const valueChanges = { values: newValues };
			onUpdate(
				filter.id,
				newOp !== filter.operatorId ? { ...valueChanges, operatorId: newOp } : valueChanges,
			);
		},
		[onUpdate, filter.id, filter.operatorId, definition.operatorPairs],
	);

	return (
		<AriaGroup
			data-slot="filter-bar-filter"
			aria-label={`${definition.label} ${currentOp?.label} ${valueLabel}`}
			className="flex shrink-0 items-center rounded-md bg-white text-xs shadow-sm ring-1 ring-border"
		>
			<span
				data-slot="filter-bar-filter-label"
				className="flex items-center gap-1 px-1.5 py-1 font-medium text-primary [&_svg]:size-3.5"
			>
				{definition.icon}
				{definition.label}
			</span>

			<MenuTrigger>
				<Button
					data-slot="filter-bar-filter-operator"
					variant="ghost"
					size="xs"
					className="rounded-none font-normal"
				>
					{currentOp?.label}
				</Button>
				<Menu
					selectionMode="single"
					selectedKeys={new Set<Key>([filter.operatorId])}
					onSelectionChange={handleOperatorChange}
				>
					{visibleOperators.map((o) => (
						<MenuItem key={o.id} id={o.id}>
							{o.label}
						</MenuItem>
					))}
				</Menu>
			</MenuTrigger>

			<MenuTrigger onOpenChange={handleValueMenuOpenChange}>
				<Button
					data-slot="filter-bar-filter-value"
					variant="ghost"
					size="xs"
					className="rounded-none"
				>
					{filter.values.length > 0 ? valueLabel : "\u2026"}
				</Button>
				<Menu
					selectionMode="multiple"
					selectedKeys={filter.values}
					onSelectionChange={handleValueChange}
				>
					{shouldPartition ? (
						<>
							{selectedOptions.map((opt) => (
								<MenuItem key={opt.id} id={opt.id}>
									{opt.label}
								</MenuItem>
							))}
							{selectedOptions.length > 0 && unselectedOptions.length > 0 && <MenuSeparator />}
							{unselectedOptions.map((opt) => (
								<MenuItem key={opt.id} id={opt.id}>
									{opt.label}
								</MenuItem>
							))}
						</>
					) : (
						definition.options.map((opt) => (
							<MenuItem key={opt.id} id={opt.id}>
								{opt.label}
							</MenuItem>
						))
					)}
				</Menu>
			</MenuTrigger>

			<IconButton
				data-slot="filter-bar-filter-remove"
				aria-label={`Remove ${definition.label} filter`}
				variant="ghost"
				size="xs"
				className="mr-1.5"
				onPress={() => onRemove(filter.id)}
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
	if (!operatorPairs) return [...operators];
	return operators.filter((op) => {
		const pair = operatorPairs.find(
			({ singular, plural }) => singular === op.id || plural === op.id,
		);
		if (!pair) return true;
		return valueCount > 1 ? op.id !== pair.singular : op.id !== pair.plural;
	});
};

/** Default chip label: the option label for one value, `"N <pluralLabel>"` for several. */
const formatValuesDefault = (
	values: ReadonlyArray<string>,
	options: ReadonlyArray<FilterBarOption>,
	pluralLabel: string,
): string => {
	if (values.length === 0) return "";
	if (values.length === 1) {
		const firstValue = values[0] ?? "";
		const opt = options.find((o) => o.id === firstValue);
		return opt?.label ?? firstValue;
	}
	return `${values.length} ${pluralLabel}`;
};

/** Splits options into selected-first and unselected groups for the value menu. */
const partitionFilterOptions = (
	options: ReadonlyArray<FilterBarOption>,
	values: ReadonlyArray<string>,
): [Array<FilterBarOption>, Array<FilterBarOption>] => {
	const selectedSet = new Set(values);
	const selected: Array<FilterBarOption> = [];
	const unselected: Array<FilterBarOption> = [];
	for (const opt of options) {
		if (selectedSet.has(opt.id)) {
			selected.push(opt);
		} else {
			unselected.push(opt);
		}
	}
	return [selected, unselected];
};
