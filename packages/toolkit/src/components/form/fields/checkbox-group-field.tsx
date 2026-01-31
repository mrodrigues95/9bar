import { useStore } from "@tanstack/react-form";
import type { ReactNode } from "react";
import type { ValidationResult } from "react-aria-components";
import {
	CheckboxGroup,
	type CheckboxGroupProps,
} from "../../checkbox-group/checkbox-group";
import { Description, type DescriptionProps } from "../../field/description";
import { FieldError, type FieldErrorProps } from "../../field/field-error";
import { Label, type LabelProps } from "../../field/label";
import { defaultErrorFormatter, type TErrorFormatter } from "../utils/errors";
import { useFieldContext } from "../utils/form-context";

export interface CheckboxGroupFieldProps
	extends Omit<CheckboxGroupProps, "children"> {
	children: ReactNode;
	label: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	labelProps?: LabelProps;
	descriptionProps?: DescriptionProps;
	fieldErrorProps?: FieldErrorProps;
}

export const CheckboxGroupField = ({
	label,
	description,
	errorMessage,
	labelProps,
	descriptionProps,
	fieldErrorProps,
	children,
	...props
}: CheckboxGroupFieldProps) => {
	return (
		<CheckboxGroup data-slot="checkbox-group-field" {...props}>
			<Label {...labelProps}>{label}</Label>
			{children}
			{description && (
				<Description {...descriptionProps}>{description}</Description>
			)}
			<FieldError {...fieldErrorProps}>{errorMessage}</FieldError>
		</CheckboxGroup>
	);
};

export interface FormCheckboxGroupFieldProps extends CheckboxGroupFieldProps {
	formatErrors?: TErrorFormatter;
}

export const FormCheckboxGroupField = ({
	formatErrors = defaultErrorFormatter,
	...props
}: FormCheckboxGroupFieldProps) => {
	const field = useFieldContext<Array<string>>();
	const errors = useStore(field.store, (state) => state.meta.errors);
	const errorMessage = props.errorMessage ?? formatErrors?.(errors);

	return (
		<CheckboxGroupField
			{...props}
			{...(errorMessage && { errorMessage, isInvalid: true })}
			value={field.state.value}
			name={field.name}
			onChange={field.handleChange}
			onBlur={field.handleBlur}
		/>
	);
};
