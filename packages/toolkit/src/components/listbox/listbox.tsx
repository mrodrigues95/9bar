import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
	Header as AriaHeader,
	ListBox as AriaListBox,
	ListBoxItem as AriaListBoxItem,
	type ListBoxItemProps as AriaListBoxItemProps,
	type ListBoxProps as AriaListBoxProps,
	ListBoxSection as AriaListBoxSection,
	type ListBoxSectionProps as AriaListBoxSectionProps,
	Collection,
	composeRenderProps,
} from "react-aria-components";
import { cn, composeTailwindRenderProps } from "../../utils";
import { Separator, type SeparatorProps } from "../separator/separator";

export interface ListboxProps<T extends object>
	extends Omit<AriaListBoxProps<T>, "layout" | "orientation"> {}

/** A list of options that allows single or multiple selection. */
export const Listbox = <T extends object>({
	children,
	...props
}: ListboxProps<T>) => {
	return (
		<AriaListBox
			data-slot="listbox"
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				"relative h-full overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-xs outline-0",
			)}
		>
			{children}
		</AriaListBox>
	);
};

export const listboxItemVariants = cva(
	[
		"group relative flex min-h-7 w-full cursor-default select-none items-center gap-2",
		"rounded-md py-1 pr-8 pl-2 text-xs/relaxed outline-hidden",
		"[&[href]]:cursor-pointer",
		"hover:bg-foreground/10",
		"focus:bg-foreground/10 focus:text-accent-foreground",
		"not-data-[variant=destructive]:focus:**:text-accent-foreground",
		"data-focused:bg-foreground/10 data-focused:text-accent-foreground",
		"data-disabled:pointer-events-none data-disabled:opacity-50",
		"data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive",
		"dark:data-[variant=destructive]:focus:bg-destructive/20",
		"data-[variant=destructive]:*:[svg]:text-destructive",
		"[&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	],
	{
		variants: {
			variant: {
				default: [],
				danger: ["text-destructive"],
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface ListboxItemProps<T extends object>
	extends AriaListBoxItemProps<T>,
		VariantProps<typeof listboxItemVariants> {
	/** Content rendered before the item label, such as an icon. */
	startContent?: ReactNode;
}

/** An individual option within a {@link Listbox}. */
export const ListboxItem = <T extends object>({
	variant = "default",
	startContent,
	...props
}: ListboxItemProps<T>) => {
	const textValue =
		props.textValue ||
		(typeof props.children === "string" ? props.children : undefined);

	return (
		<AriaListBoxItem
			data-slot="listbox-item"
			data-variant={variant}
			{...props}
			{...(textValue ? { textValue } : {})}
			className={composeRenderProps(props.className, (className, renderProps) =>
				cn(listboxItemVariants({ ...renderProps, variant, className })),
			)}
		>
			{composeRenderProps(props.children, (children, { isSelected }) => (
				<>
					{startContent}
					<div className="flex flex-1 flex-col justify-center truncate group-selected:font-medium">
						{children}
					</div>
					<span className="pointer-events-none absolute right-2 flex items-center justify-center">
						{isSelected ? <Check /> : null}
					</span>
				</>
			))}
		</AriaListBoxItem>
	);
};

export interface ListboxSectionProps<T extends object>
	extends AriaListBoxSectionProps<T> {
	/** A header element rendered above the section items. */
	title?: ReactNode;
}

/** A semantic group of related {@link ListboxItem} elements within a {@link Listbox}. */
export const ListboxSection = <T extends object>({
	title,
	items,
	children,
	...props
}: ListboxSectionProps<T>) => {
	return (
		<AriaListBoxSection data-slot="listbox-section" {...props}>
			{title}
			<Collection items={items ?? []}>{children}</Collection>
		</AriaListBoxSection>
	);
};

export interface ListboxSectionHeaderProps extends ComponentProps<"header"> {
	/** The text label displayed for this section. */
	title: string;
}

/** A styled header rendered above a {@link ListboxSection}. */
export const ListboxSectionHeader = ({
	title,
	...props
}: ListboxSectionHeaderProps) => {
	return (
		<AriaHeader
			data-slot="listbox-section-header"
			{...props}
			className={cn(
				"truncate px-2 py-1.5 text-muted-foreground text-xs",
				props.className,
			)}
		>
			{title}
		</AriaHeader>
	);
};

export interface ListboxSeparatorProps extends SeparatorProps {}

/** A visual divider placed between {@link ListboxSection} elements. */
export const ListboxSeparator = (props: ListboxSeparatorProps) => {
	return (
		<Separator
			data-slot="listbox-separator"
			{...props}
			className={cn(
				"pointer-events-none -mx-1 my-1 bg-border/50",
				props.className,
			)}
		/>
	);
};
