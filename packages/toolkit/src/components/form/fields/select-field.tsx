import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useStore } from "@tanstack/react-form";
import type { ReactNode } from "react";
import type { Key, ValidationResult } from "react-aria-components";
import { composeTailwindRenderProps } from "../../../utils/classes";
import { Description, type DescriptionProps } from "../../field/description";
import { fieldVariants } from "../../field/field";
import { FieldError, type FieldErrorProps } from "../../field/field-error";
import { inputFocusRing } from "../../field/input";
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

export interface SelectFieldProps<T extends object>
	extends Omit<SelectProps<T>, "children"> {
	items?: Iterable<T>;
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	children: ReactNode | ((item: T) => ReactNode);
	labelProps?: LabelProps;
	descriptionProps?: DescriptionProps;
	fieldErrorProps?: FieldErrorProps;
	selectTriggerProps?: SelectTriggerProps;
	selectValueProps?: Omit<SelectValueProps<T>, "children">;
	renderValue?: SelectValueProps<T>["children"];
}

export const SelectField = <T extends object>({
	renderValue,
	items = [],
	children,
	label,
	description,
	errorMessage,
	isRequired,
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
			{...(isRequired !== undefined && { isRequired })}
		>
			{label && (
				<Label data-slot="select-field-label" {...labelProps}>
					{label} {isRequired && <i aria-hidden="true">*</i>}
				</Label>
			)}
			<SelectTrigger
				data-slot="select-field-trigger"
				{...selectTriggerProps}
				className={composeTailwindRenderProps(
					selectTriggerProps?.className,
					inputFocusRing(),
				)}
			>
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

export interface FormSelectFieldProps<T extends object>
	extends Omit<SelectFieldProps<T>, "label"> {
	label: string;
	formatErrors?: TErrorFormatter;
}

export function FormSelectField<T extends object>({
	label,
	description,
	isRequired,
	formatErrors = defaultErrorFormatter,
	...props
}: FormSelectFieldProps<T>) {
	const field = useFieldContext<Key | Key[] | null>();
	const errors = useStore(field.store, (state) => state.meta.errors);
	const errorMessage = props.errorMessage ?? formatErrors?.(errors);

	return (
		<SelectField
			{...props}
			label={label}
			{...(description && { description })}
			{...(isRequired && { isRequired })}
			{...(errorMessage && { errorMessage })}
			name={field.name}
			value={field.state.value}
			onBlur={field.handleBlur}
			onChange={(value) => field.handleChange(value)}
		/>
	);
}
