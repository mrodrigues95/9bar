import { useForm } from "@tanstack/react-form";
import type { FormEvent, ReactNode } from "react";
import {
	Form as AriaForm,
	type FormProps as AriaFormProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const formVariants = tv({
	base: "space-y-6",
});

export interface FormProps<TFormData>
	extends Omit<AriaFormProps, "children" | "onSubmit"> {
	children?: ReactNode | ((form: unknown) => ReactNode);
	onSubmit?: (values: TFormData) => void | Promise<void>;
	onFormSubmit?: (event: FormEvent<HTMLFormElement>) => void;
	defaultValues?: TFormData;
}

export const Form = <TFormData extends Record<string, unknown>>({
	children,
	onSubmit,
	onFormSubmit,
	defaultValues,
	...props
}: FormProps<TFormData>) => {
	const form = useForm({
		...(defaultValues && { defaultValues }),
		onSubmit: async ({ value }: { value: TFormData }) => {
			if (onSubmit) {
				await onSubmit(value);
			}
		},
	});

	return (
		<AriaForm
			{...props}
			className={formVariants({ className: props.className })}
			onSubmit={(e) => {
				if (onFormSubmit) {
					onFormSubmit(e);
				} else {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}
			}}
		>
			{typeof children === "function" ? children(form) : children}
		</AriaForm>
	);
};
