import {
	Button,
	IconButton,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	SubmenuTrigger,
} from "@9bar/toolkit";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	Group as AriaGroup,
	Toolbar as AriaToolbar,
	type ToolbarProps as AriaToolbarProps,
	type Key,
	type Selection,
} from "react-aria-components";
import { cn, tv } from "tailwind-variants";

export interface FilterBarOption {
	id: string;
	label: string;
}

export interface FilterBarDefinition<
	TFilterId extends string = string,
	TOperatorId extends string = string,
> {
	id: TFilterId;
	label: string;
	pluralLabel: string;
	icon?: ReactNode;
	operators: ReadonlyArray<{ id: TOperatorId; label: string }>;
	defaultOperatorId: TOperatorId;
	options: ReadonlyArray<FilterBarOption>;
	operatorPairs?: ReadonlyArray<{
		singular: TOperatorId;
		plural: TOperatorId;
	}>;
	formatValue?: (
		values: readonly string[],
		options: ReadonlyArray<FilterBarOption>,
	) => string;
	/** Whether to partition value menu options (selected first, then unselected). Defaults to `true`. */
	partitionOptions?: boolean;
}

export interface FilterBarFilterState<
	TFilterId extends string = string,
	TOperatorId extends string = string,
> {
	id: string;
	filterId: TFilterId;
	operatorId: TOperatorId;
	values: Array<string>;
}

export interface FilterBarState<
	TFilterId extends string = string,
	TOperatorId extends string = string,
> {
	filters: Array<FilterBarFilterState<TFilterId, TOperatorId>>;
	clearAll: () => void;
	removeFilter: (id: string) => void;
	addFilter: (
		filterId: TFilterId,
		operatorId: TOperatorId,
		values?: Array<string>,
	) => string;
	updateOperator: (id: string, operatorId: TOperatorId) => void;
	updateValues: (id: string, values: Array<string>) => void;
}
type InferFilterId<T> =
	T extends FilterBarDefinition<infer F, string> ? F : never;
type InferOperatorId<T> =
	T extends FilterBarDefinition<string, infer O> ? O : never;

const resolveOperator = (
	currentOp: string,
	valueCount: number,
	operatorPairs?: ReadonlyArray<{ singular: string; plural: string }>,
): string => {
	if (!operatorPairs) return currentOp;
	for (const { singular, plural } of operatorPairs) {
		if (currentOp === singular && valueCount > 1) return plural;
		if (currentOp === plural && valueCount <= 1) return singular;
	}
	return currentOp;
};

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

