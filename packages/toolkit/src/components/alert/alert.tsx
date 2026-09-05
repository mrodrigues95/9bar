import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "#lib/utils";

const alertVariants = cva(
	[
		"group/alert relative grid w-full gap-0.5 rounded-lg border px-2 py-1.5 text-left text-xs/relaxed",
		"has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18",
		"has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-1.5",
		"*:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-3.5",
	],
	{
		variants: {
			variant: {
				default: "border-border bg-card text-card-foreground",
				info: [
					"border-blue-200 bg-blue-50 text-blue-800",
					"*:data-[slot=alert-description]:text-blue-700",
					"dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200",
					"dark:*:data-[slot=alert-description]:text-blue-300",
				],
				success: [
					"border-green-200 bg-green-50 text-green-800",
					"*:data-[slot=alert-description]:text-green-700",
					"dark:border-green-900 dark:bg-green-950 dark:text-green-200",
					"dark:*:data-[slot=alert-description]:text-green-300",
				],
				warning: [
					"border-yellow-200 bg-yellow-50 text-yellow-800",
					"*:data-[slot=alert-description]:text-yellow-700",
					"dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-200",
					"dark:*:data-[slot=alert-description]:text-yellow-300",
				],
				destructive: [
					"border-red-200 bg-red-50 text-red-800",
					"*:data-[slot=alert-description]:text-red-700",
					"dark:border-red-900 dark:bg-red-950 dark:text-red-200",
					"dark:*:data-[slot=alert-description]:text-red-300",
				],
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

/** Props for the {@link Alert} component. */
export type AlertProps = React.ComponentProps<"div"> & VariantProps<typeof alertVariants>;

/** An alert displays a brief, important message in a way that attracts the user's attention without interrupting their task. Combine with {@link AlertTitle} and {@link AlertDescription}. */
export const Alert = ({ className, variant, ...props }: AlertProps) => {
	return (
		<div
			data-slot="alert"
			role="alert"
			className={cn(alertVariants({ variant }), className)}
			{...props}
		/>
	);
};

/** Props for the {@link AlertTitle} component. */
export type AlertTitleProps = React.ComponentProps<"div">;

/** A short heading that labels the {@link Alert}. */
export const AlertTitle = ({ className, ...props }: AlertTitleProps) => {
	return (
		<div
			data-slot="alert-title"
			className={cn(
				[
					"font-medium group-has-[>svg]/alert:col-start-2",
					"[&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
				],
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link AlertDescription} component. */
export type AlertDescriptionProps = React.ComponentProps<"div">;

/** Supplementary text that provides additional context for the {@link Alert}. */
export const AlertDescription = ({ className, ...props }: AlertDescriptionProps) => {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				[
					"text-xs/relaxed text-balance text-muted-foreground",
					"md:text-pretty",
					"[&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
					"[&_p:not(:last-child)]:mb-4",
				],
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link AlertAction} component. */
export type AlertActionProps = React.ComponentProps<"div">;

/** A container for interactive elements (such as a dismiss button) placed at the end of an {@link Alert}. */
export const AlertAction = ({ className, ...props }: AlertActionProps) => {
	return (
		<div
			data-slot="alert-action"
			className={cn("absolute top-1.5 right-2", className)}
			{...props}
		/>
	);
};
