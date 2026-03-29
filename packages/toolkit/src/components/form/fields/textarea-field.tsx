import { useStore } from "@tanstack/react-form";
import {
	TextArea as AriaTextArea,
	type TextAreaProps as AriaTextAreaProps,
	TextField as AriaTextField,
	type TextFieldProps as AriaTextFieldProps,
	composeRenderProps,
	type ValidationResult,
} from "react-aria-components";
import { cn } from "tailwind-variants";
import { Description, type DescriptionProps } from "../../field/description";
import { fieldVariants } from "../../field/field";
import { FieldError, type FieldErrorProps } from "../../field/field-error";
import { inputVariants } from "../../field/input";
import { Label, type LabelProps } from "../../field/label";
import { defaultErrorFormatter, type TErrorFormatter } from "../utils/errors";
import { useFieldContext } from "../utils/form-context";

/** Props for the {@link TextareaField} component. */
export interface TextareaFieldProps extends AriaTextFieldProps {
	/** The label text displayed above the textarea. */
	label?: string;
	/** Help text displayed below the textarea. */
	description?: string;
	/** An error message or a function that returns one from the validation result. */
	errorMessage?: string | ((validation: ValidationResult) => string);
	/** Additional props forwarded to the `Label` component. */
	labelProps?: LabelProps;
	/** Additional props forwarded to the `TextArea` component. */
	textareaProps?: AriaTextAreaProps;
	/** Additional props forwarded to the `Description` component. */
	descriptionProps?: DescriptionProps;
	/** Additional props forwarded to the `FieldError` component. */
	fieldErrorProps?: FieldErrorProps;
}

/**
 * A textarea field allows a user to enter multi-line plain text with a keyboard.
 * Composes a label, textarea, description, and error message.
 */
export const TextareaField = ({
	label,
	description,
	errorMessage,
	labelProps,
	textareaProps,
	descriptionProps,
	fieldErrorProps,
	...props
}: TextareaFieldProps) => {
	return (
		<AriaTextField
			data-slot="text-field"
			{...props}
			className={composeRenderProps(
				props.className,
				(className, _renderProps) => fieldVariants({ className }),
			)}
		>
			{label && <Label {...labelProps}>{label}</Label>}
			<AriaTextArea
				data-slot="textarea"
				{...textareaProps}
				className={composeRenderProps(
					textareaProps?.className,
					(className, _renderProps) =>
						cn(inputVariants({ className }), "field-sizing-content min-h-16") ??
						"",
				)}
			/>
			{description && (
				<Description {...descriptionProps}>{description}</Description>
			)}
			<FieldError {...fieldErrorProps}>{errorMessage}</FieldError>
		</AriaTextField>
	);
};

/** Props for the {@link FormTextareaField} component. */
export interface FormTextareaFieldProps
	extends Omit<TextareaFieldProps, "label"> {
	/** The label text displayed above the textarea. Required for form-connected fields. */
	label: string;
	/** A custom error formatter for converting form validation errors to a display string. */
	formatErrors?: TErrorFormatter;
}

/** A form-connected textarea field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormTextareaField = ({
	textareaProps,
	formatErrors = defaultErrorFormatter,
	...props
}: FormTextareaFieldProps) => {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, (state) => state.meta.errors);
	const errorMessage = props.errorMessage ?? formatErrors?.(errors);

	return (
		<TextareaField
			{...props}
			{...(errorMessage && { errorMessage, isInvalid: true })}
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
