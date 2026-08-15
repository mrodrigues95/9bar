import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import type * as React from "react";
import {
	Button as ButtonPrimitive,
	composeRenderProps,
	Header as HeaderPrimitive,
	ListBoxItem as ListBoxItemPrimitive,
	ListBox as ListBoxPrimitive,
	type ListBoxProps,
	ListBoxSection as ListBoxSectionPrimitive,
	Popover as PopoverPrimitive,
	SearchField,
	type SearchFieldProps,
	type ListBoxSectionProps as SelectGroupProps,
	Select as SelectPrimitive,
	type SelectProps,
	SelectValue as SelectValuePrimitive,
	type SelectValueProps,
	Separator as SeparatorPrimitive,
} from "react-aria-components";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#components/input-group";
import { cn } from "#lib/utils";

/** Props for the {@link Select} component. */
export type { SelectProps };

/** A dropdown that allows a user to choose one or more options from a collapsible list. Compose {@link SelectTrigger}, {@link SelectValue}, and {@link SelectContent}. */
export const Select = <
	T extends object,
	M extends "single" | "multiple" = "single",
>({
	className,
	...props
}: SelectProps<T, M>) => {
	return (
		<SelectPrimitive
			data-slot="select"
			className={cn("w-fit", className)}
			{...props}
		/>
	);
};

/** Props for the {@link SelectGroup} component. */
export type { SelectGroupProps };

/** A semantic group of related {@link SelectItem} elements within a {@link SelectList}. */
export const SelectGroup = <T extends object>({
	className,
	...props
}: SelectGroupProps<T>) => {
	return (
		<ListBoxSectionPrimitive
			data-slot="select-group"
			className={cn("scroll-my-1", className)}
			{...props}
		/>
	);
};

/** Props for the {@link SelectValue} component. */
export type { SelectValueProps };

/** Renders the currently selected item or a placeholder inside a {@link SelectTrigger}. */
export const SelectValue = <T extends object>({
	className,
	children,
	...props
}: SelectValueProps<T>) => {
	return (
		<SelectValuePrimitive
			data-slot="select-value"
			className={cn(
				"flex flex-1 text-left data-placeholder:text-muted-foreground",
				className,
			)}
			{...props}
		>
			{typeof children === "function"
				? children
				: ({ selectedItems, selectedText, defaultChildren }) =>
						selectedItems.length > 1 ? selectedText : defaultChildren}
		</SelectValuePrimitive>
	);
};

/** Props for the {@link SelectTrigger} component. */
export type SelectTriggerProps = Omit<
	React.ComponentProps<typeof ButtonPrimitive>,
	"children"
> & {
	children?: React.ReactNode;
	size?: "sm" | "default";
};

