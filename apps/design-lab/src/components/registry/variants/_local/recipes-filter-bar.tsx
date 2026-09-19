import { Plus, X } from "lucide-react";
import { useState, type ComponentType, type ReactNode } from "react";
import {
	Button,
	IconButton,
	Menu,
	MenuItem,
	MenuSub,
	MenuSubContent,
	MenuSubTrigger,
	MenuTrigger,
} from "@9bar/toolkit/components";
import type { FilterBarFilterState } from "@9bar/toolkit/components/composed";

/** Filterable dimension with an optional leading icon (chip label + add menu). */
export interface LocalFilterBarDefinition {
	/** Stable identifier referenced by the filter state. */
	id: string;
	/** Short label shown on the filter chip and in the add menu. */
	label: string;
	/** Plural noun used when several values are selected (e.g. `"3 origins"`). */
	pluralLabel: string;
	/** Operators the user can pick from (e.g. is / is not). */
	operators: ReadonlyArray<{ id: string; label: string }>;
	/** Operator assigned when the filter is added. */
	defaultOperatorId: string;
	/** Values the user can select. */
	options: ReadonlyArray<{ id: string; label: string }>;
	/** Leading icon for the chip label and the add-menu entry. */
	icon?: ComponentType<{ className?: string }>;
}

export interface LocalFilterBarState {
	/** The currently active filters. */
	filters: Array<FilterBarFilterState>;
	/** Removes every active filter. */
	clearAll: () => void;
}

export interface LocalFilterBarProps {
	/** The filterable dimensions users can add filters from. */
	definitions: ReadonlyArray<LocalFilterBarDefinition>;
	/** Controlled filter state. Omit for uncontrolled usage with `defaultFilters`. */
	filters?: Array<FilterBarFilterState>;
	/** Called whenever the filter state changes (controlled and uncontrolled). */
	onFiltersChange?: (filters: Array<FilterBarFilterState>) => void;
	/** Initial filters for uncontrolled usage. */
	defaultFilters?: Array<FilterBarFilterState>;
	/** Render prop for toolbar actions (e.g. a "Clear" button). */
	children?: (state: LocalFilterBarState) => ReactNode;
	/** Accessible label for the toolbar. */
	"aria-label"?: string;
	/** Extra classes for the toolbar root. */
	className?: string;
	/** Override for the add-filter trigger icon. Defaults to Plus. */
	addIcon?: ComponentType<{ className?: string }>;
}

/**
 * Local scaffold: toolkit FilterBar behavior with a swappable trigger icon
 * and per-definition icons. Throwaway — dies with the variant.
 */
export const LocalFilterBar = ({
	definitions,
	filters: controlledFilters,
	onFiltersChange,
	defaultFilters,
	children,
	"aria-label": ariaLabel,
	className,
	addIcon,
}: LocalFilterBarProps) => {
	const [uncontrolledFilters, setUncontrolledFilters] = useState<Array<FilterBarFilterState>>(
		() => defaultFilters ?? [],
	);
	const isControlled = controlledFilters !== undefined;
	const filters: Array<FilterBarFilterState> = isControlled
		? controlledFilters
		: uncontrolledFilters;

	const definitionById = new Map(definitions.map((d) => [d.id, d]));

	const update = (
		getNext: (current: Array<FilterBarFilterState>) => Array<FilterBarFilterState>,
	) => {
		const next = getNext(filters);
		if (!isControlled) {
			setUncontrolledFilters(next);
		}
		onFiltersChange?.(next);
	};

	const state: LocalFilterBarState = { filters, clearAll: () => update(() => []) };
	const filtersByFilterId = new Map(filters.map((f) => [f.filterId, f]));
	const AddIcon = addIcon ?? Plus;

	const onAddFilter = (defId: string, keys: Set<string>) => {
		const values = [...keys];
		const def = definitionById.get(defId);
		if (!def) {
			return;
		}
		const existing = filtersByFilterId.get(defId);
		if (existing) {
			update((current) => current.map((f) => (f.filterId === defId ? { ...f, values } : f)));
		} else {
			update((current) => [
				...current,
				{ filterId: defId, operatorId: def.defaultOperatorId, values },
			]);
		}
	};

	return (
		<div
			role="toolbar"
			data-slot="filter-bar"
			aria-label={ariaLabel}
			className={`flex flex-wrap items-center gap-1.5${className ? ` ${className}` : ""}`}
		>
			{filters.map((filter) => {
				const definition = definitionById.get(filter.filterId);
				if (!definition) {
					return null;
				}
				return (
					<LocalFilterBarChip
						key={filter.filterId}
						filter={filter}
						definition={definition}
						onUpdate={(filterId, changes) =>
							update((current) =>
								current.map((f) => (f.filterId === filterId ? { ...f, ...changes } : f)),
							)
						}
						onRemove={(filterId) =>
							update((current) => current.filter((f) => f.filterId !== filterId))
						}
					/>
				);
			})}

			<MenuTrigger>
				<IconButton data-slot="filter-bar-add" aria-label="Add filter" variant="ghost" size="sm">
					<AddIcon aria-hidden="true" />
				</IconButton>
				<Menu>
					{definitions.map((def) => {
						const DefIcon = def.icon;
						return (
							<MenuSub key={def.id}>
								<MenuSubTrigger textValue={def.label}>
									{DefIcon ? <DefIcon className="size-3.5" aria-hidden="true" /> : null}
									{def.label}
								</MenuSubTrigger>
								<MenuSubContent
									selectionMode="multiple"
									selectedKeys={filtersByFilterId.get(def.id)?.values ?? []}
									onSelectionChange={(keys) => {
										if (keys === "all") {
											return;
										}
										onAddFilter(def.id, new Set([...keys].map((k) => k.toString())));
									}}
								>
									{def.options.map((opt) => (
										<MenuItem key={opt.id} id={opt.id}>
											{opt.label}
										</MenuItem>
									))}
								</MenuSubContent>
							</MenuSub>
						);
					})}
				</Menu>
			</MenuTrigger>

			{children?.(state)}
		</div>
	);
};

