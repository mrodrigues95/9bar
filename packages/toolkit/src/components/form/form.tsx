import {
	Form as AriaForm,
	type FormProps as AriaFormProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const formVariants = tv({
	base: "space-y-4",
});

/** Props for the {@link Form} component. */
export interface FormProps extends AriaFormProps {}

/** A form container that prevents default submission and vertically spaces its child fields. */
export const Form = (props: FormProps) => {
	return (
		<AriaForm
			data-slot="form"
			{...props}
			className={formVariants({ className: props.className })}
			{...(!props.action && {
				onSubmit: (e) => {
					e.preventDefault();
					e.stopPropagation();
					props.onSubmit?.(e);
				},
			})}
		/>
	);
};
