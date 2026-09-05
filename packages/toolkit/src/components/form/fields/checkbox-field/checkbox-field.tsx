import { useId } from "react";
import { Checkbox, type CheckboxProps } from "../../../checkbox/checkbox";
import {
	Field,
	type FieldComponentProps,
	FieldDescription,
	FieldError,
	getFieldDescribedBy,
} from "../../../field/field";
import {
	getFieldErrorState,
	resolveFieldErrors,
	resolveFormFieldErrors,
	type TErrorFormatter,
} from "../../utils/errors";
import { useFieldContext } from "../../utils/form-context";

/** Props for the {@link CheckboxField} component. */
export interface CheckboxFieldProps extends Omit<CheckboxProps, "children">, FieldComponentProps {}

/**
 * A checkbox field composes a checkbox with a label, description, and error
 * message for use in forms.
 */
export const CheckboxField = ({
	label,
	description,
	errors,
	errorMessage,
	descriptionProps,
	fieldErrorProps,
	...props
}: CheckboxFieldProps) => {
	const descriptionId = useId();
	const errorId = useId();
	const resolvedErrors = resolveFieldErrors(errors, errorMessage);
	const isInvalid = props.isInvalid ?? !!resolvedErrors?.length;
	const showError = isInvalid && !!resolvedErrors?.length;
	const describedBy = getFieldDescribedBy(!!description, descriptionId, showError, errorId);

	return (
		<Field data-slot="checkbox-field" data-invalid={isInvalid || undefined}>
			<Checkbox
				{...props}
				data-slot="checkbox-field-checkbox"
				aria-invalid={isInvalid || undefined}
				aria-describedby={describedBy}
			>
				{label}
			</Checkbox>
			{description && (
				<FieldDescription
					data-slot="checkbox-field-description"
					id={descriptionId}
					{...descriptionProps}
				>
					{description}
				</FieldDescription>
			)}
			{showError && (
				<FieldError
					data-slot="checkbox-field-error"
					id={errorId}
					{...fieldErrorProps}
					errors={resolvedErrors}
				/>
			)}
		</Field>
	);
};

/** Props for the {@link FormCheckboxField} component. */
export interface FormCheckboxFieldProps extends Omit<CheckboxFieldProps, "label"> {
	/** The label text displayed beside the checkbox. Required for form-connected fields. */
	label: string;
	/** A custom error formatter for converting form validation errors to displayable error items. */
	formatErrors?: TErrorFormatter;
}

/** A form-connected checkbox field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormCheckboxField = ({ formatErrors, ...props }: FormCheckboxFieldProps) => {
	const field = useFieldContext<boolean>();
	const { isInvalid, errors } = getFieldErrorState(field.state.meta);
	const resolvedErrors = resolveFormFieldErrors(errors, {
		errorMessage: props.errorMessage,
		formatErrors,
	});

	return (
		<CheckboxField
			{...props}
			isInvalid={isInvalid}
			errors={resolvedErrors}
			isSelected={field.state.value}
			onChange={(isSelected) => field.handleChange(isSelected)}
		/>
	);
};
