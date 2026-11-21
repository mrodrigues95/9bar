import type * as React from "react";
import { Popover as AriaPopover, DialogTrigger, Heading } from "react-aria-components";
import type { PopoverProps as AriaPopoverProps, DialogTriggerProps } from "react-aria-components";
import { cn, composeTailwindRenderProps } from "#lib/utils";
import { popoverVariants } from "./styles";

/** Props for the {@link PopoverTrigger} component. */
export type PopoverTriggerProps = DialogTriggerProps;

/** The trigger that opens the {@link Popover} content, wrapping the element that receives the interaction. */
export const PopoverTrigger = ({ children, ...props }: PopoverTriggerProps) => (
	<DialogTrigger data-slot="popover-trigger" {...props}>
		{children}
	</DialogTrigger>
);

/** Props for the {@link Popover} component. */
export type PopoverProps = AriaPopoverProps;

/** A floating overlay anchored to a {@link PopoverTrigger}, containing {@link PopoverHeader} and arbitrary content. */
export const Popover = ({
	className,
	placement = "bottom",
	offset = 4,
	crossOffset = 0,
	...props
}: PopoverProps) => (
	<AriaPopover
		data-slot="popover-content"
		placement={placement}
		offset={offset}
		crossOffset={crossOffset}
		className={composeTailwindRenderProps(className, [
			popoverVariants(),
			"flex w-72 flex-col gap-4 p-2.5 text-xs",
		])}
		{...props}
	/>
);

/** Props for the {@link PopoverHeader} component. */
export type PopoverHeaderProps = React.ComponentProps<"div">;

/** The header section of a {@link Popover}, containing its {@link PopoverTitle} and {@link PopoverDescription}. */
export const PopoverHeader = ({ className, ...props }: PopoverHeaderProps) => (
	<div
		data-slot="popover-header"
		className={cn("flex flex-col gap-1 text-xs", className)}
		{...props}
	/>
);

/** Props for the {@link PopoverTitle} component. */
export type PopoverTitleProps = React.ComponentProps<typeof Heading>;

/** A short heading for a {@link Popover}. */
export const PopoverTitle = ({ className, ...props }: PopoverTitleProps) => (
	<Heading data-slot="popover-title" className={cn("text-sm font-medium", className)} {...props} />
);

/** Props for the {@link PopoverDescription} component. */
export type PopoverDescriptionProps = React.ComponentProps<"div">;

/** Supporting text that explains a {@link Popover}'s purpose or content. */
export const PopoverDescription = ({ className, ...props }: PopoverDescriptionProps) => (
	<div
		data-slot="popover-description"
		className={cn("text-muted-foreground", className)}
		{...props}
	/>
);
