import { cva } from "class-variance-authority";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import type * as React from "react";
import {
	composeRenderProps,
	Header as HeaderPrimitive,
	MenuItem as MenuItemPrimitive,
	type MenuItemProps as MenuItemPrimitiveProps,
	Menu as MenuPrimitive,
	MenuSection as MenuSectionPrimitive,
	type MenuSectionProps as MenuSectionPrimitiveProps,
	MenuTrigger as MenuTriggerPrimitive,
	Popover as PopoverPrimitive,
	Separator as SeparatorPrimitive,
	SubmenuTrigger as SubmenuTriggerPrimitive,
} from "react-aria-components";
import { cn } from "#lib/utils";

/** Props for the {@link DropdownMenuTrigger} component. */
export type DropdownMenuTriggerProps = React.ComponentProps<
	typeof MenuTriggerPrimitive
>;

/** The trigger that opens the {@link DropdownMenu}, wrapping the element that receives the interaction. */
export const DropdownMenuTrigger = ({ ...props }: DropdownMenuTriggerProps) => {
	return <MenuTriggerPrimitive data-slot="dropdown-menu-trigger" {...props} />;
};

/** Props for the {@link DropdownMenu} component. */
export type DropdownMenuProps = Omit<
	React.ComponentProps<typeof MenuPrimitive<object>>,
	"children" | "className"
> &
	Pick<
		React.ComponentProps<typeof PopoverPrimitive>,
		"placement" | "offset" | "crossOffset"
	> & {
		"data-slot"?: string;
		className?: string;
		children?: React.ReactNode;
	};

/** A menu of actions displayed in a floating popover. Compose {@link DropdownMenuItem}, {@link DropdownMenuSub}, and {@link DropdownMenuSeparator}. */
export const DropdownMenu = ({
	"data-slot": dataSlot = "dropdown-menu-content",
	placement = "bottom start",
	offset = 4,
	crossOffset = 0,
	className,
	children,
	...props
}: DropdownMenuProps) => {
	return (
		<PopoverPrimitive
			data-slot={dataSlot}
			placement={placement}
			offset={offset}
			crossOffset={crossOffset}
			className={cn(
				[
					"data-entering:fade-in-0 data-entering:zoom-in-95",
					"data-exiting:fade-out-0 data-exiting:zoom-out-95",
					"data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2",
					"data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
					"data-entering:animate-in data-exiting:animate-out data-exiting:overflow-hidden",
					"z-50 w-(--trigger-width) min-w-32 origin-(--trigger-anchor-point)",
					"overflow-y-auto overflow-x-hidden rounded-lg bg-popover p-1 text-popover-foreground",
					"shadow-md outline-none ring-1 ring-foreground/10 duration-100",
					"**:data-[slot$=-item]:data-focused:bg-foreground/10",
				],
				className,
			)}
		>
			<MenuPrimitive
				className="max-h-[inherit] overflow-y-auto overflow-x-hidden outline-hidden"
				{...props}
			>
				{children}
			</MenuPrimitive>
		</PopoverPrimitive>
	);
};

/** Props for the {@link DropdownMenuGroup} component. */
export type DropdownMenuGroupProps = Omit<
	MenuSectionPrimitiveProps<object>,
	"children"
> & {
	children?: React.ReactNode;
};

/** A semantic group of related {@link DropdownMenuItem} elements. */
export const DropdownMenuGroup = ({ ...props }: DropdownMenuGroupProps) => {
	return <MenuSectionPrimitive data-slot="dropdown-menu-group" {...props} />;
};

/** Props for the {@link DropdownMenuLabel} component. */
export type DropdownMenuLabelProps = React.ComponentProps<
	typeof HeaderPrimitive
> & {
	inset?: boolean;
};

/** A heading that labels a {@link DropdownMenuGroup}. */
export const DropdownMenuLabel = ({
	className,
	inset,
	...props
}: DropdownMenuLabelProps) => {
	return (
		<HeaderPrimitive
			data-slot="dropdown-menu-label"
			data-inset={inset}
			className={cn(
				"px-2 py-1.5 text-muted-foreground text-xs data-inset:pl-7.5",
				className,
			)}
			{...props}
		/>
	);
};

const dropdownMenuItemVariants = cva(
	[
		"group/dropdown-menu-item relative flex cursor-default select-none items-center",
		"outline-hidden",
		"data-disabled:pointer-events-none data-disabled:opacity-50",
		"[&_svg]:pointer-events-none [&_svg]:shrink-0",
	],
	{
		variants: {
			selectionMode: {
				none: [
					"min-h-7 gap-2 rounded-md px-2 py-1 text-xs/relaxed",
					"focus:bg-accent focus:text-accent-foreground",
					"not-data-[variant=destructive]:focus:**:text-accent-foreground",
					"data-inset:pl-7.5 data-[variant=destructive]:text-destructive",
					"data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive",
					"data-[variant=destructive]:*:[svg]:text-destructive",
					"dark:data-[variant=destructive]:focus:bg-destructive/20",
					"[&_svg:not([class*='size-'])]:size-3.5",
				],
				single: [
					"min-h-7 gap-2 rounded-md py-1.5 pr-8 pl-2 text-xs",
					"focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground",
					"data-inset:pl-7.5",
					"[&_svg:not([class*='size-'])]:size-3.5",
				],
				multiple: [
					"min-h-7 gap-2 rounded-md py-1.5 pr-8 pl-2 text-xs",
					"focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground",
					"data-inset:pl-7.5",
					"[&_svg:not([class*='size-'])]:size-3.5",
				],
			},
		},
	},
);

