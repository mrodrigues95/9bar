import { Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
	Toolbar as AriaToolbar,
	type ToolbarProps as AriaToolbarProps,
	type Selection,
} from "react-aria-components";
import { IconButton } from "#components/icon-button";
import {
	Menu,
	MenuItem,
	MenuSub,
	MenuSubContent,
	MenuSubTrigger,
	MenuTrigger,
} from "#components/menu";
import { cn } from "#lib/utils";
import { FilterBarChip } from "./filter-bar-chip";
import type { FilterBarDefinition, FilterBarFilterState, FilterBarState } from "./filter-bar-types";
import { resolveOperator } from "./utils";

/** Props for the {@link FilterBar} component. */
export interface FilterBarProps extends Omit<AriaToolbarProps, "orientation" | "children"> {
	/** The filterable dimensions users can add filters from. */
	definitions: ReadonlyArray<FilterBarDefinition>;
	/** Controlled filter state. Omit for uncontrolled usage with `defaultFilters`. */
	filters?: Array<FilterBarFilterState>;
	/** Called whenever the filter state changes (controlled and uncontrolled). */
	onFiltersChange?: (filters: Array<FilterBarFilterState>) => void;
	/** Initial filters for uncontrolled usage. */
	defaultFilters?: Array<FilterBarFilterState>;
	/**
	 * Render prop for toolbar actions (e.g. a "Clear all" button inside
	 * {@link FilterBarActions}), receiving the current {@link FilterBarState}.
	 */
	children?: (state: FilterBarState) => ReactNode;
}

/**
 * An opinionated filter toolbar: active filters render as chips with operator
 * and value menus, and a menu button adds new filters from `definitions`.
 * Composes {@link Button}, {@link IconButton}, and {@link Menu} primitives.
 * Supports controlled (`filters` + `onFiltersChange`) and uncontrolled
 * (`defaultFilters`) usage. At most one filter exists per definition.
 * Memoized by the React Compiler; manual `useMemo`/`useCallback` omitted.
 */
export const FilterBar = ({
	definitions,
	filters: controlledFilters,
	onFiltersChange,
	defaultFilters,
	children,
	...toolbarProps
}: FilterBarProps) => {
	const [uncontrolledFilters, setUncontrolledFilters] = useState<Array<FilterBarFilterState>>(
		() => defaultFilters ?? [],
	);
	const isControlled = controlledFilters !== undefined;
	const filters: Array<FilterBarFilterState> = isControlled
		? controlledFilters
		: uncontrolledFilters;

	const definitionById = new Map(definitions.map((d) => [d.id, d]));

	// Computes the next state eagerly so the updater stays pure: StrictMode
	// double-invokes updater functions, so notifying inside one would call
	// `onFiltersChange` twice. All callers are discrete UI events, so the
	// closure snapshot is always fresh.
	const update = (
		getNext: (current: Array<FilterBarFilterState>) => Array<FilterBarFilterState>,
	) => {
		const next = getNext(filters);
		if (!isControlled) {
			setUncontrolledFilters(next);
		}
		onFiltersChange?.(next);
	};

	const state: FilterBarState = { filters, clearAll: () => update(() => []) };
	const filtersByFilterId = new Map(filters.map((f) => [f.filterId, f]));

	const onAddFilter = (defId: string, keys: Selection) => {
		if (keys === "all") {
			return;
		}
		const values = [...keys].map((k) => k.toString());
		const def = definitionById.get(defId);
		if (!def) {
			return;
		}

		const existing = filtersByFilterId.get(defId);
		if (existing) {
			const newOp = resolveOperator(existing.operatorId, values.length, def.operatorPairs);
			update((current) =>
				current.map((f) => (f.filterId === defId ? { ...f, operatorId: newOp, values } : f)),
			);
		} else {
			const op = resolveOperator(def.defaultOperatorId, values.length, def.operatorPairs);
			update((current) => [...current, { filterId: defId, operatorId: op, values }]);
		}
	};

	return (
		<AriaToolbar
			orientation="horizontal"
			data-slot="filter-bar"
			{...toolbarProps}
			className={cn("flex flex-wrap items-center gap-1.5", toolbarProps.className)}
		>
			{filters.map((filter) => (
				<FilterBarChip
					key={filter.filterId}
					filter={filter}
					definition={getDefinition(definitionById, filter.filterId)}
					onUpdate={(filterId, changes) =>
						update((current) =>
							current.map((f) => (f.filterId === filterId ? { ...f, ...changes } : f)),
						)
					}
					onRemove={(filterId) =>
						update((current) => current.filter((f) => f.filterId !== filterId))
					}
				/>
			))}

			<MenuTrigger>
				<IconButton data-slot="filter-bar-add" aria-label="Add filter" variant="ghost" size="sm">
					<Plus aria-hidden="true" />
				</IconButton>
				<Menu>
					{definitions.map((def) => (
						<MenuSub key={def.id}>
							<MenuSubTrigger textValue={def.label}>{def.label}</MenuSubTrigger>
							<MenuSubContent
								selectionMode="multiple"
								selectedKeys={filtersByFilterId.get(def.id)?.values ?? []}
								onSelectionChange={(keys) => onAddFilter(def.id, keys)}
							>
								{def.options.map((opt) => (
									<MenuItem key={opt.id} id={opt.id}>
										{opt.label}
									</MenuItem>
								))}
							</MenuSubContent>
						</MenuSub>
					))}
				</Menu>
			</MenuTrigger>

			{children?.(state)}
		</AriaToolbar>
	);
};

/** Reads a definition from the lookup map, throwing for unknown filter ids. */
const getDefinition = (
	definitionById: ReadonlyMap<string, FilterBarDefinition>,
	filterId: string,
): FilterBarDefinition => {
	const def = definitionById.get(filterId);
	if (!def) {
		throw new Error(`Unknown filter definition: ${filterId}`);
	}
	return def;
};
