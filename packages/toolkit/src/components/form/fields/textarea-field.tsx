import { useStore } from "@tanstack/react-form";
import {
	TextField as AriaTextField,
	type TextFieldProps as AriaTextFieldProps,
	composeRenderProps,
} from "react-aria-components";
import { cn } from "#lib/utils";
import {
	FieldDescription,
	type FieldDescriptionProps,
	FieldError,
	type FieldErrorProps,
} from "../../field/field";
import { Label, type LabelProps } from "../../label/label";
import { Textarea, type TextareaProps } from "../../textarea/textarea";
import { defaultErrorFormatter, type TErrorFormatter } from "../utils/errors";
import { useFieldContext } from "../utils/form-context";

/** Props for the {@link TextareaField} component. */
export interface TextareaFieldProps extends AriaTextFieldProps {
	/** The label text displayed above the textarea. */
	label?: string;
	/** Help text displayed below the textarea. */
	description?: string;
	/** An error message displayed when validation fails. */
	errorMessage?: string;
	/** Additional props forwarded to the `Label` component. */
	labelProps?: LabelProps;
	/** Additional props forwarded to the `Textarea` component. */
	textareaProps?: TextareaProps;
	/** Additional props forwarded to the `FieldDescription` component. */
	descriptionProps?: FieldDescriptionProps;
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
			className={composeRenderProps(props.className, (className) =>
				cn("flex flex-col gap-1", className),
			)}
		>
			{label && <Label {...labelProps}>{label}</Label>}
			<Textarea {...textareaProps} />
			{description && (
				<FieldDescription {...descriptionProps}>{description}</FieldDescription>
			)}
			<FieldError
				{...fieldErrorProps}
				errors={errorMessage ? [{ message: errorMessage }] : undefined}
			/>
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
