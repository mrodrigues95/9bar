import { useStore } from "@tanstack/react-form";
import type { ReactNode } from "react";
import { CheckboxGroup } from "react-aria-components";
import {
	FieldDescription,
	type FieldDescriptionProps,
	FieldError,
	type FieldErrorProps,
	FieldGroup,
	FieldLegend,
	type FieldLegendProps,
	FieldSet,
} from "../../field/field";
import { defaultErrorFormatter, type TErrorFormatter } from "../utils/errors";
import { useFieldContext } from "../utils/form-context";

/** Props for the {@link CheckboxGroupField} component. */
export interface CheckboxGroupFieldProps
	extends Omit<React.ComponentProps<typeof CheckboxGroup>, "children"> {
	/** The checkbox items to display in the group. */
	children: ReactNode;
	/** The label text displayed above the checkbox group. */
	label: string;
	/** Help text displayed below the checkbox group. */
	description?: string;
	/** An error message displayed when validation fails. */
	errorMessage?: string;
	/** Additional props forwarded to the `FieldLegend` component. */
	labelProps?: FieldLegendProps;
	/** Additional props forwarded to the `FieldDescription` component. */
	descriptionProps?: FieldDescriptionProps;
	/** Additional props forwarded to the `FieldError` component. */
	fieldErrorProps?: FieldErrorProps;
}

/**
 * A checkbox group field composes a labeled group of checkboxes with a description
 * and error message for use in forms.
 */
export const CheckboxGroupField = ({
	label,
	description,
	errorMessage,
	labelProps,
	descriptionProps,
	fieldErrorProps,
	children,
	...props
}: CheckboxGroupFieldProps) => {
	return (
		<FieldSet data-slot="checkbox-group-field">
			{label && <FieldLegend {...labelProps}>{label}</FieldLegend>}
			<CheckboxGroup
				data-slot="checkbox-group-field-group"
				{...props}
				isInvalid={!!errorMessage}
			>
				<FieldGroup data-slot="checkbox-group">{children}</FieldGroup>
			</CheckboxGroup>
			{description && (
				<FieldDescription {...descriptionProps}>{description}</FieldDescription>
			)}
			{errorMessage && (
				<FieldError {...fieldErrorProps} errors={[{ message: errorMessage }]} />
			)}
		</FieldSet>
	);
};

/** Props for the {@link FormCheckboxGroupField} component. */
export interface FormCheckboxGroupFieldProps extends CheckboxGroupFieldProps {
	/** A custom error formatter for converting form validation errors to a display string. */
	formatErrors?: TErrorFormatter;
}

/** A form-connected checkbox group field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormCheckboxGroupField = ({
	formatErrors = defaultErrorFormatter,
	...props
}: FormCheckboxGroupFieldProps) => {
	const field = useFieldContext<Array<string>>();
	const errors = useStore(field.store, (state) => state.meta.errors);
	const errorMessage = props.errorMessage ?? formatErrors?.(errors);

	return (
		<CheckboxGroupField
			{...props}
			{...(errorMessage && { errorMessage, isInvalid: true })}
			value={field.state.value}
			name={field.name}
			onChange={field.handleChange}
			onBlur={field.handleBlur}
		/>
	);
};
