import {
	TextField as AriaTextField,
	type TextFieldProps as AriaTextFieldProps,
	composeRenderProps,
	type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Description, type DescriptionProps } from "../field/description";
import { FieldError, type FieldErrorProps } from "../field/field-error";
import { Input, type InputProps } from "../field/input";
import { Label, type LabelProps } from "../field/label";

const textFieldVariants = tv({
	base: "flex flex-col gap-2",
});

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
	isRequired,
	labelProps,
	inputProps,
	descriptionProps,
	fieldErrorProps,
	...props
}: TextFieldProps) => {
	const commonProps = {
		...(props.isDisabled && { "data-disabled": props.isDisabled }),
	};

	return (
		<AriaTextField
			{...(isRequired !== undefined && { isRequired })}
			data-slot="text-field"
			{...props}
			className={composeRenderProps(
				props.className,
				(className, _renderProps) => textFieldVariants({ className }),
			)}
		>
			{label && (
				<Label {...commonProps} {...labelProps}>
					{label} {isRequired && <i aria-hidden="true">*</i>}
				</Label>
			)}
			<Input {...inputProps} />
			{description && (
				<Description {...commonProps} {...descriptionProps}>
					{description}
				</Description>
			)}
			<FieldError {...commonProps} {...fieldErrorProps}>
				{errorMessage}
			</FieldError>
		</AriaTextField>
	);
};
