import {
	ListBox as AriaListBox,
	type ListBoxProps as AriaListBoxProps,
	Select as AriaSelect,
	type SelectProps as AriaSelectProps,
	SelectValue as AriaSelectValue,
	type SelectValueProps as AriaSelectValueProps,
	// SelectionMode
} from "react-aria-components";
import { composeTailwindRenderProps } from "../../utils/classes";
import { Button, type ButtonProps } from "../button/button";
import {
	ListboxItem,
	type ListboxItemProps,
	ListboxSection,
	ListboxSectionHeader,
	type ListboxSectionHeaderProps,
	type ListboxSectionProps,
} from "../listbox/listbox";
import { Popover, type PopoverProps } from "../popover/popover";

type SelectionMode = "single" | "multiple";

export interface SelectProps<T extends object>
	extends AriaSelectProps<T, SelectionMode> {}

export const Select = <T extends object>({
	children,
	...props
}: SelectProps<T>) => {
	return (
		<AriaSelect
			data-slot="select"
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				"group relative flex flex-col gap-1",
			)}
		>
			{children}
		</AriaSelect>
	);
};

export interface SelectTriggerProps extends ButtonProps {}

export const SelectTrigger = (props: SelectTriggerProps) => {
	return (
		<Button
			data-slot="select-trigger"
			variant="outline"
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				"min-w-40 cursor-default text-start",
			)}
		/>
	);
};

export interface SelectValueProps<T extends object>
	extends AriaSelectValueProps<T> {}

export const SelectValue = <T extends object>({
	children,
	...props
}: SelectValueProps<T>) => {
	return (
		<AriaSelectValue
			data-slot="select-value"
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				"flex-1 truncate text-sm data-[placeholder]:font-normal data-[placeholder]:text-muted",
			)}
		>
			{children ??
				(({ selectedText, defaultChildren }) =>
					selectedText || defaultChildren)}
		</AriaSelectValue>
	);
};

export interface SelectPopoverProps extends PopoverProps {}

export const SelectPopover = (props: SelectPopoverProps) => {
	return (
		<Popover
			data-slot="select-popover"
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				"min-w-(--trigger-width)",
			)}
		/>
	);
};

export interface SelectListboxProps<T extends object>
	extends AriaListBoxProps<T> {}

export const SelectListbox = <T extends object>(
	props: SelectListboxProps<T>,
) => {
	return (
		<AriaListBox
			data-slot="select-listbox"
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				"max-h-[inherit] overflow-auto p-1 outline-hidden",
			)}
		/>
	);
};

export interface SelectItemProps<T extends object>
	extends ListboxItemProps<T> {}

export const SelectItem = <T extends object>(props: SelectItemProps<T>) => {
	return <ListboxItem data-slot="select-item" {...props} />;
};

export interface SelectSectionProps<T extends object>
	extends ListboxSectionProps<T> {}

export const SelectSection = <T extends object>(
	props: SelectSectionProps<T>,
) => {
	return <ListboxSection data-slot="select-section" {...props} />;
};

export interface SelectSectionHeaderProps extends ListboxSectionHeaderProps {}

export const SelectSectionHeader = (props: SelectSectionHeaderProps) => {
	return <ListboxSectionHeader data-slot="select-section-header" {...props} />;
};
