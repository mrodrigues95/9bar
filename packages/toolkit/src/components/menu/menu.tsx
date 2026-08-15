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

/** Props for the {@link MenuTrigger} component. */
export type MenuTriggerProps = React.ComponentProps<
	typeof MenuTriggerPrimitive
>;

/** The trigger that opens the {@link Menu}, wrapping the element that receives the interaction. */
export const MenuTrigger = ({ ...props }: MenuTriggerProps) => {
	return <MenuTriggerPrimitive data-slot="menu-trigger" {...props} />;
};

/** Props for the {@link Menu} component. */
export type MenuProps<T extends object> = Omit<
	React.ComponentProps<typeof MenuPrimitive<T>>,
	"className"
> &
	Pick<
		React.ComponentProps<typeof PopoverPrimitive>,
		"placement" | "offset" | "crossOffset"
	> & {
		"data-slot"?: string;
		className?: string;
	};

/** A menu of actions displayed in a floating popover. Compose {@link MenuItem}, {@link MenuSub}, and {@link MenuSeparator}. */
export const Menu = <T extends object>({
	"data-slot": dataSlot = "menu-content",
	placement = "bottom start",
	offset = 4,
	crossOffset = 0,
	className,
	children,
	...props
}: MenuProps<T>) => {
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
			<MenuPrimitive<T>
				className="max-h-[inherit] overflow-y-auto overflow-x-hidden outline-hidden"
				{...props}
			>
				{children}
			</MenuPrimitive>
		</PopoverPrimitive>
	);
};

/** Props for the {@link MenuGroup} component. */
export type MenuGroupProps<T extends object> = MenuSectionPrimitiveProps<T>;

/** A semantic group of related {@link MenuItem} elements. */
export const MenuGroup = <T extends object>({
	...props
}: MenuGroupProps<T>) => {
	return <MenuSectionPrimitive<T> data-slot="menu-group" {...props} />;
};

/** Props for the {@link MenuLabel} component. */
export type MenuLabelProps = React.ComponentProps<typeof HeaderPrimitive> & {
	inset?: boolean;
};

/** A heading that labels a {@link MenuGroup}. */
export const MenuLabel = ({ className, inset, ...props }: MenuLabelProps) => {
	return (
		<HeaderPrimitive
			data-slot="menu-label"
			data-inset={inset}
			className={cn(
				"px-2 py-1.5 text-muted-foreground text-xs data-inset:pl-7.5",
				className,
			)}
			{...props}
		/>
	);
};

const menuItemVariants = cva(
	[
		"group/menu-item relative flex cursor-default select-none items-center",
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

/** Props for the {@link MenuItem} component. */
export type MenuItemProps<T extends object> = MenuItemPrimitiveProps<T> & {
	inset?: boolean;
	variant?: "default" | "destructive";
};

/** An individual action within a {@link Menu}. */
export const MenuItem = <T extends object>({
	className,
	inset,
	variant = "default",
	children,
	...props
}: MenuItemProps<T>) => {
	return (
		<MenuItemPrimitive
			data-slot="menu-item"
			data-inset={inset}
			data-variant={variant}
			textValue={typeof children === "string" ? children : props.textValue}
			className={composeRenderProps(className, (className, { selectionMode }) =>
				cn(menuItemVariants({ selectionMode }), className),
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
										? "menu-radio-item-indicator"
										: "menu-checkbox-item-indicator"
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

/** Props for the {@link MenuSub} component. */
export type MenuSubProps = React.ComponentProps<typeof SubmenuTriggerPrimitive>;

/** A nested submenu within a {@link Menu}, pairing a {@link MenuSubTrigger} with a {@link MenuSubContent}. */
export const MenuSub = ({ ...props }: MenuSubProps) => {
	return <SubmenuTriggerPrimitive data-slot="menu-sub" {...props} />;
};

/** Props for the {@link MenuSubTrigger} component. */
export type MenuSubTriggerProps<T extends object> =
	MenuItemPrimitiveProps<T> & {
		inset?: boolean;
	};

/** The menu item that opens a {@link MenuSub}. */
export const MenuSubTrigger = <T extends object>({
	className,
	inset,
	children,
	...props
}: MenuSubTriggerProps<T>) => {
	return (
		<MenuItemPrimitive
			data-slot="menu-sub-trigger"
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

/** Props for the {@link MenuSubContent} component. */
export type MenuSubContentProps<T extends object> = MenuProps<T>;

/** The floating panel of a {@link MenuSub}, containing nested {@link MenuItem} elements. */
export const MenuSubContent = <T extends object>({
	placement = "end top",
	crossOffset = -3,
	offset = 0,
	className,
	...props
}: MenuSubContentProps<T>) => {
	return (
		<Menu<T>
			data-slot="menu-sub-content"
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

/** Props for the {@link MenuSeparator} component. */
export type MenuSeparatorProps = React.ComponentProps<
	typeof SeparatorPrimitive
>;

/** A divider between {@link MenuItem} elements or groups. */
export const MenuSeparator = ({ className, ...props }: MenuSeparatorProps) => {
	return (
		<SeparatorPrimitive
			data-slot="menu-separator"
			className={cn("-mx-1 my-1 h-px bg-border/50", className)}
			{...props}
		/>
	);
};

/** Props for the {@link MenuShortcut} component. */
export type MenuShortcutProps = React.ComponentProps<"span">;

/** A keyboard shortcut hint aligned to the end of a {@link MenuItem}. */
export const MenuShortcut = ({ className, ...props }: MenuShortcutProps) => {
	return (
		<span
			data-slot="menu-shortcut"
			className={cn(
				[
					"ml-auto text-[0.625rem] text-muted-foreground tracking-widest",
					"group-focus/menu-item:text-accent-foreground",
				],
				className,
			)}
			{...props}
		/>
	);
};
