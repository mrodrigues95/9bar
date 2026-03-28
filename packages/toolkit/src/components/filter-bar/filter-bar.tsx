import { PlusIcon } from "@heroicons/react/24/solid";
import {
	type ComponentProps,
	type ReactNode,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	Group as AriaGroup,
	type GroupProps as AriaGroupProps,
	Toolbar as AriaToolbar,
	type ToolbarProps as AriaToolbarProps,
} from "react-aria-components";
import { cn, tv, type VariantProps } from "tailwind-variants";
import { Button } from "../button/button";
import { IconButton, type IconButtonProps } from "../icon-button/icon-button";
import { MenuTrigger, type MenuTriggerProps } from "../menu/menu";

export interface FilterBarFilterState<
	TFilterId extends string = string,
	TOperatorId extends string = string,
> {
	id: string;
	filterId: TFilterId;
	operatorId: TOperatorId;
	values: Array<string>;
}

export interface UseFilterBarStateOptions<
	TFilterId extends string = string,
	TOperatorId extends string = string,
> {
	defaultFilters?: FilterBarFilterState<TFilterId, TOperatorId>[];
	filters?: FilterBarFilterState<TFilterId, TOperatorId>[];
	onFiltersChange?: (
		filters: FilterBarFilterState<TFilterId, TOperatorId>[],
	) => void;
}

export const useFilterBarState = <
	TFilterId extends string = string,
	TOperatorId extends string = string,
