import { CheckIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Children, type ReactElement } from "react";
import {
	Menu as AriaMenu,
	MenuItem as AriaMenuItem,
	type MenuItemProps as AriaMenuItemProps,
	type MenuProps as AriaMenuProps,
	MenuSection as AriaMenuSection,
	type MenuSectionProps as AriaMenuSectionProps,
	MenuTrigger as AriaMenuTrigger,
	type MenuTriggerProps as AriaMenuTriggerProps,
	type SeparatorProps as AriaSeparatorProps,
	SubmenuTrigger as AriaSubmenuTrigger,
	type SubmenuTriggerProps as AriaSubmenuTriggerProps,
	Collection,
	composeRenderProps,
	Header,
	Separator,
} from "react-aria-components";
import { cn, tv, type VariantProps } from "tailwind-variants";
import { Popover, type PopoverProps } from "../popover/popover";

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

// TODO: Reuse these styles for the ListBoxItem component.
const menuItemStyles = tv({
	base: [
		"group flex cursor-default select-none items-center gap-1.5 rounded-sm px-2 py-1 font-normal text-sm outline-none [&[href]]:cursor-pointer",
		"disabled:pointer-events-none disabled:opacity-50",
		"hover:bg-slate-100",
		"pressed:bg-slate-200",
		"focus:bg-slate-100",
	],
	variants: {
		variant: {
			default: ["text-primary"],
			danger: ["text-destructive-fg"],
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface MenuItemProps
	extends AriaMenuItemProps,
		VariantProps<typeof menuItemStyles> {}

export const MenuItem = ({ variant, ...props }: MenuItemProps) => {
	const textValue =
		props.textValue ||
		(typeof props.children === "string" ? props.children : undefined);

	return (
		<AriaMenuItem
			data-slot="menu-item"
			{...props}
			{...(textValue ? { textValue } : {})}
			className={composeRenderProps(props.className, (className, renderProps) =>
				menuItemStyles({ ...renderProps, variant, className }),
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
						{hasSubmenu && (
							<ChevronRightIcon className="absolute right-2 size-3.5" />
						)}
					</>
				),
			)}
		</AriaMenuItem>
	);
};

export const MenuSeparator = (props: AriaSeparatorProps) => {
	return (
		<Separator
			data-slot="menu-separator"
			{...props}
			className={cn("mx-2 my-1 h-px bg-slate-300", props.className) ?? ""}
		/>
	);
};

export interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {
	title?: string;
}

export const MenuSection = <T extends object>(props: MenuSectionProps<T>) => {
	return (
		<AriaMenuSection
			data-slot="menu-section"
			{...props}
			className={
				cn(
					"first:-mt-[5px] after:block after:h-[5px] after:content-['']",
					props.className,
				) ?? ""
			}
		>
			{props.title && (
				<Header className="px-2 py-1.5 font-medium text-muted text-xs">
					{props.title}
				</Header>
			)}
			<Collection items={props.items ?? []}>{props.children}</Collection>
		</AriaMenuSection>
	);
};

export interface MenuTriggerProps extends AriaMenuTriggerProps {
	popoverProps?: PopoverProps;
}

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
	popoverProps?: PopoverProps;
}

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
