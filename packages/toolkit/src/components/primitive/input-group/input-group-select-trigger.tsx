"use client";

import { type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { SelectTrigger } from "#components/select";
import { composeTailwindRenderProps } from "#lib/utils";
import { inputGroupButtonVariants } from "./styles";

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
			className={composeTailwindRenderProps(className, [
				inputGroupButtonVariants({ size }),
				"bg-transparent",
				"dark:bg-transparent",
			])}
			{...props}
		/>
	);
};
