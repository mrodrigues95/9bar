import type { Ref } from "react";
import { Form as AriaForm, type FormProps as AriaFormProps } from "react-aria-components";
import { cn } from "#lib/utils";

/** Props for the {@link Form} component. */
export interface FormProps extends AriaFormProps {
	/** A ref to the underlying `form` element. */
	ref?: Ref<HTMLFormElement>;
}

/** A form container that prevents default submission and vertically spaces its child fields. */
export const Form = (props: FormProps) => {
	return (
		<AriaForm
			data-slot="form"
			{...props}
			className={cn("space-y-4", props.className)}
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
