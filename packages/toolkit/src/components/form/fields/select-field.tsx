import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useStore } from "@tanstack/react-form";
import type { ReactNode } from "react";
import type { Key, ValidationResult } from "react-aria-components";
import { composeTailwindRenderProps } from "../../../utils/classes";
import { Description, type DescriptionProps } from "../../field/description";
import { fieldVariants } from "../../field/field";
import { FieldError, type FieldErrorProps } from "../../field/field-error";
import { Label, type LabelProps } from "../../field/label";
import {
	Select,
	SelectListbox,
	SelectPopover,
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
	/** The collection of items to display in the select listbox. */
	items?: Iterable<T>;
	/** The label text displayed above the select trigger. */
	label?: string;
	/** Help text displayed below the select trigger. */
	description?: string;
	/** An error message or a function that returns one from the validation result. */
	errorMessage?: string | ((validation: ValidationResult) => string);
	/** A render function or static elements for the select options. */
	children: ReactNode | ((item: T) => ReactNode);
	/** Additional props forwarded to the `Label` component. */
	labelProps?: LabelProps;
	/** Additional props forwarded to the `Description` component. */
	descriptionProps?: DescriptionProps;
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
 * one of them. Composes a label, trigger, popover, listbox, description, and error message.
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
		<Select
			data-slot="select-field"
			{...props}
			className={composeTailwindRenderProps(props.className, fieldVariants())}
		>
			{label && (
				<Label data-slot="select-field-label" {...labelProps}>
					{label}
				</Label>
			)}
			<SelectTrigger data-slot="select-field-trigger" {...selectTriggerProps}>
				<SelectValue<T> data-slot="select-field-value" {...selectValueProps}>
					{renderValue ??
						(({ selectedText, defaultChildren }) =>
							selectedText || defaultChildren)}
				</SelectValue>
				<ChevronDownIcon />
			</SelectTrigger>
			{description && (
				<Description data-slot="select-field-description" {...descriptionProps}>
					{description}
				</Description>
			)}
			<FieldError data-slot="select-field-error" {...fieldErrorProps}>
				{errorMessage}
			</FieldError>
			<SelectPopover data-slot="select-field-popover">
				<SelectListbox data-slot="select-field-listbox" items={items}>
					{children}
				</SelectListbox>
			</SelectPopover>
		</Select>
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
export function FormSelectField<T extends object>({
	formatErrors = defaultErrorFormatter,
	...props
}: FormSelectFieldProps<T>) {
	const field = useFieldContext<Key | Key[] | null>();
	const errors = useStore(field.store, (state) => state.meta.errors);
	const errorMessage = props.errorMessage ?? formatErrors?.(errors);

	return (
		<SelectField
			{...props}
			{...(errorMessage && { errorMessage, isInvalid: true })}
			name={field.name}
			value={field.state.value}
			onBlur={field.handleBlur}
			onChange={(value) => field.handleChange(value)}
		/>
	);
}
