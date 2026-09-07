import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
import { FilterBarContext } from "./filter-bar-context";
import type { FilterBarDefinition, FilterBarFilterState, FilterBarState } from "./filter-bar-types";
import { getDefinition, resolveOperator } from "./filter-bar-utils";
import { filterBarVariants } from "./filter-bar-variants";

type InferFilterId<T> = T extends FilterBarDefinition<infer F, string> ? F : never;
type InferOperatorId<T> = T extends FilterBarDefinition<string, infer O> ? O : never;

/** Props for the {@link FilterBar} component. */
export interface FilterBarProps<
	TDefs extends ReadonlyArray<FilterBarDefinition<string, string>>,
> extends Omit<AriaToolbarProps, "orientation" | "children"> {
	/** The filterable dimensions users can add filters from. */
	definitions: TDefs;
	/** Controlled filter state. Omit for uncontrolled usage with `defaultFilters`. */
	filters?: Array<
		FilterBarFilterState<InferFilterId<TDefs[number]>, InferOperatorId<TDefs[number]>>
	>;
	/** Called whenever the filter state changes (controlled and uncontrolled). */
	onFiltersChange?: (
		filters: Array<
			FilterBarFilterState<InferFilterId<TDefs[number]>, InferOperatorId<TDefs[number]>>
		>,
	) => void;
	/** Initial filters for uncontrolled usage. */
	defaultFilters?: Array<
		FilterBarFilterState<InferFilterId<TDefs[number]>, InferOperatorId<TDefs[number]>>
	>;
	/**
	 * Render prop for toolbar actions (e.g. a "Clear all" button inside
	 * {@link FilterBarActions}), receiving the current {@link FilterBarState}.
	 */
	children?: (
		state: FilterBarState<InferFilterId<TDefs[number]>, InferOperatorId<TDefs[number]>>,
	) => ReactNode;
}

type Filter = FilterBarFilterState;

/**
 * An opinionated filter toolbar: active filters render as chips with operator
 * and value menus, and a menu button adds new filters from `definitions`.
 * Composes {@link Button}, {@link IconButton}, and {@link Menu} primitives.
 * Supports controlled (`filters` + `onFiltersChange`) and uncontrolled
 * (`defaultFilters`) usage.
 */
export const FilterBar = <TDefs extends ReadonlyArray<FilterBarDefinition<string, string>>>({
	definitions,
	filters: controlledFilters,
	onFiltersChange,
	defaultFilters,
	children,
	...toolbarProps
}: FilterBarProps<TDefs>) => {
	const [uncontrolledFilters, setUncontrolledFilters] = useState<Array<Filter>>(
		() => defaultFilters ?? [],
	);
	const isControlled = controlledFilters !== undefined;
	const filters: Array<Filter> = isControlled ? controlledFilters : uncontrolledFilters;

	const onFiltersChangeRef = useRef<any>(onFiltersChange);
	useEffect(() => {
		onFiltersChangeRef.current = onFiltersChange;
	}, [onFiltersChange]);

	const definitionById = useMemo(() => new Map(definitions.map((d) => [d.id, d])), [definitions]);

	const update = useCallback(
		(getNext: (current: Array<Filter>) => Array<Filter>) => {
			if (!isControlled) {
				setUncontrolledFilters((prev) => {
					const next = getNext(prev);
					onFiltersChangeRef.current?.(next);
					return next;
				});
			} else {
				onFiltersChangeRef.current?.(getNext(filters));
			}
		},
		[isControlled, filters],
	);

	const addFilter = useCallback(
		(filterId: string, operatorId: string, values: Array<string> = []): string => {
			const id = crypto.randomUUID();
			update((current) => [...current, { id, filterId, operatorId, values }]);
			return id;
		},
		[update],
	);

	const removeFilter = useCallback(
		(id: string) => {
			update((current) => current.filter((f) => f.id !== id));
		},
		[update],
	);

	const updateOperator = useCallback(
		(id: string, operatorId: string) => {
			update((current) => current.map((f) => (f.id === id ? { ...f, operatorId } : f)));
		},
		[update],
	);

	const updateValues = useCallback(
		(id: string, values: Array<string>) => {
			update((current) => current.map((f) => (f.id === id ? { ...f, values } : f)));
		},
		[update],
	);

	const clearAll = useCallback(() => {
		update(() => []);
	}, [update]);

	const handleFilterUpdate = useCallback(
		(id: string, changes: { operatorId?: string; values?: Array<string> }) => {
			update((current) => current.map((f) => (f.id === id ? { ...f, ...changes } : f)));
		},
		[update],
	);

	const state = useMemo(
		() => ({
			filters,
			clearAll,
			removeFilter,
			addFilter,
			updateOperator,
			updateValues,
		}),
		[filters, clearAll, removeFilter, addFilter, updateOperator, updateValues],
	);

	const filtersByFilterId = useMemo(() => new Map(filters.map((f) => [f.filterId, f])), [filters]);

	const handleAddFilter = useCallback(
		(defId: string, keys: Selection) => {
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
					current.map((f) => (f.id === existing.id ? { ...f, operatorId: newOp, values } : f)),
				);
			} else {
				const op = resolveOperator(def.defaultOperatorId, values.length, def.operatorPairs);
				const id = crypto.randomUUID();
				update((current) => [...current, { id, filterId: defId, operatorId: op, values }]);
			}
		},
		[definitionById, filtersByFilterId, update],
	);

	return (
		<FilterBarContext.Provider value={state}>
			<AriaToolbar
				orientation="horizontal"
				data-slot="filter-bar"
				{...toolbarProps}
				className={cn(filterBarVariants.root, toolbarProps.className) ?? ""}
			>
				{filters.map((filter) => (
					<FilterBarChip
						key={filter.id}
						filter={filter}
						definition={getDefinition(definitionById, filter.filterId)}
						onUpdate={handleFilterUpdate}
						onRemove={removeFilter}
					/>
				))}

				<MenuTrigger>
					<IconButton data-slot="filter-bar-add" aria-label="Add filter" variant="ghost" size="sm">
						<Plus aria-hidden="true" />
					</IconButton>
					<Menu>
						{definitions.map((def) => (
							<MenuSub key={def.id}>
								<MenuSubTrigger textValue={def.label}>
									{def.icon && (
										<span className="[&_svg]:size-4" aria-hidden="true">
											{def.icon}
										</span>
									)}
									{def.label}
								</MenuSubTrigger>
								<MenuSubContent
									selectionMode="multiple"
									selectedKeys={filtersByFilterId.get(def.id)?.values ?? []}
									onSelectionChange={(keys) => handleAddFilter(def.id, keys)}
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

				{children?.(
					// SAFETY: the filters in state were built from these exact definitions (see
					// addFilter/handleAddFilter), so the erased string IDs are the precise literal
					// IDs at runtime. `state` only carries callbacks that read refs inside event
					// handlers (the rule cannot see through the render prop), and the internal
					// state erases the literal IDs (same bridge as the FilterBarContext typing above).
					// eslint-disable-next-line react/refs
					state as FilterBarState<any, any>,
				)}
			</AriaToolbar>
		</FilterBarContext.Provider>
	);
};
