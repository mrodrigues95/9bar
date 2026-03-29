import { CheckIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Children, type ReactElement, type ReactNode } from "react";
import {
	Menu as AriaMenu,
	MenuItem as AriaMenuItem,
	type MenuItemProps as AriaMenuItemProps,
	type MenuProps as AriaMenuProps,
	MenuSection as AriaMenuSection,
	type MenuSectionProps as AriaMenuSectionProps,
	MenuTrigger as AriaMenuTrigger,
	type MenuTriggerProps as AriaMenuTriggerProps,
	SubmenuTrigger as AriaSubmenuTrigger,
	type SubmenuTriggerProps as AriaSubmenuTriggerProps,
	Collection,
	composeRenderProps,
} from "react-aria-components";
import { cn, type VariantProps } from "tailwind-variants";
import {
	ListboxSectionHeader,
	type ListboxSectionHeaderProps,
	ListboxSeparator,
	type ListboxSeparatorProps,
	listboxItemVariants,
} from "../listbox/listbox";
import { Popover, type PopoverProps } from "../popover/popover";

/** A list of actions or options that a user can take, displayed as a dropdown from a trigger. */
export const Menu = <T extends object>(props: AriaMenuProps<T>) => {
	return (
		<AriaMenu
			data-slot="menu"
			{...props}
			className={
				cn(
					"max-h-[inherit] overflow-auto p-1 shadow-sm outline-none",
					props.className,
				) ?? ""
			}
		/>
	);
};

export interface MenuItemProps
	extends AriaMenuItemProps,
		VariantProps<typeof listboxItemVariants> {}

/** An individual action or option within a {@link Menu}. */
export const MenuItem = ({ variant, ...props }: MenuItemProps) => {
	const textValue =
		props.textValue ||
		(typeof props.children === "string" ? props.children : undefined);

	return (
		<AriaMenuItem
			data-slot="menu-item"
			{...props}
			{...(textValue ? { textValue } : {})}
			className={composeRenderProps(
				cn(props.className, "gap-1.5"),
				(className, renderProps) =>
					listboxItemVariants({ ...renderProps, variant, className }),
			)}
		>
			{composeRenderProps(
				props.children,
				(children, { selectionMode, isSelected, hasSubmenu }) => (
					<>
						{selectionMode !== "none" && (
							<span className="flex w-4 items-center">
								{isSelected && <CheckIcon className="size-3.5" />}
							</span>
						)}
						<span className="flex flex-1 items-center gap-2 truncate group-selected:font-semibold">
							{children}
						</span>
						{hasSubmenu && <ChevronRightIcon className="size-3.5" />}
					</>
				),
			)}
		</AriaMenuItem>
	);
};

export interface MenuSeparatorProps extends ListboxSeparatorProps {}

/** A visual divider placed between groups of {@link MenuItem} elements. */
export const MenuSeparator = (props: MenuSeparatorProps) => {
	return <ListboxSeparator data-slot="menu-separator" {...props} />;
};

export interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {
	/** A header element rendered above the section items. */
	title?: ReactNode;
}

/** A semantic group of related {@link MenuItem} elements within a {@link Menu}. */
export const MenuSection = <T extends object>({
	title,
	items,
	children,
	...props
}: MenuSectionProps<T>) => {
	return (
		<AriaMenuSection data-slot="menu-section" {...props}>
			{title}
			<Collection items={items ?? []}>{children}</Collection>
		</AriaMenuSection>
	);
};

export interface MenuSectionHeaderProps extends ListboxSectionHeaderProps {}

/** A styled header rendered above a {@link MenuSection}. */
export const MenuSectionHeader = (props: MenuSectionHeaderProps) => {
	return <ListboxSectionHeader data-slot="menu-section-header" {...props} />;
};

export interface MenuTriggerProps extends AriaMenuTriggerProps {
	/** Additional props forwarded to the internal {@link Popover}. */
	popoverProps?: PopoverProps;
}

/** Wraps a trigger element and a {@link Menu}, handling open/close state and popover positioning. */
export const MenuTrigger = ({ popoverProps, ...props }: MenuTriggerProps) => {
	const [trigger, menu] = Children.toArray(props.children) as [
		ReactElement,
		ReactElement,
	];

	return (
		<AriaMenuTrigger {...props}>
			{trigger}
			<Popover
				{...popoverProps}
				className={cn("min-w-32", popoverProps?.className) ?? ""}
			>
				{menu}
			</Popover>
		</AriaMenuTrigger>
	);
};

export interface SubmenuTriggerProps extends AriaSubmenuTriggerProps {
	/** Additional props forwarded to the internal {@link Popover}. */
	popoverProps?: PopoverProps;
}

/** Wraps a {@link MenuItem} that opens a nested sub-menu when activated. */
export const SubmenuTrigger = ({
	popoverProps,
	...props
}: SubmenuTriggerProps) => {
	const [trigger, menu] = Children.toArray(props.children) as [
		ReactElement,
		ReactElement,
	];

	return (
		<AriaSubmenuTrigger {...props}>
			{trigger}
			<Popover offset={-2} crossOffset={-4} {...popoverProps}>
				{menu}
			</Popover>
		</AriaSubmenuTrigger>
	);
};
