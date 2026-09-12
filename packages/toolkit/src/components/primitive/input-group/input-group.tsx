"use client";

import { type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Group, type GroupProps } from "react-aria-components";
import { Button } from "#components/button";
import { Input } from "#components/input";
import { SelectTrigger } from "#components/select";
import { Textarea } from "#components/textarea";
import { cn } from "#lib/utils";
import { inputGroupAddonVariants, inputGroupButtonVariants } from "./styles";

/** Props for the {@link InputGroup} component. */
export type InputGroupProps = GroupProps;

/** A composite control that groups an input or textarea with addons and buttons, such as a unit selector or search field. */
export const InputGroup = ({ className, ...props }: GroupProps) => {
	return (
		<Group
			data-slot="input-group"
			className={cn(
				[
					"group/input-group relative flex h-7 w-full min-w-0 items-center rounded-md",
					"border border-input bg-input/20 transition-colors outline-none",
					"in-data-[slot=combobox-content]:focus-within:border-inherit",
					"in-data-[slot=combobox-content]:focus-within:ring-0",
					"has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-start]]:h-auto",
					"has-[>textarea]:h-auto",
					"has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:flex-col",
					"has-[textarea]:rounded-md",
					"has-data-[align=block-end]:rounded-md has-data-[align=block-start]:rounded-md",
					"has-[[data-slot=input-group-control]:focus-visible]:border-ring",
					"has-[[data-slot][aria-invalid=true]]:border-destructive",
					"has-[[data-slot=input-group-control]:focus-visible]:ring-2",
					"has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30",
					"has-[[data-slot][aria-invalid=true]]:ring-2",
					"has-[[data-slot][aria-invalid=true]]:ring-destructive/20",
					"dark:bg-input/30 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",
					"has-[>[data-align=block-end]]:[&>input]:pt-3",
					"has-[>[data-align=inline-end]]:[&>input]:pr-1.5",
					"has-[>[data-align=block-start]]:[&>input]:pb-3",
					"has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
				],
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link InputGroupAddon} component. */
export type InputGroupAddonProps = React.ComponentProps<"div"> &
	VariantProps<typeof inputGroupAddonVariants>;

/** A label, icon, or button placed at the edge of an {@link InputGroup}. */
export const InputGroupAddon = ({
	className,
	align = "inline-start",
	...props
}: InputGroupAddonProps) => {
	return (
		<div
			data-slot="input-group-addon"
			data-align={align}
			className={cn(inputGroupAddonVariants({ align }), className)}
			{...props}
		/>
	);
};

/** Props for the {@link InputGroupButton} component. */
export type InputGroupButtonProps = Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
	VariantProps<typeof inputGroupButtonVariants> & {
		type?: "button" | "submit" | "reset";
	};

/** A compact button rendered as an {@link InputGroupAddon}. */
export const InputGroupButton = ({
	className,
	type = "button",
	variant = "ghost",
	size = "xs",
	...props
}: InputGroupButtonProps) => {
	return (
		<Button
			type={type}
			data-size={size}
			variant={variant}
			className={cn(inputGroupButtonVariants({ size }), className)}
			{...props}
		/>
	);
};

/** Props for the {@link InputGroupSelectTrigger} component. */
export type InputGroupSelectTriggerProps = Omit<
	React.ComponentProps<typeof SelectTrigger>,
	"size"
> &
	VariantProps<typeof inputGroupButtonVariants>;

/** A compact select trigger rendered inside an {@link InputGroup}, sharing {@link inputGroupButtonVariants} sizing with {@link InputGroupButton}. */
export const InputGroupSelectTrigger = ({
	className,
	size = "xs",
	variant = "ghost",
	...props
}: InputGroupSelectTriggerProps) => {
	return (
		<SelectTrigger
			variant={variant}
			data-size={size}
			className={cn(
				inputGroupButtonVariants({ size }),
				["bg-transparent", "dark:bg-transparent"],
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link InputGroupText} component. */
export type InputGroupTextProps = React.ComponentProps<"span">;

/** Static text rendered inside an {@link InputGroup}, such as a unit of measure. */
export const InputGroupText = ({ className, ...props }: InputGroupTextProps) => {
	return (
		<span
			className={cn(
				[
					"flex items-center gap-2 text-xs/relaxed text-muted-foreground",
					"[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
				],
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link InputGroupInput} component. */
export type InputGroupInputProps = React.ComponentProps<"input">;

/** The input control embedded in an {@link InputGroup}. */
export const InputGroupInput = ({ className, ...props }: InputGroupInputProps) => {
	return (
		<Input
			data-slot="input-group-control"
			className={cn(
				[
					"flex-1 rounded-none border-0 bg-transparent shadow-none ring-0",
					"focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent",
				],
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link InputGroupTextarea} component. */
export type InputGroupTextareaProps = React.ComponentProps<"textarea">;

/** The textarea control embedded in an {@link InputGroup}. */
export const InputGroupTextarea = ({ className, ...props }: InputGroupTextareaProps) => {
	return (
		<Textarea
			data-slot="input-group-control"
			className={cn(
				[
					"flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0",
					"focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent",
				],
				className,
			)}
			{...props}
		/>
	);
};
