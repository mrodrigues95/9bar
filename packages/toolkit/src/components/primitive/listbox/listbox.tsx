import type { VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
	Header as AriaHeader,
	ListBox as AriaListBox,
	ListBoxItem as AriaListBoxItem,
	ListBoxSection as AriaListBoxSection,
	Collection,
	composeRenderProps,
} from "react-aria-components";
import type {
	ListBoxItemProps as AriaListBoxItemProps,
	ListBoxProps as AriaListBoxProps,
	ListBoxSectionProps as AriaListBoxSectionProps,
} from "react-aria-components";
import { cn, composeTailwindRenderProps, resolveItemTextValue } from "../../../utils";
import type { ItemLabelProps } from "../../../utils";
import { Separator } from "../separator/separator";
import type { SeparatorProps } from "../separator/separator";
import { listboxItemVariants, listboxSectionHeaderVariants } from "./styles";

/** Props for the {@link Listbox} component. */
export type ListboxProps<T extends object> = Omit<AriaListBoxProps<T>, "layout" | "orientation">;

/** A list of options that allows single or multiple selection. */
export const Listbox = <T extends object>({ children, ...props }: ListboxProps<T>) => (
	<AriaListBox
		data-slot="listbox"
		{...props}
		className={composeTailwindRenderProps(props.className, [
			"relative h-full overflow-y-auto rounded-lg border border-border bg-popover p-1",
			"text-popover-foreground shadow-xs outline-0",
		])}
	>
		{children}
	</AriaListBox>
);

/** Props for the {@link ListboxItem} component. */
export type ListboxItemProps<T extends object> = Omit<
	AriaListBoxItemProps<T>,
	"children" | "textValue"
> &
	VariantProps<typeof listboxItemVariants> & {
		/** Content rendered before the item label, such as an icon. */
		startContent?: ReactNode;
	} & ItemLabelProps<AriaListBoxItemProps<T>["children"]>;

/** An individual option within a {@link Listbox}. */
export const ListboxItem = <T extends object>({
	variant = "default",
	startContent,
	children,
	...props
}: ListboxItemProps<T>) => {
	const textValue = resolveItemTextValue(children, props.textValue);

	return (
		<AriaListBoxItem
			data-slot="listbox-item"
			data-variant={variant}
			{...props}
			textValue={textValue}
			className={composeRenderProps(props.className, (className, renderProps) =>
				cn(listboxItemVariants({ ...renderProps, variant, className })),
			)}
		>
			{composeRenderProps(children, (children, { isSelected }) => (
				<>
					{startContent}
					<div className="group-selected:font-medium flex flex-1 flex-col justify-center truncate">
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

/** Props for the {@link ListboxSection} component. */
export interface ListboxSectionProps<T extends object> extends AriaListBoxSectionProps<T> {
	/** A header element rendered above the section items. */
	title?: ReactNode;
}

/** A semantic group of related {@link ListboxItem} elements within a {@link Listbox}. */
export const ListboxSection = <T extends object>({
	title,
	items,
	children,
	...props
}: ListboxSectionProps<T>) => (
	<AriaListBoxSection data-slot="listbox-section" {...props}>
		{title}
		<Collection items={items ?? []}>{children}</Collection>
	</AriaListBoxSection>
);

/** Props for the {@link ListboxSectionHeader} component. */
export interface ListboxSectionHeaderProps extends ComponentProps<"header"> {
	/** The text label displayed for this section. */
	title: string;
}

/** A styled header rendered above a {@link ListboxSection}. */
export const ListboxSectionHeader = ({ title, ...props }: ListboxSectionHeaderProps) => (
	<AriaHeader
		data-slot="listbox-section-header"
		{...props}
		className={cn(listboxSectionHeaderVariants(), "truncate", props.className)}
	>
		{title}
	</AriaHeader>
);

/** Props for the {@link ListboxSeparator} component. */
export type ListboxSeparatorProps = Omit<SeparatorProps, "render">;

/** A visual divider placed between {@link ListboxSection} elements. Rendered as a presentational element because a `separator` role is not permitted inside a listbox. */
export const ListboxSeparator = ({ className, ...props }: ListboxSeparatorProps) => (
	<Separator
		data-slot="listbox-separator"
		{...props}
		className={cn("pointer-events-none my-1 bg-border/50", className)}
		render={(renderProps) => <div {...renderProps} role="presentation" />}
	/>
);
