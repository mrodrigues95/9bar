import type { ReactNode } from "react";
import { useId } from "react";
import type { Key } from "react-aria-components";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	getFieldDescribedBy,
} from "#components/field";
import type { FieldComponentProps, FieldLabelProps } from "#components/field";
import { Select, SelectContent, SelectList, SelectTrigger, SelectValue } from "#components/select";
import type { SelectProps, SelectTriggerProps, SelectValueProps } from "#components/select";
import { getFieldErrorState, resolveFieldErrors, resolveFormFieldErrors } from "../../utils/errors";
import type { ErrorFormatter } from "../../utils/errors";
import { useFieldContext } from "../../utils/form-context";

/** Props for the {@link SelectField} component. */
export interface SelectFieldProps<T extends object>
	extends Omit<SelectProps<T>, "children">, FieldComponentProps {
	/** The collection of items to display in the select list. */
	items?: Iterable<T>;
	/** A render function or static elements for the select options. */
	children: ReactNode | ((item: T) => ReactNode);
	/** Additional props forwarded to the `FieldLabel` component. */
	labelProps?: FieldLabelProps;
	/** Additional props forwarded to the `SelectTrigger` component. */
	selectTriggerProps?: SelectTriggerProps;
	/** Additional props forwarded to the `SelectValue` component. */
	selectValueProps?: Omit<SelectValueProps<T>, "children">;
	/** A custom render function for the selected value display. */
	renderValue?: SelectValueProps<T>["children"];
	/** Class name forwarded to the `Field` wrapper. */
	className?: string;
}

/**
 * A select field displays a collapsible list of options and allows a user to select
 * one of them. Composes a label, trigger, popover, list, description, and error message.
 */
export const SelectField = <T extends object>({
	renderValue,
	items = [],
	children,
	label,
	description,
	errors,
	errorMessage,
	labelProps,
	descriptionProps,
	fieldErrorProps,
	selectTriggerProps,
	selectValueProps,
	className,
	...props
}: SelectFieldProps<T>) => {
	const triggerId = useId();
	const labelId = useId();
	const descriptionId = useId();
	const errorId = useId();
	const resolvedErrors = resolveFieldErrors(errors, errorMessage);
	const isInvalid = props.isInvalid ?? (resolvedErrors?.length ?? 0) > 0;
	const showError = isInvalid && (resolvedErrors?.length ?? 0) > 0;
	const describedBy = getFieldDescribedBy(
		description !== undefined,
		descriptionId,
		showError,
		errorId,
	);

	return (
		<Field data-invalid={isInvalid || undefined} className={className}>
			{label !== undefined && (
				<FieldLabel id={labelId} htmlFor={triggerId} {...labelProps}>
					{label}
				</FieldLabel>
			)}
			<Select
				{...props}
				isInvalid={isInvalid}
				aria-labelledby={label !== undefined ? labelId : undefined}
			>
				<SelectTrigger
					id={triggerId}
					aria-invalid={isInvalid || undefined}
					aria-describedby={describedBy}
					{...selectTriggerProps}
				>
					<SelectValue<T> {...selectValueProps}>
						{renderValue ??
							(({ selectedText, defaultChildren }) => selectedText || defaultChildren)}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectList items={items}>{children}</SelectList>
				</SelectContent>
			</Select>
			{description !== undefined && (
				<FieldDescription id={descriptionId} {...descriptionProps}>
					{description}
				</FieldDescription>
			)}
			{showError && <FieldError id={errorId} {...fieldErrorProps} errors={resolvedErrors} />}
		</Field>
	);
};

/** Props for the {@link FormSelectField} component. */
export interface FormSelectFieldProps<T extends object> extends Omit<SelectFieldProps<T>, "label"> {
	/** The label text displayed above the select trigger. Required for form-connected fields. */
	label: string;
	/** A custom error formatter for converting form validation errors to displayable error items. */
	formatErrors?: ErrorFormatter;
}

/** A form-connected select field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormSelectField = <T extends object>({
	formatErrors,
	...props
}: FormSelectFieldProps<T>) => {
	const field = useFieldContext<Key | null>();
	const { isInvalid, errors } = getFieldErrorState(field.state.meta);
	const resolvedErrors = resolveFormFieldErrors(errors, {
		errorMessage: props.errorMessage,
		formatErrors,
	});

	return (
		<SelectField
			{...props}
			isInvalid={isInvalid}
			errors={resolvedErrors}
			name={field.name}
			selectedKey={field.state.value}
			onBlur={field.handleBlur}
			onSelectionChange={(value) => field.handleChange(value)}
		/>
	);
};
