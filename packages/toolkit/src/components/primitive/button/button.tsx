import { type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cn } from "#lib/utils";
import { buttonVariants } from "./styles";

/** Props for the {@link Button} component. */
export type ButtonProps = Omit<AriaButtonProps, "className"> &
	React.RefAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonVariants> & {
		className?: string;
	};

/**
 * A button allows a user to perform an action, with mouse, touch, and keyboard
 * interactions. Use `buttonVariants` with a plain `<a>` tag or the `Link`
 * primitive to render a button-styled link.
 */
export const Button = ({
	className,
	variant = "default",
	size = "default",
	...props
}: ButtonProps) => {
	return (
		<AriaButton
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
};
