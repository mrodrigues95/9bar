"use client";

import type * as React from "react";
import {
	TextArea as AriaTextarea,
	composeRenderProps,
} from "react-aria-components";
import { inputVariants } from "#components/input";
import { cn } from "#lib/utils";

/** Props for the {@link Textarea} component. */
export type TextareaProps = React.ComponentProps<typeof AriaTextarea>;

/** A multi-line text input for longer user-entered values, typically used inside a {@link Field}. */
export const Textarea = ({ className, ...props }: TextareaProps) => {
	return (
		<AriaTextarea
			data-slot="textarea"
			className={composeRenderProps(className, (className) =>
				cn(
					[
						inputVariants(),
						"field-sizing-content flex min-h-16 resize-none py-2",
						"disabled:cursor-not-allowed disabled:opacity-50",
					],
					className,
				),
			)}
			{...props}
		/>
	);
};