>({
	defaultFilters = [],
	filters: controlledFilters,
	onFiltersChange,
}: UseFilterBarStateOptions<TFilterId, TOperatorId> = {}) => {
	const [uncontrolledFilters, setUncontrolledFilters] =
		useState<FilterBarFilterState<TFilterId, TOperatorId>[]>(defaultFilters);

	const isControlled = controlledFilters !== undefined;
	const filters = isControlled ? controlledFilters : uncontrolledFilters;

	const onFiltersChangeRef =
		useRef<UseFilterBarStateOptions<TFilterId, TOperatorId>["onFiltersChange"]>(
			onFiltersChange,
		);
	onFiltersChangeRef.current = onFiltersChange;

	const update = useCallback(
		(
			getNext: (
				current: FilterBarFilterState<TFilterId, TOperatorId>[],
			) => FilterBarFilterState<TFilterId, TOperatorId>[],
		) => {
			if (!isControlled) {
				setUncontrolledFilters((prev) => {
					const next = getNext(prev);
					onFiltersChangeRef.current?.(next);
					return next;
				});
			} else {
				onFiltersChange?.(getNext(controlledFilters));
			}
		},
		[isControlled, onFiltersChange, controlledFilters],
	);

	const onAddFilter = useCallback(
		(
			filterId: TFilterId,
			operatorId: TOperatorId,
			values: Array<string> = [],
		): string => {
			const id = crypto.randomUUID();
			update((current) => [...current, { id, filterId, operatorId, values }]);
			return id;
		},
		[update],
	);

	const onRemoveFilter = useCallback(
		(id: string) => {
			update((current) => current.filter((f) => f.id !== id));
		},
		[update],
	);

	const onUpdateOperator = useCallback(
		(id: string, operatorId: TOperatorId) => {
			update((current) =>
				current.map((f) => (f.id === id ? { ...f, operatorId } : f)),
			);
		},
		[update],
	);

	const onUpdateValues = useCallback(
		(id: string, values: Array<string>) => {
			update((current) =>
				current.map((f) => (f.id === id ? { ...f, values } : f)),
			);
		},
		[update],
	);

	const onClearAll = useCallback(() => {
		update(() => []);
	}, [update]);

	return useMemo(
		() => ({
			filters,
			onAddFilter,
			onRemoveFilter,
			onUpdateOperator,
			onUpdateValues,
			onClearAll,
		}),
		[
			filters,
			onAddFilter,
			onRemoveFilter,
			onUpdateOperator,
			onUpdateValues,
			onClearAll,
		],
	);
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

export interface FilterBarProps
	extends Omit<AriaToolbarProps, "orientation">,
		VariantProps<typeof filterBarVariants> {}

export const FilterBar = (props: FilterBarProps) => {
	const styles = filterBarVariants();
	return (
		<AriaToolbar
			orientation="horizontal"
			data-slot="filter-bar"
			{...props}
			className={cn(styles.root(), props.className) ?? ""}
		/>
	);
};

export interface FilterBarFilterProps extends AriaGroupProps {}

export const FilterBarFilter = (props: FilterBarFilterProps) => {
	const styles = filterBarVariants();
	return (
		<AriaGroup
			data-slot="filter-bar-filter"
			{...props}
			className={cn(styles.filter(), props.className) ?? ""}
		/>
	);
};

export interface FilterBarFilterLabelProps extends ComponentProps<"span"> {}

export const FilterBarFilterLabel = ({
	className,
	...props
}: FilterBarFilterLabelProps) => {
	const styles = filterBarVariants();
	return (
		<span
			data-slot="filter-bar-filter-label"
			className={cn(styles.filterLabel(), className) ?? ""}
			{...props}
		/>
	);
};

export interface FilterBarFilterOperatorProps
	extends Omit<MenuTriggerProps, "children"> {
	children: ReactNode;
	label: ReactNode;
}

export const FilterBarFilterOperator = ({
	label,
	children,
	...props
}: FilterBarFilterOperatorProps) => {
	const styles = filterBarVariants();
	return (
		<MenuTrigger {...props}>
			<Button
				data-slot="filter-bar-filter-operator"
				variant="ghost"
				size="xs"
				className={styles.filterOperator()}
			>
				{label}
			</Button>
			{children}
		</MenuTrigger>
	);
};

export interface FilterBarFilterValueProps
	extends Omit<MenuTriggerProps, "children"> {
	children: ReactNode;
	label: ReactNode;
	selectedKeys: readonly string[];
	onRemove?: () => void;
}

export const FilterBarFilterValue = ({
	label,
	children,
	selectedKeys,
	onRemove,
	onOpenChange: onOpenChangeProp,
	...props
}: FilterBarFilterValueProps) => {
	const styles = filterBarVariants();
	const selectedKeysRef = useRef(selectedKeys);
	selectedKeysRef.current = selectedKeys;

	const handleOpenChange = useCallback(
		(isOpen: boolean) => {
			onOpenChangeProp?.(isOpen);
			if (!isOpen && selectedKeysRef.current.length === 0) {
				onRemove?.();
			}
		},
		[onOpenChangeProp, onRemove],
	);

	return (
		<MenuTrigger {...props} onOpenChange={handleOpenChange}>
			<Button
				data-slot="filter-bar-filter-value"
				className={styles.filterValue()}
				variant="ghost"
				size="xs"
			>
				{selectedKeys.length > 0 ? label : "\u2026"}
			</Button>
			{children}
		</MenuTrigger>
	);
};

export interface FilterBarFilterRemoveProps extends IconButtonProps {}

export const FilterBarFilterRemove = ({
	size = "xs",
	variant = "ghost",
	...props
}: FilterBarFilterRemoveProps) => {
	return (
		<IconButton
			data-slot="filter-bar-filter-remove"
			variant={variant}
			size={size}
			className="mr-1.5"
			{...props}
		/>
	);
};

export interface FilterBarAddProps extends Omit<MenuTriggerProps, "children"> {
	children: ReactNode;
	triggerProps?: Omit<IconButtonProps, "aria-label" | "children">;
	"aria-label"?: string;
}

export const FilterBarAdd = ({
	children,
	triggerProps,
	"aria-label": ariaLabel = "Add filter",
	...props
}: FilterBarAddProps) => {
	return (
		<MenuTrigger {...props}>
			<IconButton
				data-slot="filter-bar-add"
				aria-label={ariaLabel}
				variant="ghost"
				size="sm"
				{...triggerProps}
			>
				<PlusIcon aria-hidden="true" />
			</IconButton>
			{children}
		</MenuTrigger>
	);
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
