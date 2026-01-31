import { useStore } from "@tanstack/react-form";
import { useId } from "react";
import {
	FieldErrorContext,
	Provider,
	type ValidationResult,
} from "react-aria-components";
import { cn } from "tailwind-variants";
import {
	Checkbox,
	type CheckboxProps,
	CheckboxRoot,
	type CheckboxRootProps,
} from "../../checkbox/checkbox";
import { Description, type DescriptionProps } from "../../field/description";
import { fieldVariants } from "../../field/field";
import { FieldError, type FieldErrorProps } from "../../field/field-error";
import { defaultErrorFormatter, type TErrorFormatter } from "../utils/errors";
import { useFieldContext } from "../utils/form-context";

const mergeIds = (...ids: Array<string | undefined>) => {
	return ids.filter((id) => !!id).join(" ");
};

export interface CheckboxFieldProps extends Omit<CheckboxProps, "children"> {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	descriptionProps?: DescriptionProps;
	fieldErrorProps?: FieldErrorProps;
	checkboxRootProps?: CheckboxRootProps;
}

export const CheckboxField = ({
	label,
	description,
	errorMessage,
	descriptionProps,
	fieldErrorProps,
	checkboxRootProps,
	...props
}: CheckboxFieldProps) => {
	const descriptionId = useId();
	const errorId = useId();
	const ids = mergeIds(
		description ? descriptionId : undefined,
		errorMessage ? errorId : undefined,
	);

	// TODO: Native errors (e.g. required) don't show since the individual react-aria <Checkbox /> component isn't wrapped in
	// `FieldErrorContext` provider, so we manually construct the validation object here and manage its state.
	// <CheckboxGroup /> seems to be preferred for integrating with forms, so this is less of a concern for now.
	// Need to investigate further on how react-aria handles form validation states to get this working properly.
	// See https://github.com/adobe/react-spectrum/blob/d9292a9ed6c8b7bebdd56bd094f9d1dbe089f83a/packages/react-aria-components/src/Checkbox.tsx#L203
	const validation: ValidationResult = {
		isInvalid: !!props.isInvalid,
		validationErrors: typeof errorMessage === "string" ? [errorMessage] : [],
		validationDetails: {} as ValidityState,
	};

	return (
		<CheckboxRoot
			data-slot="checkbox-field"
			{...checkboxRootProps}
			className={cn(fieldVariants(), checkboxRootProps?.className)}
		>
			<Checkbox
				{...(ids ? { "aria-describedby": ids } : {})}
				data-slot="checkbox-field-label"
				{...props}
			>
				{label}
			</Checkbox>
			{description && (
				<Description
					data-slot="checkbox-field-description"
					id={descriptionId}
					{...descriptionProps}
				>
					{description}
				</Description>
			)}
			<Provider values={[[FieldErrorContext, validation]]}>
				<FieldError data-slot="checkbox-field-error" {...fieldErrorProps}>
					{errorMessage}
				</FieldError>
			</Provider>
		</CheckboxRoot>
	);
};

export interface FormCheckboxFieldProps
	extends Omit<CheckboxFieldProps, "label"> {
	label: string;
	formatErrors?: TErrorFormatter;
}

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