const formatValuesDefault = (
	values: readonly string[],
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

const partitionFilterOptions = (
	options: ReadonlyArray<FilterBarOption>,
	values: readonly string[],
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

export const filterBarVariants = tv({
	slots: {
		root: "flex flex-wrap items-center gap-1.5",
		filter: [
			"flex shrink-0 items-center rounded-md bg-white text-xs shadow-sm ring-1 ring-border",
		],
		filterLabel:
			"flex items-center gap-1 px-1.5 py-1 font-medium text-primary [&_svg]:size-3.5",
		filterOperator: ["rounded-none font-normal"],
		filterValue: ["rounded-none"],
		filterRemove: "",
		actions: "ml-auto flex items-center gap-1",
	},
});

// biome-ignore lint/suspicious/noExplicitAny: Type-erased context for generic component
const FilterBarContext = createContext<FilterBarState<any, any> | null>(null);

export const useFilterBarContext = <
	TFilterId extends string = string,
	TOperatorId extends string = string,
>(): FilterBarState<TFilterId, TOperatorId> => {
	const ctx = useContext(FilterBarContext);
	if (!ctx) {
		throw new Error("useFilterBarContext must be used within a FilterBar");
	}
	return ctx;
};

export interface FilterBarActionsProps extends ComponentProps<"div"> {}

export const FilterBarActions = ({
	className,
	...props
}: FilterBarActionsProps) => {
	const styles = filterBarVariants();
	return (
		<div
			data-slot="filter-bar-actions"
			className={cn(styles.actions(), className) ?? ""}
			{...props}
		/>
	);
};

interface FilterBarChipProps {
	filter: FilterBarFilterState;
	definition: FilterBarDefinition;
	onUpdate: (
		id: string,
		changes: { operatorId?: string; values?: string[] },
	) => void;
	onRemove: (id: string) => void;
}

const FilterBarChip = ({
	filter,
	definition,
	onUpdate,
	onRemove,
}: FilterBarChipProps) => {
	const styles = filterBarVariants();

	const currentOp = definition.operators.find(
		(o) => o.id === filter.operatorId,
	);
	const visibleOperators = getVisibleOperators(
		definition.operators,
		filter.values.length,
		definition.operatorPairs,
	);

	const valueLabel = definition.formatValue
		? definition.formatValue(filter.values, definition.options)
		: formatValuesDefault(
				filter.values,
				definition.options,
				definition.pluralLabel,
			);

	const shouldPartition = definition.partitionOptions !== false;
	const [selectedOptions, unselectedOptions] = shouldPartition
		? partitionFilterOptions(definition.options, filter.values)
		: [[], []];

	// Auto-remove when value menu closes with no selections
	const selectedKeysRef = useRef(filter.values);
	selectedKeysRef.current = filter.values;

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
			const newOp = resolveOperator(
				filter.operatorId,
				newValues.length,
				definition.operatorPairs,
			);
			onUpdate(filter.id, {
				...(newOp !== filter.operatorId ? { operatorId: newOp } : {}),
				values: newValues,
			});
		},
		[onUpdate, filter.id, filter.operatorId, definition.operatorPairs],
	);

	return (
		<AriaGroup
			data-slot="filter-bar-filter"
			aria-label={`${definition.label} ${currentOp?.label} ${valueLabel}`}
			className={styles.filter()}
		>
			<span
				data-slot="filter-bar-filter-label"
				className={styles.filterLabel()}
			>
				{definition.icon}
				{definition.label}
			</span>

			<MenuTrigger>
				<Button
					data-slot="filter-bar-filter-operator"
					variant="ghost"
					size="xs"
					className={styles.filterOperator()}
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
					className={styles.filterValue()}
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
							{selectedOptions.length > 0 && unselectedOptions.length > 0 && (
								<MenuSeparator />
							)}
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
				<XMarkIcon />
			</IconButton>
		</AriaGroup>
	);
};

export interface FilterBarProps<
	TDefs extends readonly FilterBarDefinition<string, string>[],
> extends Omit<AriaToolbarProps, "orientation" | "children"> {
	definitions: TDefs;
	filters?: Array<
		FilterBarFilterState<
			InferFilterId<TDefs[number]>,
			InferOperatorId<TDefs[number]>
		>
	>;
	onFiltersChange?: (
		filters: Array<
			FilterBarFilterState<
				InferFilterId<TDefs[number]>,
				InferOperatorId<TDefs[number]>
			>
		>,
	) => void;
	defaultFilters?: Array<
		FilterBarFilterState<
			InferFilterId<TDefs[number]>,
			InferOperatorId<TDefs[number]>
		>
	>;
	children?: (
		state: FilterBarState<
			InferFilterId<TDefs[number]>,
			InferOperatorId<TDefs[number]>
		>,
	) => ReactNode;
}

type Filter = FilterBarFilterState;

export const FilterBar = <
	TDefs extends readonly FilterBarDefinition<string, string>[],