/** Props for the {@link DropdownMenuItem} component. */
export type DropdownMenuItemProps = MenuItemPrimitiveProps<object> & {
	inset?: boolean;
	variant?: "default" | "destructive";
};

/** An individual action within a {@link DropdownMenu}. */
export const DropdownMenuItem = ({
	className,
	inset,
	variant = "default",
	children,
	...props
}: DropdownMenuItemProps) => {
	return (
		<MenuItemPrimitive
			data-slot="dropdown-menu-item"
			data-inset={inset}
			data-variant={variant}
			textValue={typeof children === "string" ? children : props.textValue}
			className={composeRenderProps(className, (className, { selectionMode }) =>
				cn(dropdownMenuItemVariants({ selectionMode }), className),
			)}
			{...props}
		>
			{composeRenderProps(
				children,
				(children, { isSelected, selectionMode }) => (
					<>
						{selectionMode !== "none" ? (
							<span
								className="pointer-events-none absolute right-2 flex items-center justify-center"
								data-slot={
									selectionMode === "single"
										? "dropdown-menu-radio-item-indicator"
										: "dropdown-menu-checkbox-item-indicator"
								}
							>
								{isSelected ? <CheckIcon /> : null}
							</span>
						) : null}
						{children}
					</>
				),
			)}
		</MenuItemPrimitive>
	);
};

/** Props for the {@link DropdownMenuSub} component. */
export type DropdownMenuSubProps = React.ComponentProps<
	typeof SubmenuTriggerPrimitive
>;

/** A nested submenu within a {@link DropdownMenu}, pairing a {@link DropdownMenuSubTrigger} with a {@link DropdownMenuSubContent}. */
export const DropdownMenuSub = ({ ...props }: DropdownMenuSubProps) => {
	return <SubmenuTriggerPrimitive data-slot="dropdown-menu-sub" {...props} />;
};

/** Props for the {@link DropdownMenuSubTrigger} component. */
export type DropdownMenuSubTriggerProps = MenuItemPrimitiveProps<object> & {
	inset?: boolean;
};

/** The menu item that opens a {@link DropdownMenuSub}. */
export const DropdownMenuSubTrigger = ({
	className,
	inset,
	children,
	...props
}: DropdownMenuSubTriggerProps) => {
	return (
		<MenuItemPrimitive
			data-slot="dropdown-menu-sub-trigger"
			data-inset={inset}
			textValue={typeof children === "string" ? children : props.textValue}
			className={cn(
				[
					"flex min-h-7 cursor-default select-none items-center gap-2 rounded-md",
					"px-2 py-1 text-xs outline-hidden",
					"focus:bg-accent focus:text-accent-foreground",
					"not-data-[variant=destructive]:focus:**:text-accent-foreground",
					"data-open:bg-accent data-inset:pl-7.5 data-open:text-accent-foreground",
					"[&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				],
				className,
			)}
			{...props}
		>
			{composeRenderProps(children, (children) => (
				<>
					{children}
					<ChevronRightIcon className="ml-auto" />
				</>
			))}
		</MenuItemPrimitive>
	);
};

/** Props for the {@link DropdownMenuSubContent} component. */
export type DropdownMenuSubContentProps = React.ComponentProps<
	typeof DropdownMenu
>;

/** The floating panel of a {@link DropdownMenuSub}, containing nested {@link DropdownMenuItem} elements. */
export const DropdownMenuSubContent = ({
	placement = "end top",
	crossOffset = -3,
	offset = 0,
	className,
	...props
}: DropdownMenuSubContentProps) => {
	return (
		<DropdownMenu
			data-slot="dropdown-menu-sub-content"
			className={cn(
				[
					"w-auto min-w-32 rounded-lg bg-popover p-1 text-popover-foreground",
					"shadow-md ring-1 ring-foreground/10 duration-100",
				],
				className,
			)}
			placement={placement}
			crossOffset={crossOffset}
			offset={offset}
			{...props}
		/>
	);
};

/** Props for the {@link DropdownMenuSeparator} component. */
export type DropdownMenuSeparatorProps = React.ComponentProps<
	typeof SeparatorPrimitive
>;

/** A divider between {@link DropdownMenuItem} elements or groups. */
export const DropdownMenuSeparator = ({
	className,
	...props
}: DropdownMenuSeparatorProps) => {
	return (
		<SeparatorPrimitive
			data-slot="dropdown-menu-separator"
			className={cn("-mx-1 my-1 h-px bg-border/50", className)}
			{...props}
		/>
	);
};

/** Props for the {@link DropdownMenuShortcut} component. */
export type DropdownMenuShortcutProps = React.ComponentProps<"span">;

/** A keyboard shortcut hint aligned to the end of a {@link DropdownMenuItem}. */
export const DropdownMenuShortcut = ({
	className,
	...props
}: DropdownMenuShortcutProps) => {
	return (
		<span
			data-slot="dropdown-menu-shortcut"
			className={cn(
				[
					"ml-auto text-[0.625rem] text-muted-foreground tracking-widest",
					"group-focus/dropdown-menu-item:text-accent-foreground",
				],
				className,
			)}
			{...props}
		/>
	);
};
