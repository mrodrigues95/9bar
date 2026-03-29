import {
	FieldError as AriaFieldError,
	type FieldErrorProps as AriaFieldErrorProps,
	composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const fieldErrorVariants = tv({
	base: ["block text-red-500 text-xs"],
});

/** Props for the {@link FieldError} component. */
export interface FieldErrorProps extends AriaFieldErrorProps {}

/** An error message for a form field, displayed when validation fails. */
export const FieldError = (props: FieldErrorProps) => (
	<AriaFieldError
		data-slot="field-error"
		{...props}
		className={composeRenderProps(props.className, (className) =>
			fieldErrorVariants({ className }),
		)}
	/>
);
