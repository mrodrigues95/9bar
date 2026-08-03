"use client";

import type * as React from "react";
import {
	composeRenderProps,
	TextArea as TextareaPrimitive,
} from "react-aria-components";
import { cn } from "#lib/utils";

/** Props for the {@link Textarea} component. */
export type TextareaProps = React.ComponentProps<typeof TextareaPrimitive>;

/** A multi-line text input for longer user-entered values, typically used inside a {@link Field}. */
export const Textarea = ({ className, ...props }: TextareaProps) => {
	return (
		<TextareaPrimitive
			data-slot="textarea"
			className={composeRenderProps(className, (className) =>
				cn(
					[
						"field-sizing-content flex min-h-16 w-full resize-none rounded-md",
						"border border-input bg-input/20 px-2 py-2",
						"text-sm outline-none transition-colors",
						"placeholder:text-muted-foreground",
						"focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
						"disabled:cursor-not-allowed disabled:opacity-50",
						"aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
						"md:text-xs/relaxed",
						"dark:bg-input/30 dark:aria-invalid:border-destructive/50",
						"dark:aria-invalid:ring-destructive/40",
					],
					className,
				),
			)}
			{...props}
		/>
	);
};
