import { CalendarDateTime } from "@internationalized/date";
import { useId } from "react";
import type { DateValue } from "react-aria-components";
import {
	Calendar,
	CalendarCell,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeader,
	CalendarHeaderCell,
	CalendarHeading,
	CalendarMonthPicker,
	CalendarNextButton,
	CalendarPreviousButton,
	CalendarYearPicker,
} from "#components/calendar";
import {
	DatePicker,
	DatePickerGroup,
	DatePickerInput,
	DatePickerPopover,
	DatePickerSegment,
	DatePickerTrigger,
	type DatePickerPopoverProps,
	type DatePickerProps,
} from "#components/date-picker";
import {
	Field,
	type FieldComponentProps,
	FieldDescription,
	FieldError,
	FieldLabel,
	type FieldDescriptionProps,
	type FieldErrorProps,
	type FieldLabelProps,
	getFieldDescribedBy,
} from "#components/field";
import {
	getFieldErrorState,
	resolveFieldErrors,
	resolveFormFieldErrors,
	type TErrorFormatter,
} from "../../utils/errors";
import { useFieldContext } from "../../utils/form-context";

/** Converts between a picker's `DateValue` and an external field value such as a `datetime-local` string. */
export interface DatePickerValueCodec<TValue extends DateValue, TFieldValue> {
	/** Converts an external field value into a picker value, returning `null` when the value is empty or invalid. */
	parse: (value: TFieldValue) => TValue | null;
	/** Converts a picker value into the external field value. */
	format: (value: TValue | null) => TFieldValue;
}

/** Props shared by the {@link DatePickerField} value contracts. */
export interface DatePickerFieldBaseProps<TValue extends DateValue>
	extends
		Omit<DatePickerProps<TValue>, "className" | "value" | "defaultValue" | "onChange">,
		FieldComponentProps {
	/** Whether the calendar caption shows a heading or month/year dropdowns. @default "label" */
	captionLayout?: "label" | "dropdown";
	/** Additional props forwarded to the `DatePickerPopover` component. */
	popoverProps?: DatePickerPopoverProps;
	className?: string;
	/** Additional props forwarded to the `FieldLabel` component. */
	labelProps?: FieldLabelProps;
	/** Additional props forwarded to the `FieldDescription` component. */
	descriptionProps?: FieldDescriptionProps;
	/** Additional props forwarded to the `FieldError` component. */
	fieldErrorProps?: FieldErrorProps;
}

/** Props for the {@link DatePickerField} component. */
export type DatePickerFieldProps<
	TValue extends DateValue = CalendarDateTime,
	TFieldValue = TValue | null,
> = DatePickerFieldBaseProps<TValue> &
	(
		| {
				/** The field value is the picker's own `DateValue`. */
				value?: TValue | null;
				/** Called with the picker's `DateValue` whenever the selection changes. */
				onChange?: (value: TValue | null) => void;
				codec?: undefined;
		  }
		| {
				/** The field value in the codec's external type. */
				value?: TFieldValue;
				/** Called with the value converted by the codec. */
				onChange?: (value: TFieldValue) => void;
				/** Converts between the picker's `DateValue` and the external field value. */
				codec: DatePickerValueCodec<TValue, TFieldValue>;
		  }
	);

/**
 * A date picker field combines a date field and a calendar popover with a
 * label, description, and error message. Supports date and time entry through
 * a `CalendarDateTime` value, or any other `DateValue` via the generic
 * parameters; pass a `codec` to bind it to a different field value type such
 * as a `datetime-local` string.
 */
export const DatePickerField = <
	TValue extends DateValue = CalendarDateTime,
	TFieldValue = TValue | null,
