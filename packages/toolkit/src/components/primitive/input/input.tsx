"use client";

import type * as React from "react";
import { Input as AriaInput, composeRenderProps } from "react-aria-components";
import { cn } from "#lib/utils";
import { inputVariants } from "./styles";

/** Props for the {@link Input} component. */
export type InputProps = React.ComponentProps<typeof AriaInput>;

/**
 * Shared control surface styles for text inputs, reused by {@link Input} and
 * other input primitives (such as {@link Textarea}) to avoid duplicated styling.
 */
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
						"file:text-xs/relaxed file:text-foreground",
						"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
					],
					className,
				),
			)}
			{...props}
		/>
	);
};
