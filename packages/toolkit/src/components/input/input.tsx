"use client";

import { cva } from "class-variance-authority";
import type * as React from "react";
import { Input as AriaInput, composeRenderProps } from "react-aria-components";
import { cn } from "#lib/utils";

/** Props for the {@link Input} component. */
export type InputProps = React.ComponentProps<typeof AriaInput>;

/**
 * Shared control surface styles for text inputs, reused by {@link Input} and
 * other input primitives (such as {@link Textarea}) to avoid duplicated styling.
 */
export const inputVariants = cva([
	"w-full rounded-md border border-input bg-input/20 px-2 outline-none transition-colors",
	"text-sm placeholder:text-muted-foreground",
	"focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
	"aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
	"md:text-xs/relaxed",
	"dark:bg-input/30 dark:aria-invalid:border-destructive/50",
	"dark:aria-invalid:ring-destructive/40",
]);

/** A single-line text input for user-entered values, typically used inside a {@link Field}. */
export const Input = ({ className, type, ...props }: InputProps) => {
	return (
		<AriaInput
			type={type}
			data-slot="input"
			className={composeRenderProps(className, (className) =>
				cn(
					[
						inputVariants(),
						"h-7 min-w-0 py-0.5",
						"file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium",
						"file:text-foreground file:text-xs/relaxed",
						"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
					],
					className,
				),
			)}
			{...props}
		/>
	);
};
