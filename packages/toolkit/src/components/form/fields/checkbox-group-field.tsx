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

/** Props for the {@link CheckboxGroupField} component. */
export interface CheckboxGroupFieldProps
	extends Omit<CheckboxGroupProps, "children"> {
	/** The checkbox items to display in the group. */
	children: ReactNode;
	/** The label text displayed above the checkbox group. */
	label: string;
	/** Help text displayed below the checkbox group. */
	description?: string;
	/** An error message or a function that returns one from the validation result. */
	errorMessage?: string | ((validation: ValidationResult) => string);
	/** Additional props forwarded to the `Label` component. */
	labelProps?: LabelProps;
	/** Additional props forwarded to the `Description` component. */
	descriptionProps?: DescriptionProps;
	/** Additional props forwarded to the `FieldError` component. */
	fieldErrorProps?: FieldErrorProps;
}

/**
 * A checkbox group field composes a labeled checkbox group with a description
 * and error message for use in forms.
 */
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

/** Props for the {@link FormCheckboxGroupField} component. */
export interface FormCheckboxGroupFieldProps extends CheckboxGroupFieldProps {
	/** A custom error formatter for converting form validation errors to a display string. */
	formatErrors?: TErrorFormatter;
}

/** A form-connected checkbox group field that reads its value, change handlers, and validation errors from the nearest field context. */
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
