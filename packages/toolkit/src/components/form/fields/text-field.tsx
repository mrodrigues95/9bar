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

export interface TextFieldProps extends AriaTextFieldProps {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	labelProps?: LabelProps;
	inputProps?: InputProps;
	descriptionProps?: DescriptionProps;
	fieldErrorProps?: FieldErrorProps;
}

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

export interface FormTextFieldProps extends Omit<TextFieldProps, "label"> {
	label: string;
	formatErrors?: TErrorFormatter;
}

export const FormTextField = ({
	label,
	description,
	isRequired,
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
			label={label}
			{...(description && { description })}
			{...(isRequired && { isRequired })}
			{...(errorMessage && { errorMessage })}
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
