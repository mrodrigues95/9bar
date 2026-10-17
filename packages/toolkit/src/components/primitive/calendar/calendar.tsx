import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type * as React from "react";
import type { CalendarMonthPickerAria, CalendarYearPickerAria } from "react-aria";
import {
	Calendar as AriaCalendar,
	CalendarCell as AriaCalendarCell,
	CalendarGrid as AriaCalendarGrid,
	CalendarGridBody as AriaCalendarGridBody,
	CalendarGridHeader as AriaCalendarGridHeader,
	CalendarHeaderCell as AriaCalendarHeaderCell,
	CalendarHeading as AriaCalendarHeading,
	CalendarMonthPicker as AriaCalendarMonthPicker,
	CalendarYearPicker as AriaCalendarYearPicker,
	composeRenderProps,
	type CalendarCellProps as AriaCalendarCellProps,
	type CalendarGridBodyProps as AriaCalendarGridBodyProps,
	type CalendarGridHeaderProps as AriaCalendarGridHeaderProps,
	type CalendarGridProps as AriaCalendarGridProps,
	type CalendarHeaderCellProps as AriaCalendarHeaderCellProps,
	type CalendarHeadingProps as AriaCalendarHeadingProps,
	type CalendarMonthPickerProps as AriaCalendarMonthPickerProps,
	type CalendarProps as AriaCalendarProps,
	type CalendarYearPickerProps as AriaCalendarYearPickerProps,
	type DateValue,
} from "react-aria-components";
import { Button, ButtonProps, buttonVariants } from "#components/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectList,
	SelectTrigger,
	SelectValue,
} from "#components/select";
import { cn, composeTailwindRenderProps } from "#lib/utils";
import { calendarCellVariants, calendarVariants } from "./styles";

/** Props for the {@link Calendar} component. */
export type CalendarProps<TValue extends DateValue> = AriaCalendarProps<TValue>;

/**
 * A calendar displays a grid of dates and lets a user select one. Compose
 * {@link CalendarHeader}, {@link CalendarGrid}, and {@link CalendarCell}
 * inside; use {@link CalendarMonthPicker} and {@link CalendarYearPicker} in the
 * header for a dropdown caption.
 */
export const Calendar = <TValue extends DateValue>({
	className,
	...props
}: CalendarProps<TValue>) => {
	return (
		<AriaCalendar
			data-slot="calendar"
			className={composeTailwindRenderProps(className, calendarVariants())}
			{...props}
		/>
	);
};

/** Props for the {@link CalendarHeader} component. */
export type CalendarHeaderProps = React.ComponentProps<"div">;

/** The caption row of a {@link Calendar}, holding the navigation buttons and the heading or month/year dropdowns. */
export const CalendarHeader = ({ className, ...props }: CalendarHeaderProps) => {
	return (
		<div
			data-slot="calendar-header"
			className={cn("flex items-center gap-1", className)}
			{...props}
		/>
	);
};

/** Props for the {@link CalendarHeading} component. */
export type CalendarHeadingProps = AriaCalendarHeadingProps;

/** The formatted month and year caption of a {@link Calendar}. */
export const CalendarHeading = ({ className, ...props }: CalendarHeadingProps) => {
	return (
		<AriaCalendarHeading
			data-slot="calendar-heading"
			className={cn("flex-1 text-center text-sm font-medium select-none", className)}
			{...props}
		/>
	);
};

/** Props for the {@link CalendarPreviousButton} component. */
export type CalendarPreviousButtonProps = ButtonProps;

/** The button that pages a {@link Calendar} to the previous month. Pass `children` to replace the default chevron icon. */
export const CalendarPreviousButton = ({
	className,
	variant = "ghost",
	children,
	...props
}: CalendarPreviousButtonProps) => {
	return (
		<Button
			slot="previous"
			data-slot="calendar-previous-button"
			variant={variant}
			className={composeTailwindRenderProps(className, [
				"size-(--cell-size) shrink-0 p-0 select-none aria-disabled:opacity-50",
			])}
			{...props}
		>
			{children ?? <ChevronLeftIcon className="size-4" />}
		</Button>
	);
};

/** Props for the {@link CalendarNextButton} component. */
export type CalendarNextButtonProps = ButtonProps;

/** The button that pages a {@link Calendar} to the next month. Pass `children` to replace the default chevron icon. */
export const CalendarNextButton = ({
	className,
	variant = "ghost",
	children,
	...props
}: CalendarNextButtonProps) => {
	return (
		<Button
			slot="next"
			data-slot="calendar-next-button"
			variant={variant}
			className={composeTailwindRenderProps(className, [
				"size-(--cell-size) shrink-0 p-0 select-none aria-disabled:opacity-50",
			])}
			{...props}
		>
			{children ?? <ChevronRightIcon className="size-4" />}
		</Button>
	);
};

