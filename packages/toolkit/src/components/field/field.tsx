import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

export const fieldVariants = tv({
	base: ["flex flex-col gap-1"],
});

/** Props for the {@link Field} component. */
export interface FieldProps extends ComponentProps<"div"> {}

/** A layout wrapper that vertically stacks a label, input, description, and error message for a form field. */
export const Field = ({ className, ...props }: FieldProps) => {
	return (
		<div
			data-slot="field"
			{...props}
			className={fieldVariants({ className })}
		/>
	);
};
