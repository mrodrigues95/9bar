import { useStore } from "@tanstack/react-form";
import { Checkbox, type CheckboxProps } from "../../checkbox/checkbox";
import {
	Field,
	FieldDescription,
	type FieldDescriptionProps,
	FieldError,
	type FieldErrorProps,
} from "../../field/field";
import { defaultErrorFormatter, type TErrorFormatter } from "../utils/errors";
import { useFieldContext } from "../utils/form-context";

/** Props for the {@link CheckboxField} component. */
export interface CheckboxFieldProps extends Omit<CheckboxProps, "children"> {
	/** The label text displayed beside the checkbox. */
	label?: string;
	/** Help text displayed below the checkbox. */
	description?: string;
	/** An error message displayed when validation fails. */
	errorMessage?: string;
	/** Additional props forwarded to the `FieldDescription` component. */
	descriptionProps?: FieldDescriptionProps;
	/** Additional props forwarded to the `FieldError` component. */
	fieldErrorProps?: FieldErrorProps;
}

/**
 * A checkbox field composes a checkbox with a label, description, and error
 * message for use in forms.
 */
export const CheckboxField = ({
	label,
	description,
	errorMessage,
	descriptionProps,
	fieldErrorProps,
	...props
}: CheckboxFieldProps) => {
	return (
		<Field data-slot="checkbox-field" data-invalid={!!errorMessage}>
			<Checkbox {...props} aria-invalid={!!errorMessage || undefined}>
				{label}
			</Checkbox>
			{description && (
				<FieldDescription {...descriptionProps}>{description}</FieldDescription>
			)}
			{errorMessage && (
				<FieldError {...fieldErrorProps} errors={[{ message: errorMessage }]} />
			)}
		</Field>
	);
};

/** Props for the {@link FormCheckboxField} component. */
export interface FormCheckboxFieldProps
	extends Omit<CheckboxFieldProps, "label"> {
	/** The label text displayed beside the checkbox. Required for form-connected fields. */
	label: string;
	/** A custom error formatter for converting form validation errors to a display string. */
	formatErrors?: TErrorFormatter;
}

/** A form-connected checkbox field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormCheckboxField = ({
	formatErrors = defaultErrorFormatter,
	...props
}: FormCheckboxFieldProps) => {
	const field = useFieldContext<boolean>();
	const errors = useStore(field.store, (state) => state.meta.errors);
	const errorMessage = props.errorMessage ?? formatErrors?.(errors);

	return (
		<CheckboxField
			{...props}
			{...(errorMessage && { errorMessage, isInvalid: true })}
			isSelected={field.state.value}
			onChange={(isSelected) => field.handleChange(isSelected)}
		/>
	);
};
