import {
	FieldError as AriaFieldError,
	type FieldErrorProps as AriaFieldErrorProps,
	composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const fieldErrorVariants = tv({
	base: ["block text-red-500 text-sm", "data-[disabled]:opacity-50"],
});

export interface FieldErrorProps extends AriaFieldErrorProps {}

export const FieldError = (props: FieldErrorProps) => (
	<AriaFieldError
		data-slot="field-error"
		{...props}
		className={composeRenderProps(props.className, (className) =>
			fieldErrorVariants({ className }),
		)}
	/>
);
