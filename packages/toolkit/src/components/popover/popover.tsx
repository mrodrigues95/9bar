import type * as React from "react";
import {
	DialogTrigger,
	type DialogTriggerProps,
	Heading,
	Popover as PopoverPrimitive,
	type PopoverProps as PopoverPrimitiveProps,
} from "react-aria-components";
import { cn } from "#lib/utils";

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
export type PopoverProps = Omit<PopoverPrimitiveProps, "className"> & {
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
		<PopoverPrimitive
			data-slot="popover-content"
			placement={placement}
			offset={offset}
			crossOffset={crossOffset}
			className={cn(
				[
					"data-entering:fade-in-0 data-entering:zoom-in-95",
					"data-exiting:fade-out-0 data-exiting:zoom-out-95",
					"data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2",
					"data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
					"z-50 flex w-72 origin-(--trigger-anchor-point) flex-col gap-4",
					"rounded-lg bg-popover p-2.5 text-popover-foreground text-xs",
					"shadow-md outline-hidden ring-1 ring-foreground/10",
					"duration-100",
					"data-entering:animate-in data-exiting:animate-out",
				],
				className,
			)}
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
			className={cn("font-medium text-sm", className)}
			{...props}
		/>
	);
};

/** Props for the {@link PopoverDescription} component. */
export type PopoverDescriptionProps = React.ComponentProps<"div">;

/** Supporting text that explains a {@link Popover}'s purpose or content. */
export const PopoverDescription = ({
	className,
	...props
}: PopoverDescriptionProps) => {
	return (
		<div
			data-slot="popover-description"
			className={cn("text-muted-foreground", className)}
			{...props}
		/>
	);
};