/** The render props React Aria hands to the month and year picker render functions. */
interface CalendarPickerProps {
	className?: string;
	picker: CalendarMonthPickerAria | CalendarYearPickerAria;
}

/** A caption dropdown for a calendar month or year, rendered as a {@link Select}. */
const CalendarPicker = ({ className, picker }: CalendarPickerProps) => (
	<Select
		aria-label={picker["aria-label"]}
		selectedKey={picker.value}
		onSelectionChange={picker.onChange}
		className={cn("flex-1", className)}
	>
		<SelectTrigger size="sm">
			<SelectValue />
		</SelectTrigger>
		<SelectContent>
			<SelectList>
				{picker.items.map((item) => (
					<SelectItem key={item.id} id={item.id}>
						{item.formatted}
					</SelectItem>
				))}
			</SelectList>
		</SelectContent>
	</Select>
);

/** Props for the {@link CalendarMonthPicker} component. */
export type CalendarMonthPickerProps = Omit<AriaCalendarMonthPickerProps, "children"> & {
	className?: string;
};

/** A dropdown for picking the month of a {@link Calendar} caption. */
export const CalendarMonthPicker = ({ className, ...props }: CalendarMonthPickerProps) => {
	return (
		<AriaCalendarMonthPicker {...props}>
			{(picker) => <CalendarPicker picker={picker} className={className} />}
		</AriaCalendarMonthPicker>
	);
};

/** Props for the {@link CalendarYearPicker} component. */
export type CalendarYearPickerProps = Omit<AriaCalendarYearPickerProps, "children"> & {
	className?: string;
};

/** A dropdown for picking the year of a {@link Calendar} caption. */
export const CalendarYearPicker = ({ className, ...props }: CalendarYearPickerProps) => {
	return (
		<AriaCalendarYearPicker {...props}>
			{(picker) => <CalendarPicker picker={picker} className={className} />}
		</AriaCalendarYearPicker>
	);
};

/** Props for the {@link CalendarGrid} component. */
export type CalendarGridProps = AriaCalendarGridProps;

/** The grid of weeks and days for a single month of a {@link Calendar}. */
export const CalendarGrid = ({ className, ...props }: CalendarGridProps) => {
	return (
		<AriaCalendarGrid
			data-slot="calendar-grid"
			className={cn("w-full border-collapse", className)}
			{...props}
		/>
	);
};

/** Props for the {@link CalendarGridHeader} component. */
export type CalendarGridHeaderProps = AriaCalendarGridHeaderProps;

/** The row of weekday names at the top of a {@link CalendarGrid}. */
export const CalendarGridHeader = ({ className, ...props }: CalendarGridHeaderProps) => {
	return (
		<AriaCalendarGridHeader data-slot="calendar-grid-header" className={className} {...props} />
	);
};

/** Props for the {@link CalendarGridBody} component. */
export type CalendarGridBodyProps = AriaCalendarGridBodyProps;

/** The body of a {@link CalendarGrid} that renders a {@link CalendarCell} for each date. */
export const CalendarGridBody = ({ className, ...props }: CalendarGridBodyProps) => {
	return <AriaCalendarGridBody data-slot="calendar-grid-body" className={className} {...props} />;
};

/** Props for the {@link CalendarHeaderCell} component. */
export type CalendarHeaderCellProps = AriaCalendarHeaderCellProps;

/** A weekday name column header inside a {@link CalendarGridHeader}. */
export const CalendarHeaderCell = ({ className, ...props }: CalendarHeaderCellProps) => {
	return (
		<AriaCalendarHeaderCell
			data-slot="calendar-header-cell"
			className={cn(
				"rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link CalendarCell} component. */
export type CalendarCellProps = AriaCalendarCellProps;

/** A selectable date cell inside a {@link CalendarGridBody}. */
export const CalendarCell = ({ className, children, ...props }: CalendarCellProps) => {
	return (
		<AriaCalendarCell
			data-slot="calendar-cell"
			className={composeRenderProps(className, (className, renderProps) =>
				cn(calendarCellVariants(renderProps), className),
			)}
			{...props}
		>
			{composeRenderProps(children, (children, renderProps) => (
				<div
					data-selected={renderProps.isSelected || undefined}
					className={cn(buttonVariants({ variant: "ghost", size: "icon" }), [
						"relative isolate z-10 flex aspect-square h-full w-full min-w-(--cell-size)",
						"flex-col gap-1 border-0 leading-none font-normal",
						"group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
						"group-data-[focused=true]/day:border-ring",
						"group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50",
						"data-selected:bg-primary data-selected:text-primary-foreground",
						"dark:hover:text-foreground",
						"[&>span]:text-xs [&>span]:opacity-70",
					])}
				>
					{children ?? renderProps.defaultChildren}
				</div>
			))}
		</AriaCalendarCell>
	);
};
