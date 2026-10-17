import { useId } from "react";
import {
	Field,
	type FieldComponentProps,
	FieldDescription,
	FieldError,
	FieldLabel,
	type FieldLabelProps,
	getFieldDescribedBy,
} from "#components/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	type InputGroupInputProps,
	type InputGroupProps,
	InputGroupSelectTrigger,
	type InputGroupSelectTriggerProps,
} from "#components/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectList,
	type SelectProps,
	SelectValue,
} from "#components/select";
import {
	getFieldErrorState,
	resolveFieldErrors,
	resolveFormFieldErrors,
	type ErrorFormatter,
} from "../../utils/errors";
import { useFieldContext } from "../../utils/form-context";

/** An item in the select dropdown of an InputGroupSelectField. */
export interface InputGroupSelectFieldItem {
	/** A unique identifier for the item. */
	id: string;
	/** The display text for the item. */
	label: string;
}

/** The combined value of the input and select in an InputGroupSelectField. */
export interface InputGroupSelectFieldValue<
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
	items: Array<InputGroupSelectFieldItem>;
	/** Additional props forwarded to the `FieldLabel` component. */
	labelProps?: FieldLabelProps;
	/** Additional props forwarded to the text input. */
	inputProps?: Omit<InputGroupInputProps, "value" | "onChange" | "onBlur" | "name">;
	/** Additional props forwarded to the `Select` component. */
	selectProps?: Omit<
		SelectProps<InputGroupSelectFieldItem>,
		"children" | "selectedKey" | "onSelectionChange" | "items"
	>;
	/** Additional props forwarded to the `SelectTrigger` component. */
	selectTriggerProps?: InputGroupSelectTriggerProps;
}

interface InputGroupSelectFieldInternalProps {
	value: InputGroupSelectFieldValue;
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
		<Field data-invalid={isInvalid || undefined}>
			{label && (
				<FieldLabel id={labelId} htmlFor={inputId} {...labelProps}>
					{label}
				</FieldLabel>
			)}
			<InputGroup
				{...props}
				{...(label ? { "aria-labelledby": labelId } : {})}
				{...(describedBy ? { "aria-describedby": describedBy } : {})}
				isInvalid={isInvalid || undefined}
			>
				<InputGroupInput
					id={inputId}
					{...inputProps}
					name={name}
					value={value.inputValue}
					onChange={(e) => onInputChange(e.target.value)}
					onBlur={onBlur}
					aria-invalid={isInvalid || undefined}
					aria-describedby={describedBy}
				/>
				<InputGroupAddon align="inline-end">
					<Select
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
							className="min-w-auto"
							{...selectTriggerProps}
							aria-invalid={isInvalid || undefined}
							aria-describedby={describedBy}
						>
							<SelectValue />
						</InputGroupSelectTrigger>
						<SelectContent>
							<SelectList items={items}>
								{(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
							</SelectList>
						</SelectContent>
					</Select>
				</InputGroupAddon>
			</InputGroup>
			{description && (
				<FieldDescription id={descriptionId} {...descriptionProps}>
					{description}
				</FieldDescription>
			)}
			{showError && <FieldError id={errorId} {...fieldErrorProps} errors={resolvedErrors} />}
		</Field>
	);
};

/** Props for the {@link FormInputGroupSelectField} component. */
export interface FormInputGroupSelectFieldProps extends Omit<
	InputGroupSelectFieldProps,
	"value" | "onInputChange" | "onSelectChange" | "onBlur" | "name"
> {
	/** A custom error formatter for converting form validation errors to displayable error items. */
	formatErrors?: ErrorFormatter;
}

/** A form-connected input group select field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormInputGroupSelectField = ({
	formatErrors,
	...props
}: FormInputGroupSelectFieldProps) => {
	const field = useFieldContext<InputGroupSelectFieldValue>();
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
