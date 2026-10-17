import { CalendarDate, CalendarDateTime, getLocalTimeZone, today } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
} from "../calendar/calendar";
import { FieldLabel } from "../field/field";
import {
	DatePicker,
	DatePickerGroup,
	DatePickerInput,
	DatePickerPopover,
	DatePickerSegment,
	DatePickerTrigger,
	type DatePickerProps,
} from "./date-picker";

const meta = {
	component: DatePicker,
	title: "Primitives/DatePicker",
	parameters: {
		controls: {
			include: ["granularity", "hourCycle", "hideTimeZone", "isDisabled", "isReadOnly"],
		},
		docs: {
			controls: {
				include: ["granularity", "hourCycle", "hideTimeZone", "isDisabled", "isReadOnly"],
			},
			argTypes: {
				include: ["granularity", "hourCycle", "hideTimeZone", "isDisabled", "isReadOnly"],
			},
		},
	},
	argTypes: {
		granularity: {
			control: { type: "select" },
			options: ["day", "hour", "minute", "second"],
		},
		hourCycle: {
			control: { type: "select" },
			options: ["h11", "h12", "h23", "h24"],
		},
		hideTimeZone: { control: { type: "boolean" } },
		isDisabled: { control: { type: "boolean" } },
		isReadOnly: { control: { type: "boolean" } },
	},
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof DatePicker>;

const renderCalendar = (captionLayout: "label" | "dropdown" = "label") => (
	<Calendar>
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
);

const renderInput = () => (
	<DatePickerGroup>
		<DatePickerInput>{(segment) => <DatePickerSegment segment={segment} />}</DatePickerInput>
		<DatePickerTrigger />
	</DatePickerGroup>
);

const renderPicker = <TValue extends DateValue>(
	props: DatePickerProps<TValue>,
	captionLayout: "label" | "dropdown" = "label",
) => (
	<DatePicker {...props}>
		<FieldLabel>Shot time</FieldLabel>
		{renderInput()}
		<DatePickerPopover aria-label="Shot time calendar">
			{renderCalendar(captionLayout)}
		</DatePickerPopover>
	</DatePicker>
);

/** A date and time picker with minute granularity, opening a single-month calendar. */
export const Default: Story = {
	args: {
		defaultValue: new CalendarDateTime(2026, 10, 12, 9, 30),
		granularity: "minute",
	},
	render: (props) => renderPicker(props),
};

/** A date-only picker for values without a time component. */
export const DateOnly: Story = {
	args: {
		defaultValue: new CalendarDate(2026, 10, 12),
	},
	render: (props) => renderPicker(props),
};

/** A caption with month and year dropdowns inside the popover. */
export const DropdownCaption: Story = {
	args: {
		defaultValue: new CalendarDateTime(2026, 10, 12, 9, 30),
		granularity: "minute",
	},
	render: (props) => renderPicker(props, "dropdown"),
};

/** Dates outside `minValue` and `maxValue` cannot be selected. */
export const MinMax: Story = {
	args: {
		defaultValue: new CalendarDateTime(2026, 10, 12, 9, 30),
		granularity: "minute",
		minValue: today(getLocalTimeZone()),
		maxValue: today(getLocalTimeZone()).add({ weeks: 2 }),
	},
	render: (props) => renderPicker(props),
};

/** An invalid, required picker renders the invalid ring and marks the segments. */
export const Invalid: Story = {
	args: {
		isInvalid: true,
		isRequired: true,
	},
	render: (props) => (
		<DatePicker {...props}>
			<FieldLabel>Shot time</FieldLabel>
			{renderInput()}
			<DatePickerPopover aria-label="Shot time calendar">{renderCalendar()}</DatePickerPopover>
		</DatePicker>
	),
};

/** A disabled picker ignores interaction and dims its segments. */
export const Disabled: Story = {
	args: {
		isDisabled: true,
		defaultValue: new CalendarDateTime(2026, 10, 12, 9, 30),
		granularity: "minute",
	},
	render: (props) => renderPicker(props),
};
