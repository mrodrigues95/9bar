import {
	Form as AriaForm,
	type FormProps as AriaFormProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const formVariants = tv({
	base: "space-y-3",
});

export interface FormProps extends AriaFormProps {}

export const Form = (props: FormProps) => {
	return (
		<AriaForm
			{...props}
			className={formVariants({ className: props.className })}
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				props.onSubmit?.(e);
			}}
		/>
	);
};
