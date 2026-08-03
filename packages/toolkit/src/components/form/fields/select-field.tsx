import { useStore } from "@tanstack/react-form";
import type { ReactNode } from "react";
import type { Key } from "react-aria-components";
import {
	Field,
	FieldDescription,
	type FieldDescriptionProps,
	FieldError,
	type FieldErrorProps,
	FieldLabel,
	type FieldLabelProps,
} from "../../field/field";
import {
	Select,
	SelectContent,
	SelectList,
	type SelectProps,
	SelectTrigger,
	type SelectTriggerProps,
	SelectValue,
	type SelectValueProps,
} from "../../select/select";
import { defaultErrorFormatter, type TErrorFormatter } from "../utils/errors";
import { useFieldContext } from "../utils/form-context";

/** Props for the {@link SelectField} component. */
export interface SelectFieldProps<T extends object>
	extends Omit<SelectProps<T>, "children"> {
	/** The collection of items to display in the select list. */
	items?: Iterable<T>;
	/** The label text displayed above the select trigger. */
	label?: string;
	/** Help text displayed below the select trigger. */
	description?: string;
	/** An error message displayed when validation fails. */
	errorMessage?: string;
	/** A render function or static elements for the select options. */
	children: ReactNode | ((item: T) => ReactNode);
	/** Additional props forwarded to the `FieldLabel` component. */
	labelProps?: FieldLabelProps;
	/** Additional props forwarded to the `FieldDescription` component. */
	descriptionProps?: FieldDescriptionProps;
	/** Additional props forwarded to the `FieldError` component. */
	fieldErrorProps?: FieldErrorProps;
	/** Additional props forwarded to the `SelectTrigger` component. */
	selectTriggerProps?: SelectTriggerProps;
	/** Additional props forwarded to the `SelectValue` component. */
	selectValueProps?: Omit<SelectValueProps<T>, "children">;
	/** A custom render function for the selected value display. */
	renderValue?: SelectValueProps<T>["children"];
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
	errorMessage,
	labelProps,
	descriptionProps,
	fieldErrorProps,
	selectTriggerProps,
	selectValueProps,
	...props
}: SelectFieldProps<T>) => {
	return (
		<Field data-slot="select-field" data-invalid={!!errorMessage}>
			{label && (
				<FieldLabel data-slot="select-field-label" {...labelProps}>
					{label}
				</FieldLabel>
			)}
			<Select {...props} isInvalid={!!errorMessage}>
				<SelectTrigger
					data-slot="select-field-trigger"
					aria-invalid={!!errorMessage || undefined}
					{...selectTriggerProps}
				>
					<SelectValue<T> data-slot="select-field-value" {...selectValueProps}>
						{renderValue ??
							(({ selectedText, defaultChildren }) =>
								selectedText || defaultChildren)}
					</SelectValue>
				</SelectTrigger>
				{description && (
					<FieldDescription
						data-slot="select-field-description"
						{...descriptionProps}
					>
						{description}
					</FieldDescription>
				)}
				{errorMessage && (
					<FieldError
						data-slot="select-field-error"
						{...fieldErrorProps}
						errors={[{ message: errorMessage }]}
					/>
				)}
				<SelectContent data-slot="select-field-content">
					<SelectList data-slot="select-field-list" items={items}>
						{children}
					</SelectList>
				</SelectContent>
			</Select>
		</Field>
	);
};

/** Props for the {@link FormSelectField} component. */
export interface FormSelectFieldProps<T extends object>
	extends Omit<SelectFieldProps<T>, "label"> {
	/** The label text displayed above the select trigger. Required for form-connected fields. */
	label: string;
	/** A custom error formatter for converting form validation errors to a display string. */
	formatErrors?: TErrorFormatter;
}

/** A form-connected select field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormSelectField = <T extends object>({
	formatErrors = defaultErrorFormatter,
	...props
}: FormSelectFieldProps<T>) => {
	const field = useFieldContext<Key | Array<Key> | null>();
	const errors = useStore(field.store, (state) => state.meta.errors);
	const errorMessage = props.errorMessage ?? formatErrors?.(errors);

	return (
		<SelectField
			{...props}
			{...(errorMessage && { errorMessage, isInvalid: true })}
			name={field.name}
			selectedKey={field.state.value as Key | null}
			onBlur={field.handleBlur}
			onSelectionChange={(value) => field.handleChange(value)}
		/>
	);
};
