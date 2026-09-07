import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Group as AriaGroup, type Key, type Selection } from "react-aria-components";
import { Button } from "#components/button";
import { IconButton } from "#components/icon-button";
import { Menu, MenuItem, MenuSeparator, MenuTrigger } from "#components/menu";
import type { FilterBarDefinition, FilterBarFilterState } from "./filter-bar-types";
import {
	formatValuesDefault,
	getVisibleOperators,
	partitionFilterOptions,
	resolveOperator,
} from "./filter-bar-utils";
import { filterBarVariants } from "./filter-bar-variants";

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
			className={filterBarVariants.filter}
		>
			<span data-slot="filter-bar-filter-label" className={filterBarVariants.filterLabel}>
				{definition.icon}
				{definition.label}
			</span>

			<MenuTrigger>
				<Button
					data-slot="filter-bar-filter-operator"
					variant="ghost"
					size="xs"
					className={filterBarVariants.filterOperator}
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
					className={filterBarVariants.filterValue}
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
