import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "#lib/utils";

const alertVariants = cva(
	[
		"group/alert relative grid w-full gap-0.5 rounded-lg border px-2 py-1.5 text-left text-xs/relaxed",
		"has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18",
		"has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-1.5",
		"*:[svg:not([class*='size-'])]:size-3.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current",
	],
	{
		variants: {
			variant: {
				default: "bg-card text-card-foreground",
				destructive: [
					"bg-card text-destructive",
					"*:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
				],
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

/** Props for the {@link Alert} component. */
export type AlertProps = React.ComponentProps<"div"> &
	VariantProps<typeof alertVariants>;

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
export const AlertDescription = ({
	className,
	...props
}: AlertDescriptionProps) => {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				[
					"text-balance text-muted-foreground text-xs/relaxed",
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
