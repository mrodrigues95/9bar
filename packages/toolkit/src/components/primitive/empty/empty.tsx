import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "#lib/utils";

/** Props for the {@link Empty} component. */
export type EmptyProps = React.ComponentProps<"div">;

/** A full-width container used for empty states. Combine with {@link EmptyMedia}, {@link EmptyTitle}, and {@link EmptyDescription}. */
export const Empty = ({ className, ...props }: EmptyProps) => {
	return (
		<div
			data-slot="empty"
			className={cn(
				"flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link EmptyHeader} component. */
export type EmptyHeaderProps = React.ComponentProps<"div">;

/** A centered column for the title and description within an {@link Empty} state. */
export const EmptyHeader = ({ className, ...props }: EmptyHeaderProps) => {
	return (
		<div
			data-slot="empty-header"
			className={cn("flex max-w-sm flex-col items-center gap-1", className)}
			{...props}
		/>
	);
};

const emptyMediaVariants = cva(
	[
		"mb-2 flex shrink-0 items-center justify-center",
		"[&_svg]:pointer-events-none [&_svg]:shrink-0",
	],
	{
		variants: {
			variant: {
				default: "bg-transparent",
				icon: [
					"flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground",
					"[&_svg:not([class*='size-'])]:size-4",
				],
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

/** Props for the {@link EmptyMedia} component. */
export type EmptyMediaProps = React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>;

/** The visual (icon or illustration) displayed above an {@link Empty} state. */
export const EmptyMedia = ({ className, variant = "default", ...props }: EmptyMediaProps) => {
	return (
		<div
			data-slot="empty-icon"
			data-variant={variant}
			className={cn(emptyMediaVariants({ variant, className }))}
			{...props}
		/>
	);
};

/** Props for the {@link EmptyTitle} component. */
export type EmptyTitleProps = React.ComponentProps<"div">;

/** A short heading for an {@link Empty} state. */
export const EmptyTitle = ({ className, ...props }: EmptyTitleProps) => {
	return (
		<div
			data-slot="empty-title"
			className={cn("font-heading text-sm font-medium tracking-tight", className)}
			{...props}
		/>
	);
};

/** Props for the {@link EmptyDescription} component. */
export type EmptyDescriptionProps = React.ComponentProps<"p">;

/** Supporting text that explains an {@link Empty} state. */
export const EmptyDescription = ({ className, ...props }: EmptyDescriptionProps) => {
	return (
		<div
			data-slot="empty-description"
			className={cn(
				"text-xs/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link EmptyContent} component. */
export type EmptyContentProps = React.ComponentProps<"div">;

/** A wrapper for arbitrary content (such as actions) within an {@link Empty} state. */
export const EmptyContent = ({ className, ...props }: EmptyContentProps) => {
	return (
		<div
			data-slot="empty-content"
			className={cn(
				"flex w-full max-w-sm min-w-0 flex-col items-center gap-2 text-xs/relaxed text-balance",
				className,
			)}
			{...props}
		/>
	);
};
