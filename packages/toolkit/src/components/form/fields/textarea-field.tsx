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

export interface TextareaFieldProps extends AriaTextFieldProps {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	labelProps?: LabelProps;
	textareaProps?: AriaTextAreaProps;
	descriptionProps?: DescriptionProps;
	fieldErrorProps?: FieldErrorProps;
}

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

export interface FormTextareaFieldProps
	extends Omit<TextareaFieldProps, "label"> {
	label: string;
	formatErrors?: TErrorFormatter;
}

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