>({
	label,
	description,
	errors,
	errorMessage,
	isInvalid = false,
	isRequired = false,
	isDisabled = false,
	isReadOnly = false,
	value,
	onChange,
	codec,
	captionLayout = "label",
	popoverProps,
	className,
	labelProps,
	descriptionProps,
	fieldErrorProps,
	...props
}: DatePickerFieldProps<TValue, TFieldValue>) => {
	const descriptionId = useId();
	const errorId = useId();
	const resolvedErrors = resolveFieldErrors(errors, errorMessage);
	const showError = isInvalid && !!resolvedErrors?.length;
	const describedBy = getFieldDescribedBy(!!description, descriptionId, showError, errorId);
	const pickerValue = value == null ? null : codec ? codec.parse(value) : value;

	return (
		<Field data-invalid={isInvalid || undefined} className={className}>
			<DatePicker
				{...props}
				value={pickerValue}
				onChange={(nextValue) => {
					// SAFETY: React Aria maps the picker value to the field's granularity, so it is
					// always the same DateValue subtype the caller supplied as TValue.
					const next = nextValue as TValue | null;
					if (codec) {
						onChange?.(codec.format(next));
						return;
					}
					onChange?.(next);
				}}
				isInvalid={isInvalid}
				isRequired={isRequired}
				isDisabled={isDisabled}
				isReadOnly={isReadOnly}
				aria-describedby={describedBy}
			>
				{label && <FieldLabel {...labelProps}>{label}</FieldLabel>}
				<DatePickerGroup>
					<DatePickerInput>{(segment) => <DatePickerSegment segment={segment} />}</DatePickerInput>
					<DatePickerTrigger />
				</DatePickerGroup>
				{description && (
					<FieldDescription id={descriptionId} {...descriptionProps}>
						{description}
					</FieldDescription>
				)}
				{showError && <FieldError id={errorId} {...fieldErrorProps} errors={resolvedErrors} />}
				<DatePickerPopover aria-label={label} {...popoverProps}>
					<Calendar aria-label={label}>
						<CalendarHeader>
							<CalendarPreviousButton />
							{captionLayout === "dropdown" ? (
								<>
									<CalendarMonthPicker />
									<CalendarYearPicker />
								</>
							) : (
								<CalendarHeading />
							)}
							<CalendarNextButton />
						</CalendarHeader>
						<CalendarGrid>
							<CalendarGridHeader>
								{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
							</CalendarGridHeader>
							<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
						</CalendarGrid>
					</Calendar>
				</DatePickerPopover>
			</DatePicker>
		</Field>
	);
};

type FormDatePickerFieldBaseProps<TValue extends DateValue> = Omit<
	DatePickerFieldBaseProps<TValue>,
	"label"
> & {
	/** The label text displayed above the picker. Required for form-connected fields. */
	label: string;
	/** A custom error formatter for converting form validation errors to displayable error items. */
	formatErrors?: TErrorFormatter;
};

/** Props for the {@link FormDatePickerField} component. */
export type FormDatePickerFieldProps<
	TValue extends DateValue = CalendarDateTime,
	TFieldValue = TValue | null,
> = FormDatePickerFieldBaseProps<TValue> &
	({ codec?: undefined } | { codec: DatePickerValueCodec<TValue, TFieldValue> });

const useFormDatePickerState = <TFieldValue,>(
	formatErrors: TErrorFormatter | undefined,
	errorMessage: string | undefined,
) => {
	const field = useFieldContext<TFieldValue>();
	const { isInvalid, errors } = getFieldErrorState(field.state.meta);
	const resolvedErrors = resolveFormFieldErrors(errors, { errorMessage, formatErrors });

	return { field, isInvalid, resolvedErrors };
};

/** The pass-through codec used when a form field's value already is a `DateValue`. */
const identityDateCodec = <TValue extends DateValue>(): DatePickerValueCodec<
	TValue,
	TValue | null
> => ({
	parse: (value) => value,
	format: (value) => value,
});

const FormDatePickerFieldInner = <
	TValue extends DateValue = CalendarDateTime,
	TFieldValue = TValue | null,
>({
	codec,
	formatErrors,
	...props
}: FormDatePickerFieldBaseProps<TValue> & { codec: DatePickerValueCodec<TValue, TFieldValue> }) => {
	const { field, isInvalid, resolvedErrors } = useFormDatePickerState<TFieldValue>(
		formatErrors,
		props.errorMessage,
	);

	return (
		<DatePickerField
			{...props}
			codec={codec}
			isInvalid={isInvalid}
			errors={resolvedErrors}
			name={field.name}
			value={field.state.value}
			onChange={(value: TFieldValue) => field.handleChange(value)}
			onBlur={field.handleBlur}
		/>
	);
};

/** A form-connected date picker field that reads its value, change handlers, and validation errors from the nearest field context. */
export const FormDatePickerField = <
	TValue extends DateValue = CalendarDateTime,
	TFieldValue = TValue | null,
>({
	codec,
	...props
}: FormDatePickerFieldProps<TValue, TFieldValue>) => {
	return codec ? (
		<FormDatePickerFieldInner<TValue, TFieldValue> {...props} codec={codec} />
	) : (
		<FormDatePickerFieldInner<TValue, TValue | null>
			{...props}
			codec={identityDateCodec<TValue>()}
		/>
	);
};
