import { getLocalTimeZone, today } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
	type CalendarGridProps,
} from "./calendar";

const meta = {
	component: Calendar,
	title: "Primitives/Calendar",
	parameters: {
		controls: { include: ["isDisabled", "isReadOnly", "selectionMode"] },
		docs: {
			controls: { include: ["isDisabled", "isReadOnly", "selectionMode"] },
			argTypes: { include: ["isDisabled", "isReadOnly", "selectionMode"] },
		},
	},
	argTypes: {
		isDisabled: { control: { type: "boolean" } },
		isReadOnly: { control: { type: "boolean" } },
		selectionMode: {
			control: { type: "select" },
			options: ["single", "multiple"],
		},
	},
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof Calendar>;

const renderGrid = (offset?: CalendarGridProps["offset"]) => (
	<CalendarGrid offset={offset}>
		<CalendarGridHeader>
			{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
		</CalendarGridHeader>
		<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
	</CalendarGrid>
);

/** A single-month calendar with a heading caption and previous/next navigation. */
export const Default: Story = {
	render: (props) => (
		<Calendar aria-label="Shot date" {...props}>
			<CalendarHeader>
				<CalendarPreviousButton />
				<CalendarHeading />
				<CalendarNextButton />
			</CalendarHeader>
			{renderGrid()}
		</Calendar>
	),
};

/** A caption with month and year dropdowns instead of a heading. */
export const DropdownCaption: Story = {
	render: (props) => (
		<Calendar aria-label="Shot date" {...props}>
			<CalendarHeader>
				<CalendarPreviousButton />
				<CalendarMonthPicker />
				<CalendarYearPicker />
				<CalendarNextButton />
			</CalendarHeader>
			{renderGrid()}
		</Calendar>
	),
};

/** Two months side by side, each with its own heading and grid. */
export const TwoMonths: Story = {
	render: (props) => (
		<Calendar aria-label="Shot date" visibleDuration={{ months: 2 }} {...props}>
			<CalendarHeader>
				<CalendarPreviousButton />
				<CalendarHeading offset={{ months: 0 }} />
				<CalendarHeading offset={{ months: 1 }} />
				<CalendarNextButton />
			</CalendarHeader>
			<div className="flex flex-col gap-4 md:flex-row">
				{renderGrid({ months: 0 })}
				{renderGrid({ months: 1 })}
			</div>
		</Calendar>
	),
};

/** Dates that fail `isDateUnavailable` are struck through and cannot be selected. */
export const UnavailableDates: Story = {
	render: (props) => (
		<Calendar
			aria-label="Shot date"
			defaultValue={today(getLocalTimeZone())}
			isDateUnavailable={(date) => date.day % 3 === 0}
			{...props}
		>
			<CalendarHeader>
				<CalendarPreviousButton />
				<CalendarHeading />
				<CalendarNextButton />
			</CalendarHeader>
			{renderGrid()}
		</Calendar>
	),
};

/** A disabled calendar ignores interaction and dims its cells. */
export const Disabled: Story = {
	args: { isDisabled: true },
	render: (props) => (
		<Calendar aria-label="Shot date" {...props}>
			<CalendarHeader>
				<CalendarPreviousButton />
				<CalendarHeading />
				<CalendarNextButton />
			</CalendarHeader>
			{renderGrid()}
		</Calendar>
	),
};
