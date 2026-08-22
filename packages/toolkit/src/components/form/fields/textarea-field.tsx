import { useId } from "react";
import {
	Field,
	type FieldComponentProps,
	FieldDescription,
	FieldError,
	FieldLabel,
	type FieldLabelProps,
	getFieldDescribedBy,
} from "../../field/field";
import { Textarea, type TextareaProps } from "../../textarea/textarea";
import {
	getFieldErrorState,
	resolveFieldErrors,
	resolveFormFieldErrors,
	type TErrorFormatter,
} from "../utils/errors";
import { useFieldContext } from "../utils/form-context";

/** Props for the {@link TextareaField} component. */
export interface TextareaFieldProps
	extends Omit<TextareaProps, "className">,
		FieldComponentProps {
	/** Additional props forwarded to the `FieldLabel` component. */
	labelProps?: FieldLabelProps;
	/** Additional props forwarded to the `Textarea` component. */
	textareaProps?: TextareaProps;
	/** Class name forwarded to the `Field` wrapper. */
	className?: string;
}

/**
 * A textarea field allows a user to enter multi-line plain text with a keyboard.
 * Composes a label, textarea, description, and error message.
 */
export const TextareaField = ({
	label,
	description,
	errors,
	errorMessage,
	isInvalid = false,
	isRequired = false,
	isDisabled = false,
	isReadOnly = false,
	className,
	labelProps,
	textareaProps,
	descriptionProps,
	fieldErrorProps,
	name,
	id,
	...rest
}: TextareaFieldProps) => {
	const controlId = useId();
	const descriptionId = useId();
	const errorId = useId();
	const resolvedErrors = resolveFieldErrors(errors, errorMessage);
	const showError = isInvalid && !!resolvedErrors?.length;
	const describedBy = getFieldDescribedBy(
		!!description,
		descriptionId,
		showError,
		errorId,
	);

	return (
		<Field
			data-slot="textarea-field"
			data-invalid={isInvalid || undefined}
			className={className}
		>
			{label && (
				<FieldLabel
					data-slot="textarea-field-label"
					htmlFor={id ?? controlId}
					{...labelProps}
				>
					{label}
				</FieldLabel>
			)}
			<Textarea
				data-slot="textarea-field-textarea"
				id={id ?? controlId}
				name={name}
				{...rest}
				{...textareaProps}
				required={isRequired || undefined}
				disabled={isDisabled || undefined}
				readOnly={isReadOnly || undefined}
				aria-invalid={isInvalid || undefined}
				aria-describedby={describedBy}
			/>
			{description && (
				<FieldDescription
					data-slot="textarea-field-description"
					id={descriptionId}
					{...descriptionProps}
				>
					{description}
				</FieldDescription>
			)}
			{showError && (
				<FieldError
					data-slot="textarea-field-error"
					id={errorId}
					{...fieldErrorProps}
					errors={resolvedErrors}
				/>
			)}
		</Field>
	);
};

/** Props for the {@link FormTextareaField} component. */
export interface FormTextareaFieldProps
	extends Omit<TextareaFieldProps, "label"> {
	/** The label text displayed above the textarea. Required for form-connected fields. */
	label: string;
	/** A custom error formatter for converting form validation errors to displayable error items. */
	formatErrors?: TErrorFormatter;
}

/** A form-connected textarea field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormTextareaField = ({
	textareaProps,
	formatErrors,
	...props
}: FormTextareaFieldProps) => {
	const field = useFieldContext<string>();
	const { isInvalid, errors } = getFieldErrorState(field.state.meta);
	const resolvedErrors = resolveFormFieldErrors(errors, {
		errorMessage: props.errorMessage,
		formatErrors,
	});

	return (
		<TextareaField
			{...props}
			isInvalid={isInvalid}
			errors={resolvedErrors}
			textareaProps={{
				...textareaProps,
				name: field.name,
				value: field.state.value,
				onBlur: field.handleBlur,
				onChange: (e) => field.handleChange(e.target.value),
			}}
		/>
	);
};
