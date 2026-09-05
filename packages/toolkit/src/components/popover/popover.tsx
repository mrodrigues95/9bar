import { cva } from "class-variance-authority";
import type * as React from "react";
import {
	Popover as AriaPopover,
	type PopoverProps as AriaPopoverProps,
	DialogTrigger,
	type DialogTriggerProps,
	Heading,
} from "react-aria-components";
import { cn } from "#lib/utils";

/**
 * Shared surface styles for popovers, reused by {@link Popover} and other
 * overlay primitives (such as select and menu) to avoid duplicated styling.
 */
export const popoverVariants = cva([
	"data-entering:fade-in-0 data-entering:zoom-in-95",
	"data-exiting:fade-out-0 data-exiting:zoom-out-95",
	"data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2",
	"data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
	"data-entering:animate-in data-exiting:animate-out",
	"z-50 origin-(--trigger-anchor-point)",
	"rounded-lg bg-popover text-popover-foreground",
	"shadow-md ring-1 ring-foreground/10 outline-hidden",
	"duration-100",
]);

/** Props for the {@link PopoverTrigger} component. */
export type PopoverTriggerProps = DialogTriggerProps;

/** The trigger that opens the {@link Popover} content, wrapping the element that receives the interaction. */
export const PopoverTrigger = ({ children, ...props }: PopoverTriggerProps) => {
	return (
		<DialogTrigger data-slot="popover-trigger" {...props}>
			{children}
		</DialogTrigger>
	);
};

/** Props for the {@link Popover} component. */
export type PopoverProps = Omit<AriaPopoverProps, "className"> & {
	className?: string;
};

/** A floating overlay anchored to a {@link PopoverTrigger}, containing {@link PopoverHeader} and arbitrary content. */
export const Popover = ({
	className,
	placement = "bottom",
	offset = 4,
	crossOffset = 0,
	...props
}: PopoverProps) => {
	return (
		<AriaPopover
			data-slot="popover-content"
			placement={placement}
			offset={offset}
			crossOffset={crossOffset}
			className={cn(popoverVariants(), "flex w-72 flex-col gap-4 p-2.5 text-xs", className)}
			{...props}
		/>
	);
};

/** Props for the {@link PopoverHeader} component. */
export type PopoverHeaderProps = React.ComponentProps<"div">;

/** The header section of a {@link Popover}, containing its {@link PopoverTitle} and {@link PopoverDescription}. */
export const PopoverHeader = ({ className, ...props }: PopoverHeaderProps) => {
	return (
		<div
			data-slot="popover-header"
			className={cn("flex flex-col gap-1 text-xs", className)}
			{...props}
		/>
	);
};

/** Props for the {@link PopoverTitle} component. */
export type PopoverTitleProps = React.ComponentProps<typeof Heading>;

/** A short heading for a {@link Popover}. */
export const PopoverTitle = ({ className, ...props }: PopoverTitleProps) => {
	return (
		<Heading
			data-slot="popover-title"
			className={cn("text-sm font-medium", className)}
			{...props}
		/>
	);
};

/** Props for the {@link PopoverDescription} component. */
export type PopoverDescriptionProps = React.ComponentProps<"div">;

/** Supporting text that explains a {@link Popover}'s purpose or content. */
export const PopoverDescription = ({ className, ...props }: PopoverDescriptionProps) => {
	return (
		<div
			data-slot="popover-description"
			className={cn("text-muted-foreground", className)}
			{...props}
		/>
	);
};
