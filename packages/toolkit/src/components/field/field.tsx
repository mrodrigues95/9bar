import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

export const fieldVariants = tv({
	base: ["flex flex-col gap-1", "data-[disabled]:opacity-50"],
});

export interface FieldProps extends ComponentProps<"div"> {}

export const Field = ({ children, className, ...props }: FieldProps) => {
	return (
		<div
			data-slot="field"
			{...props}
			className={fieldVariants({ className })}
		/>
	);
};
