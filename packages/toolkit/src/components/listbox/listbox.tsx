import { CheckIcon } from "@heroicons/react/24/solid";
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
import { cn, tv, type VariantProps } from "tailwind-variants";
import { composeTailwindRenderProps } from "../../utils/classes";
import { Separator, type SeparatorProps } from "../separator/separator";

export interface ListboxProps<T>
	extends Omit<AriaListBoxProps<T>, "layout" | "orientation"> {}

export const ListBox = <T extends object>({
	children,
	...props
}: ListboxProps<T>) => {
	return (
		<AriaListBox
			data-slot="listbox"
			{...props}
			className={composeTailwindRenderProps(
				props.className,
				"relative h-full overflow-y-auto rounded-lg border border-border bg-white p-1 shadow-xs outline-0",
			)}
		>
			{children}
		</AriaListBox>
	);
};

export const listboxItemVariants = tv({
	base: [
		"group flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 font-normal text-sm outline-none [&[href]]:cursor-pointer",
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

export interface ListboxItemProps
	extends AriaListBoxItemProps,
		VariantProps<typeof listboxItemVariants> {
	startContent?: ReactNode;
}

export const ListboxItem = ({
	variant,
	startContent,
	...props
}: ListboxItemProps) => {
	const textValue =
		props.textValue ||
		(typeof props.children === "string" ? props.children : undefined);

	return (
		<AriaListBoxItem
			data-slot="listbox-item"
			{...props}
			{...(textValue ? { textValue } : {})}
			className={composeRenderProps(props.className, (className, renderProps) =>
				listboxItemVariants({ ...renderProps, variant, className }),
			)}
		>
			{composeRenderProps(props.children, (children, { isSelected }) => (
				<>
					{startContent}
					<div className="flex flex-1 flex-col justify-center truncate text-primary group-selected:font-medium">
						{children}
					</div>
					{isSelected && <CheckIcon className="size-3.5" />}
				</>
			))}
		</AriaListBoxItem>
	);
};

export interface ListboxSectionProps<T> extends AriaListBoxSectionProps<T> {
	title?: ReactNode;
}

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
	title: string;
}

export const ListboxSectionHeader = ({
	title,
	...props
}: ListboxSectionHeaderProps) => {
	return (
		<AriaHeader
			data-slot="listbox-section-header"
			{...props}
			className={cn(
				"truncate px-2 py-1.5 font-medium text-muted text-xs",
				props.className,
			)}
		>
			{title}
		</AriaHeader>
	);
};

export interface ListboxSeparatorProps extends SeparatorProps {}

export const ListboxSeparator = (props: ListboxSeparatorProps) => {
	return (
		<Separator
			data-slot="listbox-separator"
			variant="middle"
			{...props}
			className={cn("mx-2 my-1", props.className) ?? ""}
		/>
	);
};
