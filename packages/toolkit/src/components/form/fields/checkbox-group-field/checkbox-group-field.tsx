import type { ReactNode } from "react";
import { useId } from "react";
import { CheckboxGroup } from "react-aria-components";
import { cn } from "#lib/utils";
import {
	type FieldComponentProps,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	type FieldLabelProps,
	getFieldDescribedBy,
} from "../../../field/field";
import {
	getFieldErrorState,
	resolveFieldErrors,
	resolveFormFieldErrors,
	type TErrorFormatter,
} from "../../utils/errors";
import { useFieldContext } from "../../utils/form-context";

/** Props for the {@link CheckboxGroupField} component. */
export interface CheckboxGroupFieldProps
	extends
		Omit<React.ComponentProps<typeof CheckboxGroup>, "children" | "className">,
		FieldComponentProps {
	/** The checkbox items to display in the group. */
	children: ReactNode;
	/** The label text displayed above the checkbox group. Required for checkbox groups. */
	label: string;
	/** Additional props forwarded to the `FieldLabel` component. */
	labelProps?: FieldLabelProps;
	/** Class name applied to the checkbox group wrapper. */
	className?: string;
}

/**
 * A checkbox group field composes a labeled group of checkboxes with a description
 * and error message for use in forms.
 */
export const CheckboxGroupField = ({
	label,
	description,
	errors,
	errorMessage,
	labelProps,
	descriptionProps,
	fieldErrorProps,
	className,
	children,
	...props
}: CheckboxGroupFieldProps) => {
	const descriptionId = useId();
	const errorId = useId();
	const resolvedErrors = resolveFieldErrors(errors, errorMessage);
	const isInvalid = props.isInvalid ?? !!resolvedErrors?.length;
	const showError = isInvalid && !!resolvedErrors?.length;
	const describedBy = getFieldDescribedBy(!!description, descriptionId, showError, errorId);

	return (
		<CheckboxGroup
			data-slot="checkbox-group-field"
			data-invalid={isInvalid || undefined}
			className={cn("flex flex-col gap-2", "data-[invalid=true]:text-destructive", className)}
			{...props}
			isInvalid={isInvalid}
			aria-describedby={describedBy}
		>
			{label && (
				<FieldLabel data-slot="checkbox-group-field-label" {...labelProps}>
					{label}
				</FieldLabel>
			)}
			{description && (
				<FieldDescription
					data-slot="checkbox-group-field-description"
					id={descriptionId}
					{...descriptionProps}
				>
					{description}
				</FieldDescription>
			)}
			<FieldGroup data-slot="checkbox-group">{children}</FieldGroup>
			{showError && (
				<FieldError
					data-slot="checkbox-group-field-error"
					id={errorId}
					{...fieldErrorProps}
					errors={resolvedErrors}
				/>
			)}
		</CheckboxGroup>
	);
};

/** Props for the {@link FormCheckboxGroupField} component. */
export interface FormCheckboxGroupFieldProps extends CheckboxGroupFieldProps {
	/** A custom error formatter for converting form validation errors to displayable error items. */
	formatErrors?: TErrorFormatter;
}

/** A form-connected checkbox group field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormCheckboxGroupField = ({ formatErrors, ...props }: FormCheckboxGroupFieldProps) => {
	const field = useFieldContext<Array<string>>();
	const { isInvalid, errors } = getFieldErrorState(field.state.meta);
	const resolvedErrors = resolveFormFieldErrors(errors, {
		errorMessage: props.errorMessage,
		formatErrors,
	});

	return (
		<CheckboxGroupField
			{...props}
			isInvalid={isInvalid}
			errors={resolvedErrors}
			value={field.state.value}
			name={field.name}
			onChange={field.handleChange}
			onBlur={field.handleBlur}
		/>
	);
};