/** The button that opens the {@link Select} popover and displays the current value. */
export const SelectTrigger = ({
	className,
	size = "default",
	children,
	...props
}: SelectTriggerProps) => {
	return (
		<ButtonPrimitive
			data-slot="select-trigger"
			data-size={size}
			className={cn(
				[
					"flex w-full items-center justify-between gap-1.5 whitespace-nowrap",
					"rounded-md border border-input bg-input/20 px-2 py-1.5 text-xs/relaxed",
					"outline-none transition-colors",
					"focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
					"disabled:cursor-not-allowed disabled:opacity-50",
					"aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
					"data-[size=default]:h-7 data-[size=sm]:h-6",
					"data-placeholder:text-muted-foreground",
					"*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex",
					"*:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5",
					"dark:bg-input/30 dark:aria-invalid:border-destructive/50",
					"dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50",
					"[&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				],
				className,
			)}
			{...props}
		>
			{children}
			<ChevronDownIcon className="pointer-events-none size-3.5 text-muted-foreground" />
		</ButtonPrimitive>
	);
};

/** Props for the {@link SelectContent} component. */
export type SelectContentProps = Omit<
	React.ComponentProps<typeof PopoverPrimitive>,
	"className" | "children"
> & {
	className?: string;
	children?: React.ReactNode;
};

/** The floating overlay that wraps a {@link SelectList} and its items. */
export const SelectContent = ({
	className,
	children,
	placement = "bottom",
	offset = 4,
	crossOffset = 0,
	...props
}: SelectContentProps) => {
	return (
		<SelectPopover
			className={className}
			placement={placement}
			offset={offset}
			crossOffset={crossOffset}
			{...props}
		>
			{children}
		</SelectPopover>
	);
};

/** Props for the {@link SelectPopover} component. */
export type SelectPopoverProps = Omit<
	React.ComponentProps<typeof PopoverPrimitive>,
	"className" | "children"
> & {
	className?: string;
	children?: React.ReactNode;
};

/** The popover that anchors the {@link SelectList} to the {@link SelectTrigger}. */
export const SelectPopover = ({
	className,
	children,
	placement = "bottom start",
	offset = 4,
	crossOffset = 0,
	...props
}: SelectPopoverProps) => {
	return (
		<PopoverPrimitive
			data-slot="select-content"
			placement={placement}
			offset={offset}
			crossOffset={crossOffset}
			className={cn(
				[
					"data-entering:fade-in-0 data-entering:zoom-in-95",
					"data-exiting:fade-out-0 data-exiting:zoom-out-95",
					"data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2",
					"data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
					"relative isolate z-50 w-(--trigger-width) min-w-32 origin-(--trigger-anchor-point)",
					"overflow-hidden rounded-lg bg-popover text-popover-foreground",
					"shadow-md ring-1 ring-foreground/10",
					"duration-100",
					"data-entering:animate-in data-exiting:animate-out",
					"**:data-[slot$=-item]:data-focused:bg-foreground/10",
				],
				className,
			)}
			{...props}
		>
			{children}
		</PopoverPrimitive>
	);
};

/** Props for the {@link SelectList} component. */
export type { ListBoxProps };

/** The scrollable list of options rendered inside a {@link SelectContent}. */
export const SelectList = <T extends object>({
	className,
	...props
}: ListBoxProps<T>) => {
	return (
		<ListBoxPrimitive
			data-slot="select-list"
			className={cn(
				"group/select-list max-h-[inherit] overflow-y-auto overflow-x-hidden p-1 outline-hidden",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link SelectInput} component. */
export type { SearchFieldProps };

/** A search input rendered above the {@link SelectList}, enabling filtered selection for large option sets. */
export const SelectInput = ({ className, ...props }: SearchFieldProps) => {
	return (
		<SearchField
			{...props}
			autoFocus
			data-slot="select-input-wrapper"
			className={cn("p-1 pb-0", className)}
		>
			<InputGroup>
				<InputGroupInput
					data-slot="select-input"
					className="[&::-webkit-search-cancel-button]:hidden"
				/>
				<InputGroupAddon>
					<SearchIcon className="size-3.5 shrink-0 opacity-50" />
				</InputGroupAddon>
			</InputGroup>
		</SearchField>
	);
};

/** Props for the {@link SelectLabel} component. */
export type SelectLabelProps = React.ComponentProps<typeof HeaderPrimitive>;

/** A heading rendered above a group of {@link SelectItem} elements. */
export const SelectLabel = ({ className, ...props }: SelectLabelProps) => {
	return (
		<HeaderPrimitive
			data-slot="select-label"
			className={cn("px-2 py-1.5 text-muted-foreground text-xs", className)}
			{...props}
		/>
	);
};

/** Props for the {@link SelectItem} component. */
export type SelectItemProps = React.ComponentProps<typeof ListBoxItemPrimitive>;

/** An individual option within a {@link SelectList}. */
export const SelectItem = ({
	className,
	children,
	...props
}: SelectItemProps) => {
	return (
		<ListBoxItemPrimitive
			data-slot="select-item"
			textValue={typeof children === "string" ? children : undefined}
			className={cn(
				[
					"relative flex min-h-7 w-full cursor-default select-none items-center gap-2",
					"rounded-md px-2 py-1 text-xs/relaxed outline-hidden",
					"focus:bg-accent focus:text-accent-foreground",
					"not-data-[variant=destructive]:focus:**:text-accent-foreground",
					"data-disabled:pointer-events-none data-focused:bg-accent data-focused:text-accent-foreground",
					"data-disabled:opacity-50",
					"[&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
					"*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
				],
				className,
			)}
			{...props}
		>
			{composeRenderProps(children, (children, { isSelected }) => (
				<>
					<span className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
						{children}
					</span>
					<span className="pointer-events-none absolute right-2 flex items-center justify-center">
						{isSelected ? <CheckIcon className="pointer-events-none" /> : null}
					</span>
				</>
			))}
		</ListBoxItemPrimitive>
	);
};

/** Props for the {@link SelectSeparator} component. */
export type SelectSeparatorProps = React.ComponentProps<
	typeof SeparatorPrimitive
>;

/** A divider between {@link SelectGroup} sections within a {@link SelectList}. */
export const SelectSeparator = ({
	className,
	...props
}: SelectSeparatorProps) => {
	return (
		<SeparatorPrimitive
			data-slot="select-separator"
			className={cn(
				"pointer-events-none -mx-1 my-1 h-px bg-border/50",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link SelectEmpty} component. */
export type SelectEmptyProps = React.ComponentProps<"div">;

/** A message displayed when a filtered {@link SelectList} has no matching options. */
export const SelectEmpty = ({ className, ...props }: SelectEmptyProps) => {
	return (
		<div
			data-slot="select-empty"
			className={cn(
				[
					"hidden w-full justify-center py-2 text-center text-muted-foreground",
					"text-xs/relaxed group-data-empty/select-list:flex",
				],
				className,
			)}
			{...props}
		/>
	);
};
