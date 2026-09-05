import { useId } from "react";
import {
	Field,
	type FieldComponentProps,
	FieldDescription,
	FieldError,
	FieldLabel,
	type FieldLabelProps,
	getFieldDescribedBy,
} from "../../../field/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	type InputGroupInputProps,
	type InputGroupProps,
	InputGroupSelectTrigger,
	type InputGroupSelectTriggerProps,
} from "../../../input-group/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectList,
	type SelectProps,
	SelectValue,
} from "../../../select/select";
import {
	getFieldErrorState,
	resolveFieldErrors,
	resolveFormFieldErrors,
	type TErrorFormatter,
} from "../../utils/errors";
import { useFieldContext } from "../../utils/form-context";

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
	extends
		Omit<InputGroupProps, "children" | "aria-label" | "aria-labelledby">,
		FieldComponentProps {
	/** The collection of items to display in the select dropdown. */
	items: Array<TInputGroupSelectFieldItem>;
	/** Additional props forwarded to the `FieldLabel` component. */
	labelProps?: FieldLabelProps;
	/** Additional props forwarded to the text input. */
	inputProps?: Omit<InputGroupInputProps, "value" | "onChange" | "onBlur" | "name">;
	/** Additional props forwarded to the `Select` component. */
	selectProps?: Omit<
		SelectProps<TInputGroupSelectFieldItem>,
		"children" | "selectedKey" | "onSelectionChange" | "items"
	>;
	/** Additional props forwarded to the `SelectTrigger` component. */
	selectTriggerProps?: InputGroupSelectTriggerProps;
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
	errors,
	errorMessage,
	items,
	labelProps,
	descriptionProps,
	fieldErrorProps,
	inputProps,
	selectProps,
	selectTriggerProps,
	isInvalid = false,
	value,
	onInputChange,
	onSelectChange,
	onBlur,
	name,
	...props
}: InputGroupSelectFieldProps & InputGroupSelectFieldInternalProps) => {
	const labelId = useId();
	const inputId = useId();
	const descriptionId = useId();
	const errorId = useId();
	const resolvedErrors = resolveFieldErrors(errors, errorMessage);
	const showError = isInvalid && !!resolvedErrors?.length;
	const describedBy = getFieldDescribedBy(!!description, descriptionId, showError, errorId);

	return (
		<Field data-slot="input-group-select-field" data-invalid={isInvalid || undefined}>
			{label && (
				<FieldLabel
					id={labelId}
					htmlFor={inputId}
					data-slot="input-group-select-field-label"
					{...labelProps}
				>
					{label}
				</FieldLabel>
			)}
			<InputGroup
				data-slot="input-group-select-field-input-group"
				{...props}
				{...(label ? { "aria-labelledby": labelId } : {})}
				{...(describedBy ? { "aria-describedby": describedBy } : {})}
				isInvalid={isInvalid || undefined}
			>
				<InputGroupInput
					id={inputId}
					data-slot="input-group-select-field-input"
					{...inputProps}
					name={name}
					value={value.inputValue}
					onChange={(e) => onInputChange(e.target.value)}
					onBlur={onBlur}
					aria-invalid={isInvalid || undefined}
					aria-describedby={describedBy}
				/>
				<InputGroupAddon data-slot="input-group-select-field-addon" align="inline-end">
					<Select
						data-slot="input-group-select-field-select"
						{...selectProps}
						isInvalid={isInvalid || undefined}
						selectedKey={value.selectValue}
						onSelectionChange={(key) => {
							if (key !== null) {
								onSelectChange(String(key));
							}
						}}
					>
						<InputGroupSelectTrigger
							data-slot="input-group-select-field-select-trigger"
							className="min-w-auto"
							{...selectTriggerProps}
							aria-invalid={isInvalid || undefined}
							aria-describedby={describedBy}
						>
							<SelectValue data-slot="input-group-select-field-select-value" />
						</InputGroupSelectTrigger>
						<SelectContent data-slot="input-group-select-field-select-content">
							<SelectList data-slot="input-group-select-field-select-list" items={items}>
								{(item) => (
									<SelectItem data-slot="input-group-select-field-select-item" id={item.id}>
										{item.label}
									</SelectItem>
								)}
							</SelectList>
						</SelectContent>
					</Select>
				</InputGroupAddon>
			</InputGroup>
			{description && (
				<FieldDescription
					data-slot="input-group-select-field-description"
					id={descriptionId}
					{...descriptionProps}
				>
					{description}
				</FieldDescription>
			)}
			{showError && (
				<FieldError
					data-slot="input-group-select-field-error"
					id={errorId}
					{...fieldErrorProps}
					errors={resolvedErrors}
				/>
			)}
		</Field>
	);
};

/** Props for the {@link FormInputGroupSelectField} component. */
export interface FormInputGroupSelectFieldProps extends Omit<
	InputGroupSelectFieldProps,
	"value" | "onInputChange" | "onSelectChange" | "onBlur" | "name"
> {
	/** A custom error formatter for converting form validation errors to displayable error items. */
	formatErrors?: TErrorFormatter;
}

/** A form-connected input group select field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormInputGroupSelectField = ({
	formatErrors,
	...props
}: FormInputGroupSelectFieldProps) => {
	const field = useFieldContext<TInputGroupSelectFieldValue>();
	const { isInvalid, errors } = getFieldErrorState(field.state.meta);
	const resolvedErrors = resolveFormFieldErrors(errors, {
		errorMessage: props.errorMessage,
		formatErrors,
	});

	return (
		<InputGroupSelectField
			{...props}
			isInvalid={isInvalid}
			errors={resolvedErrors}
			name={field.name}
			value={field.state.value}
			onInputChange={(value) => field.handleChange({ ...field.state.value, inputValue: value })}
			onSelectChange={(value) => field.handleChange({ ...field.state.value, selectValue: value })}
			onBlur={field.handleBlur}
		/>
	);
};