interface LocalFilterBarChipProps {
	filter: FilterBarFilterState;
	definition: LocalFilterBarDefinition;
	onUpdate: (filterId: string, changes: { operatorId?: string; values?: Array<string> }) => void;
	onRemove: (filterId: string) => void;
}

const LocalFilterBarChip = ({
	filter,
	definition,
	onUpdate,
	onRemove,
}: LocalFilterBarChipProps) => {
	const DefIcon = definition.icon;
	const currentOp = definition.operators.find((o) => o.id === filter.operatorId);
	const valueLabel = formatValues(filter.values, definition.options, definition.pluralLabel);

	const onOperatorChange = (keys: Set<string>) => {
		const selected = [...keys][0];
		if (selected) {
			onUpdate(filter.filterId, { operatorId: selected });
		}
	};

	const onValueChange = (keys: Set<string>) => {
		const newValues = [...keys];
		if (!newValues.length) {
			onRemove(filter.filterId);
			return;
		}
		onUpdate(filter.filterId, { values: newValues });
	};

	return (
		<div
			data-slot="filter-bar-filter"
			aria-label={`${definition.label} ${currentOp?.label} ${valueLabel}`}
			className="flex shrink-0 items-center rounded-md bg-white text-xs shadow-sm ring-1 ring-border"
		>
			<span
				data-slot="filter-bar-filter-label"
				className="flex items-center gap-1 px-1.5 py-1 font-medium text-primary"
			>
				{DefIcon ? <DefIcon className="size-3.5" aria-hidden="true" /> : null}
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
					selectedKeys={new Set([filter.operatorId])}
					onSelectionChange={(keys) => {
						if (keys === "all") {
							return;
						}
						onOperatorChange(new Set([...keys].map((k) => k.toString())));
					}}
				>
					{definition.operators.map((o) => (
						<MenuItem key={o.id} id={o.id}>
							{o.label}
						</MenuItem>
					))}
				</Menu>
			</MenuTrigger>

			<MenuTrigger>
				<Button data-slot="filter-bar-filter-value" variant="ghost" size="xs">
					{filter.values.length > 0 ? valueLabel : "…"}
				</Button>
				<Menu
					selectionMode="multiple"
					selectedKeys={filter.values}
					onSelectionChange={(keys) => {
						if (keys === "all") {
							return;
						}
						onValueChange(new Set([...keys].map((k) => k.toString())));
					}}
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
		</div>
	);
};

/** Chip label: the option label for one value, `"N <pluralLabel>"` for several. */
const formatValues = (
	values: ReadonlyArray<string>,
	options: ReadonlyArray<{ id: string; label: string }>,
	pluralLabel: string,
): string => {
	if (!values.length) {
		return "";
	}
	if (values.length === 1) {
		const firstValue = values[0] ?? "";
		const opt = options.find((o) => o.id === firstValue);
		return opt?.label ?? firstValue;
	}
	return `${values.length} ${pluralLabel}`;
};
