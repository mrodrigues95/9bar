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
import { Input, type InputProps } from "../../input/input";
import {
	getFieldErrorState,
	normalizeFormErrors,
	type TErrorFormatter,
} from "../utils/errors";
import { useFieldContext } from "../utils/form-context";

/** Props for the {@link TextField} component. */
export interface TextFieldProps
	extends Omit<InputProps, "className">,
		FieldComponentProps {
	/** Additional props forwarded to the `FieldLabel` component. */
	labelProps?: FieldLabelProps;
	/** Additional props forwarded to the `Input` component. */
	inputProps?: InputProps;
	/** Class name forwarded to the `Field` wrapper. */
	className?: string;
}

/**
 * A text field allows a user to enter a plain text value with a keyboard.
 * Composes a label, input, description, and error message.
 */
export const TextField = ({
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
	inputProps,
	descriptionProps,
	fieldErrorProps,
	name,
	id,
	...rest
}: TextFieldProps) => {
	const controlId = useId();
	const descriptionId = useId();
	const errorId = useId();
	const resolvedErrors =
		errors ?? (errorMessage ? [{ message: errorMessage }] : undefined);
	const showError = isInvalid && !!resolvedErrors?.length;
	const describedBy = getFieldDescribedBy(
		!!description,
		descriptionId,
		showError,
		errorId,
	);

	return (
		<Field
			data-slot="text-field"
			data-invalid={isInvalid || undefined}
			className={className}
		>
			{label && (
				<FieldLabel
					data-slot="text-field-label"
					htmlFor={id ?? controlId}
					{...labelProps}
				>
					{label}
				</FieldLabel>
			)}
			<Input
				data-slot="text-field-input"
				id={id ?? controlId}
				name={name}
				{...rest}
				{...inputProps}
				required={isRequired || undefined}
				disabled={isDisabled || undefined}
				readOnly={isReadOnly || undefined}
				aria-invalid={isInvalid || undefined}
				aria-describedby={describedBy}
			/>
			{description && (
				<FieldDescription
					data-slot="text-field-description"
					id={descriptionId}
					{...descriptionProps}
				>
					{description}
				</FieldDescription>
			)}
			{showError && (
				<FieldError
					data-slot="text-field-error"
					id={errorId}
					{...fieldErrorProps}
					errors={resolvedErrors}
				/>
			)}
		</Field>
	);
};

/** Props for the {@link FormTextField} component. */
export interface FormTextFieldProps extends Omit<TextFieldProps, "label"> {
	/** The label text displayed above the input. Required for form-connected fields. */
	label: string;
	/** A custom error formatter for converting form validation errors to displayable error items. */
	formatErrors?: TErrorFormatter;
}

/** A form-connected text field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormTextField = ({
	inputProps,
	formatErrors,
	...props
}: FormTextFieldProps) => {
	const field = useFieldContext<string>();
	const { isInvalid, errors } = getFieldErrorState(field.state.meta);
	const resolvedErrors =
		props.errorMessage !== undefined
			? [{ message: props.errorMessage }]
			: normalizeFormErrors(errors, formatErrors);

	return (
		<TextField
			{...props}
			isInvalid={isInvalid}
			errors={resolvedErrors}
			inputProps={{
				...inputProps,
				name: field.name,
				value: field.state.value,
				onBlur: field.handleBlur,
				onChange: (e) => field.handleChange(e.target.value),
			}}
		/>
	);
};
