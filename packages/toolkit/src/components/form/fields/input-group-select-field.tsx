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

export interface TInputGroupSelectFieldItem {
	id: string;
	label: string;
}

export interface TInputGroupSelectFieldValue {
	inputValue: string;
	selectValue: string;
}

export interface InputGroupSelectFieldProps
	extends Omit<InputGroupProps, "children" | "aria-label" | "aria-labelledby"> {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	items: Array<TInputGroupSelectFieldItem>;
	labelProps?: LabelProps;
	descriptionProps?: DescriptionProps;
	fieldErrorProps?: FieldErrorProps;
	inputProps?: Omit<
		InputGroupInputProps,
		"value" | "onChange" | "onBlur" | "name"
	>;
	selectProps?: Omit<
		SelectProps<TInputGroupSelectFieldItem>,
		"children" | "selectedKey" | "onSelectionChange" | "items"
	>;
	selectTriggerProps?: SelectTriggerProps;
}

interface InputGroupSelectFieldInternalProps {
	value: TInputGroupSelectFieldValue;
	onInputChange: (value: string) => void;
	onSelectChange: (value: string) => void;
	onBlur: () => void;
	name?: string;
}

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

export interface FormInputGroupSelectFieldProps
	extends Omit<
		InputGroupSelectFieldProps,
		"value" | "onInputChange" | "onSelectChange" | "onBlur" | "name"
	> {
	formatErrors?: TErrorFormatter;
}

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
