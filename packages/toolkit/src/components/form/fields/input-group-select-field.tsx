import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useStore } from "@tanstack/react-form";
import { useId } from "react";
import {
	FieldErrorContext,
	type ValidationResult,
} from "react-aria-components";
import { Description, type DescriptionProps } from "../../field/description";
import { Field } from "../../field/field";
import { FieldError, type FieldErrorProps } from "../../field/field-error";
import { Label, type LabelProps } from "../../field/label";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	type InputGroupInputProps,
	type InputGroupProps,
} from "../../input-group/input-group";
import {
	Select,
	SelectItem,
	SelectListbox,
	SelectPopover,
	type SelectProps,
	SelectTrigger,
	type SelectTriggerProps,
	SelectValue,
} from "../../select/select";
import { defaultErrorFormatter, type TErrorFormatter } from "../utils/errors";
import { useFieldContext } from "../utils/form-context";

/** An item in the select dropdown of an InputGroupSelectField. */
export interface TInputGroupSelectFieldItem {
	/** A unique identifier for the item. */
	id: string;
	/** The display text for the item. */
	label: string;
}

/** The combined value of the input and select in an InputGroupSelectField. */
export interface TInputGroupSelectFieldValue<
	TInputValue extends string | number = string | number,
	TSelectValue extends string = string,
> {
	/** The current value of the text input. */
	inputValue: TInputValue;
	/** The currently selected key in the select dropdown. */
	selectValue: TSelectValue;
}

/** Props for the {@link InputGroupSelectField} component. */
export interface InputGroupSelectFieldProps
	extends Omit<InputGroupProps, "children" | "aria-label" | "aria-labelledby"> {
	/** The label text displayed above the input group. */
	label?: string;
	/** Help text displayed below the input group. */
	description?: string;
	/** An error message or a function that returns one from the validation result. */
	errorMessage?: string | ((validation: ValidationResult) => string);
	/** The collection of items to display in the select dropdown. */
	items: Array<TInputGroupSelectFieldItem>;
	/** Additional props forwarded to the `Label` component. */
	labelProps?: LabelProps;
	/** Additional props forwarded to the `Description` component. */
	descriptionProps?: DescriptionProps;
	/** Additional props forwarded to the `FieldError` component. */
	fieldErrorProps?: FieldErrorProps;
	/** Additional props forwarded to the text input. */
	inputProps?: Omit<
		InputGroupInputProps,
		"value" | "onChange" | "onBlur" | "name"
	>;
	/** Additional props forwarded to the `Select` component. */
	selectProps?: Omit<
		SelectProps<TInputGroupSelectFieldItem>,
		"children" | "selectedKey" | "onSelectionChange" | "items"
	>;
	/** Additional props forwarded to the `SelectTrigger` component. */
	selectTriggerProps?: SelectTriggerProps;
}

interface InputGroupSelectFieldInternalProps {
	value: TInputGroupSelectFieldValue;
	onInputChange: (value: string | number) => void;
	onSelectChange: (value: string) => void;
	onBlur: () => void;
	name?: string;
}

/**
 * An input group select field combines a text input with a select dropdown in a
 * single composite field. Useful for values that pair a number with a unit (e.g. "30 seconds").
 */
export const InputGroupSelectField = ({
	label,
	description,
	errorMessage,
	items,
	labelProps,
	descriptionProps,
	fieldErrorProps,
	inputProps,
	selectProps,
	selectTriggerProps,
	value,
	onInputChange,
	onSelectChange,
	onBlur,
	...props
}: InputGroupSelectFieldProps & InputGroupSelectFieldInternalProps) => {
	const labelId = useId();
	const descriptionId = useId();
	const errorId = useId();
	const describedBy =
		`${description ? descriptionId : ""} ${errorMessage ? errorId : ""}`.trim();

	return (
		<Field data-slot="input-group-select-field">
			{label && (
				<Label
					id={labelId}
					data-slot="input-group-select-field-label"
					{...labelProps}
				>
					{label}
				</Label>
			)}
			<InputGroup
				data-slot="input-group-select-field-input-group"
				{...(label ? { "aria-labelledby": labelId } : {})}
				{...(description || errorMessage
					? { "aria-describedby": describedBy }
					: {})}
				{...props}
			>
				<InputGroupInput
					data-slot="input-group-select-field-input"
					{...inputProps}
					value={value.inputValue}
					onChange={(e) => onInputChange(e.target.value)}
					onBlur={onBlur}
				/>
				<InputGroupAddon data-slot="input-group-select-field-addon" align="end">
					<Select
						data-slot="input-group-select-field-select"
						{...selectProps}
						value={value.selectValue}
						onChange={(key) => {
							if (key !== null) {
								onSelectChange(String(key));
							}
						}}
					>
						<SelectTrigger
							data-slot="input-group-select-field-select-trigger"
							variant="default"
							size="xs"
							className="min-w-auto"
							{...selectTriggerProps}
						>
							<SelectValue data-slot="input-group-select-field-select-value" />
							<ChevronDownIcon />
						</SelectTrigger>
						<SelectPopover data-slot="input-group-select-field-select-popover">
							<SelectListbox
								data-slot="input-group-select-field-select-listbox"
								items={items}
							>
								{(item) => (
									<SelectItem
										data-slot="input-group-select-field-select-item"
										id={item.id}
									>
										{item.label}
									</SelectItem>
								)}
							</SelectListbox>
						</SelectPopover>
					</Select>
				</InputGroupAddon>
			</InputGroup>
			{description && (
				<Description
					data-slot="input-group-select-field-description"
					id={descriptionId}
					{...descriptionProps}
				>
					{description}
				</Description>
			)}
			<FieldErrorContext
				value={{
					isInvalid: !!errorMessage,
					validationErrors:
						typeof errorMessage === "string" ? [errorMessage] : [],
					validationDetails: {} as ValidityState,
				}}
			>
				<FieldError
					data-slot="input-group-select-field-error"
					id={errorId}
					{...fieldErrorProps}
				>
					{errorMessage}
				</FieldError>
			</FieldErrorContext>
		</Field>
	);
};

/** Props for the {@link FormInputGroupSelectField} component. */
export interface FormInputGroupSelectFieldProps
	extends Omit<
		InputGroupSelectFieldProps,
		"value" | "onInputChange" | "onSelectChange" | "onBlur" | "name"
	> {
	/** A custom error formatter for converting form validation errors to a display string. */
	formatErrors?: TErrorFormatter;
}

/** A form-connected input group select field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormInputGroupSelectField = ({
	formatErrors = defaultErrorFormatter,
	...props
}: FormInputGroupSelectFieldProps) => {
	const field = useFieldContext<TInputGroupSelectFieldValue>();
	const errors = useStore(field.store, (state) => state.meta.errors);
	const errorMessage = props.errorMessage ?? formatErrors?.(errors);

	return (
		<InputGroupSelectField
			{...props}
			{...(errorMessage && { errorMessage, isInvalid: true })}
			name={field.name}
			value={field.state.value}
			onInputChange={(value) =>
				field.handleChange({ ...field.state.value, inputValue: value })
			}
			onSelectChange={(value) =>
				field.handleChange({ ...field.state.value, selectValue: value })
			}
			onBlur={field.handleBlur}
		/>
	);
};
