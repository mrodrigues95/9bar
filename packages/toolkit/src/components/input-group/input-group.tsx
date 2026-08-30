"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Group, type GroupProps } from "react-aria-components";
import { Button } from "#components/button";
import { Input } from "#components/input";
import { SelectTrigger } from "#components/select";
import { Textarea } from "#components/textarea";
import { cn } from "#lib/utils";

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
					"border border-input bg-input/20 outline-none transition-colors",
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

const inputGroupAddonVariants = cva(
	[
		"flex h-auto cursor-text select-none items-center justify-center gap-1 py-2",
		"font-medium text-muted-foreground text-xs/relaxed",
		"**:data-[slot=kbd]:rounded-[calc(var(--radius-sm)-2px)]",
		"**:data-[slot=kbd]:bg-muted-foreground/10 **:data-[slot=kbd]:px-1",
		"**:data-[slot=kbd]:text-[0.625rem]",
		"group-data-[disabled=true]/input-group:opacity-50",
		"[&>svg:not([class*='size-'])]:size-3.5",
	],
	{
		variants: {
			align: {
				"inline-start":
					"order-first pl-2 has-[>button]:ml-[-0.275rem] has-[>kbd]:ml-[-0.275rem]",
				"inline-end":
					"order-last pr-2 has-[>button]:mr-[-0.275rem] has-[>kbd]:mr-[-0.275rem]",
				"block-start": [
					"order-first w-full justify-start px-2 pt-2 group-has-[>input]/input-group:pt-2",
					"[.border-b]:pb-2",
				],
				"block-end": [
					"order-last w-full justify-start px-2 pb-2 group-has-[>input]/input-group:pb-2",
					"[.border-t]:pt-2",
				],
			},
		},
		defaultVariants: {
			align: "inline-start",
		},
	},
);

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

/** Variants for compact controls rendered inside an {@link InputGroup}. Shared by {@link InputGroupButton} and {@link InputGroupSelectTrigger}. */
export const inputGroupButtonVariants = cva(
	"flex items-center gap-2 text-xs/relaxed shadow-none",
	{
		variants: {
			size: {
				xs: "h-5 gap-1 rounded-[calc(var(--radius-sm)-2px)] px-1 [&>svg:not([class*='size-'])]:size-3",
				sm: "gap-1",
				"icon-xs": "size-6 p-0 has-[>svg]:p-0",
				"icon-sm": "size-7 p-0 has-[>svg]:p-0",
			},
		},
		defaultVariants: {
			size: "xs",
		},
	},
);

/** Props for the {@link InputGroupButton} component. */
export type InputGroupButtonProps = Omit<
	React.ComponentProps<typeof Button>,
	"size" | "type"
> &
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
export const InputGroupText = ({
	className,
	...props
}: InputGroupTextProps) => {
	return (
		<span
			className={cn(
				[
					"flex items-center gap-2 text-muted-foreground text-xs/relaxed",
					"[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
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
export const InputGroupInput = ({
	className,
	...props
}: InputGroupInputProps) => {
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
export const InputGroupTextarea = ({
	className,
	...props
}: InputGroupTextareaProps) => {
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