>({
	definitions,
	filters: controlledFilters,
	onFiltersChange,
	defaultFilters,
	children,
	...toolbarProps
}: FilterBarProps<TDefs>) => {
	const [uncontrolledFilters, setUncontrolledFilters] = useState<Filter[]>(
		() => (defaultFilters as Filter[] | undefined) ?? [],
	);
	const isControlled = controlledFilters !== undefined;
	const filters: Filter[] = isControlled
		? (controlledFilters as Filter[])
		: uncontrolledFilters;

	// biome-ignore lint/suspicious/noExplicitAny: Type-erased ref for generic callback
	const onFiltersChangeRef = useRef<any>(onFiltersChange);
	onFiltersChangeRef.current = onFiltersChange;

	const definitionById = useMemo(
		() => new Map(definitions.map((d) => [d.id, d])),
		[definitions],
	);

	const getDefinition = useCallback(
		(filterId: string): FilterBarDefinition => {
			const def = definitionById.get(filterId);
			if (!def) {
				throw new Error(`Unknown filter definition: ${filterId}`);
			}
			return def;
		},
		[definitionById],
	);

	const update = useCallback(
		(getNext: (current: Filter[]) => Filter[]) => {
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
		(
			filterId: string,
			operatorId: string,
			values: Array<string> = [],
		): string => {
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
			update((current) =>
				current.map((f) => (f.id === id ? { ...f, operatorId } : f)),
			);
		},
		[update],
	);

	const updateValues = useCallback(
		(id: string, values: Array<string>) => {
			update((current) =>
				current.map((f) => (f.id === id ? { ...f, values } : f)),
			);
		},
		[update],
	);

	const clearAll = useCallback(() => {
		update(() => []);
	}, [update]);

	const handleFilterUpdate = useCallback(
		(id: string, changes: { operatorId?: string; values?: string[] }) => {
			update((current) =>
				current.map((f) => (f.id === id ? { ...f, ...changes } : f)),
			);
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

	const filtersByFilterId = useMemo(
		() => new Map(filters.map((f) => [f.filterId, f])),
		[filters],
	);

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
				const newOp = resolveOperator(
					existing.operatorId,
					values.length,
					def.operatorPairs,
				);
				update((current) =>
					current.map((f) =>
						f.id === existing.id ? { ...f, operatorId: newOp, values } : f,
					),
				);
			} else {
				const op = resolveOperator(
					def.defaultOperatorId,
					values.length,
					def.operatorPairs,
				);
				const id = crypto.randomUUID();
				update((current) => [
					...current,
					{ id, filterId: defId, operatorId: op, values },
				]);
			}
		},
		[definitionById, filtersByFilterId, update],
	);

	const styles = filterBarVariants();

	return (
		<FilterBarContext.Provider value={state}>
			<AriaToolbar
				orientation="horizontal"
				data-slot="filter-bar"
				{...toolbarProps}
				className={cn(styles.root(), toolbarProps.className) ?? ""}
			>
				{filters.map((filter) => (
					<FilterBarChip
						key={filter.id}
						filter={filter}
						definition={getDefinition(filter.filterId)}
						onUpdate={handleFilterUpdate}
						onRemove={removeFilter}
					/>
				))}

				<MenuTrigger>
					<IconButton
						data-slot="filter-bar-add"
						aria-label="Add filter"
						variant="ghost"
						size="sm"
					>
						<PlusIcon aria-hidden="true" />
					</IconButton>
					<Menu>
						{definitions.map((def) => (
							<SubmenuTrigger key={def.id}>
								<MenuItem textValue={def.label}>
									{def.icon && (
										<span className="[&_svg]:size-4" aria-hidden="true">
											{def.icon}
										</span>
									)}
									{def.label}
								</MenuItem>
								<Menu
									selectionMode="multiple"
									selectedKeys={filtersByFilterId.get(def.id)?.values ?? []}
									onSelectionChange={(keys) => handleAddFilter(def.id, keys)}
								>
									{def.options.map((opt) => (
										<MenuItem key={opt.id} id={opt.id}>
											{opt.label}
										</MenuItem>
									))}
								</Menu>
							</SubmenuTrigger>
						))}
					</Menu>
				</MenuTrigger>

				{children?.(
					state as unknown as FilterBarState<
						InferFilterId<TDefs[number]>,
						InferOperatorId<TDefs[number]>
					>,
				)}
			</AriaToolbar>
		</FilterBarContext.Provider>
	);
};
