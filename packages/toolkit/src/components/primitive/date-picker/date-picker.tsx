import { CalendarIcon } from "lucide-react";
import type * as React from "react";
import {
	DateInput as AriaDateInput,
	DatePicker as AriaDatePicker,
	DateSegment as AriaDateSegment,
	Popover as AriaPopover,
	type DateInputProps as AriaDateInputProps,
	type DatePickerProps as AriaDatePickerProps,
	type DateSegmentProps as AriaDateSegmentProps,
	type DateValue,
} from "react-aria-components";
import { Button, ButtonProps } from "#components/button";
import { InputGroup, type InputGroupProps } from "#components/input-group";
import { popoverVariants } from "#components/popover";
import { composeTailwindRenderProps } from "#lib/utils";
import {
	datePickerGroupVariants,
	datePickerInputVariants,
	datePickerSegmentVariants,
} from "./styles";

/** Props for the {@link DatePicker} component. */
export type DatePickerProps<TValue extends DateValue> = AriaDatePickerProps<TValue>;

/**
 * A date picker combines a date field with a calendar popover, letting a user
 * type or pick a date and time. Compose {@link DatePickerGroup},
 * {@link DatePickerInput}, {@link DatePickerTrigger}, and
 * {@link DatePickerPopover} inside; pass `granularity="minute"` with a
 * `CalendarDateTime` value to also edit the time.
 */
export const DatePicker = <TValue extends DateValue>({
	className,
	...props
}: DatePickerProps<TValue>) => {
	return (
		<AriaDatePicker
			data-slot="date-picker"
			className={composeTailwindRenderProps(className, "flex flex-col gap-2")}
			{...props}
		/>
	);
};

/** Props for the {@link DatePickerGroup} component. */
export type DatePickerGroupProps = InputGroupProps;

/** The bordered group of a {@link DatePicker}, reusing the {@link InputGroup} surface with date-field focus and invalid ring states. */
export const DatePickerGroup = ({ className, ...props }: DatePickerGroupProps) => {
	return (
		<InputGroup
			data-slot="date-picker-group"
			className={composeTailwindRenderProps(className, datePickerGroupVariants())}
			{...props}
		/>
	);
};

/** Props for the {@link DatePickerInput} component. */
export type DatePickerInputProps = AriaDateInputProps;

/** The segment input of a {@link DatePicker} inside a {@link DatePickerGroup}. Render {@link DatePickerSegment} for each segment. */
export const DatePickerInput = ({ className, ...props }: DatePickerInputProps) => {
	return (
		<AriaDateInput
			data-slot="input-group-control"
			className={composeTailwindRenderProps(className, datePickerInputVariants())}
			{...props}
		/>
	);
};

/** Props for the {@link DatePickerSegment} component. */
export type DatePickerSegmentProps = AriaDateSegmentProps;

/** A single date or time segment (month, day, hour, …) inside a {@link DatePickerInput}. */
export const DatePickerSegment = ({ className, ...props }: DatePickerSegmentProps) => {
	return (
		<AriaDateSegment
			data-slot="date-picker-segment"
			className={composeTailwindRenderProps(className, datePickerSegmentVariants())}
			{...props}
		/>
	);
};

/** Props for the {@link DatePickerTrigger} component. */
export type DatePickerTriggerProps = ButtonProps;

/** The button that opens the calendar popover of a {@link DatePicker}. */
export const DatePickerTrigger = ({
	className,
	variant = "ghost",
	size = "icon-sm",
	children,
	...props
}: DatePickerTriggerProps) => {
	return (
		<Button
			slot="trigger"
			data-slot="date-picker-trigger"
			variant={variant}
			size={size}
			className={composeTailwindRenderProps(className, "mr-0.5 shrink-0 text-muted-foreground")}
			{...props}
		>
			{children ?? <CalendarIcon />}
		</Button>
	);
};

/** Props for the {@link DatePickerPopover} component. */
export type DatePickerPopoverProps = React.ComponentProps<typeof AriaPopover>;

/**
 * The floating overlay of a {@link DatePicker} that holds the calendar.
 * Renders as a dialog, so pass an `aria-label` or `aria-labelledby` when composing it directly.
 */
export const DatePickerPopover = ({
	className,
	offset = 4,
	crossOffset = 0,
	...props
}: DatePickerPopoverProps) => {
	return (
		<AriaPopover
			data-slot="popover-content"
			offset={offset}
			crossOffset={crossOffset}
			className={composeTailwindRenderProps(className, [
				popoverVariants(),
				"w-fit overflow-hidden p-0",
			])}
			{...props}
		/>
	);
};
