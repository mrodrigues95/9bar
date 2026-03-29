import { useStore } from "@tanstack/react-form";
import {
	TextField as AriaTextField,
	type TextFieldProps as AriaTextFieldProps,
	composeRenderProps,
	type ValidationResult,
} from "react-aria-components";
import { Description, type DescriptionProps } from "../../field/description";
import { fieldVariants } from "../../field/field";
import { FieldError, type FieldErrorProps } from "../../field/field-error";
import { Input, type InputProps } from "../../field/input";
import { Label, type LabelProps } from "../../field/label";
import { defaultErrorFormatter, type TErrorFormatter } from "../utils/errors";
import { useFieldContext } from "../utils/form-context";

/** Props for the {@link TextField} component. */
export interface TextFieldProps extends AriaTextFieldProps {
	/** The label text displayed above the input. */
	label?: string;
	/** Help text displayed below the input. */
	description?: string;
	/** An error message or a function that returns one from the validation result. */
	errorMessage?: string | ((validation: ValidationResult) => string);
	/** Additional props forwarded to the `Label` component. */
	labelProps?: LabelProps;
	/** Additional props forwarded to the `Input` component. */
	inputProps?: InputProps;
	/** Additional props forwarded to the `Description` component. */
	descriptionProps?: DescriptionProps;
	/** Additional props forwarded to the `FieldError` component. */
	fieldErrorProps?: FieldErrorProps;
}

/**
 * A text field allows a user to enter a plain text value with a keyboard.
 * Composes a label, input, description, and error message.
 */
export const TextField = ({
	label,
	description,
	errorMessage,
	labelProps,
	inputProps,
	descriptionProps,
	fieldErrorProps,
	...props
}: TextFieldProps) => {
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
			<Input {...inputProps} />
			{description && (
				<Description {...descriptionProps}>{description}</Description>
			)}
			<FieldError {...fieldErrorProps}>{errorMessage}</FieldError>
		</AriaTextField>
	);
};

/** Props for the {@link FormTextField} component. */
export interface FormTextFieldProps extends Omit<TextFieldProps, "label"> {
	/** The label text displayed above the input. Required for form-connected fields. */
	label: string;
	/** A custom error formatter for converting form validation errors to a display string. */
	formatErrors?: TErrorFormatter;
}

/** A form-connected text field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormTextField = ({
	inputProps,
	formatErrors = defaultErrorFormatter,
	...props
}: FormTextFieldProps) => {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, (state) => state.meta.errors);
	const errorMessage = props.errorMessage ?? formatErrors?.(errors);

	return (
		<TextField
			{...props}
			{...(errorMessage && { errorMessage, isInvalid: true })}
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
