import { CalendarDateTime, parseDateTime } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DatePickerField, type DatePickerValueCodec } from "./date-picker-field";

const meta = {
	component: DatePickerField,
	title: "Composed/Form/DatePickerField",
	parameters: {
		controls: {
			include: [
				"label",
				"description",
				"isDisabled",
				"isInvalid",
				"isReadOnly",
				"isRequired",
				"captionLayout",
				"granularity",
			],
		},
		docs: {
			controls: {
				include: [
					"label",
					"description",
					"isDisabled",
					"isInvalid",
					"isReadOnly",
					"isRequired",
					"captionLayout",
					"granularity",
				],
			},
			argTypes: {
				include: [
					"label",
					"description",
					"isDisabled",
					"isInvalid",
					"isReadOnly",
					"isRequired",
					"captionLayout",
					"granularity",
				],
			},
		},
	},
	argTypes: {
		label: { control: { type: "text" } },
		description: { control: { type: "text" } },
		isDisabled: { control: { type: "boolean" } },
		isInvalid: { control: { type: "boolean" } },
		isReadOnly: { control: { type: "boolean" } },
		isRequired: { control: { type: "boolean" } },
		captionLayout: {
			control: { type: "select" },
			options: ["label", "dropdown"],
		},
		granularity: {
			control: { type: "select" },
			options: ["day", "hour", "minute", "second"],
		},
	},
} satisfies Meta<typeof DatePickerField>;

export default meta;

type Story = StoryObj<typeof DatePickerField>;

/** A date and time field with a label and a calendar popover. */
export const Primary: Story = {
	args: {
		label: "Time",
		granularity: "minute",
		value: new CalendarDateTime(2026, 10, 12, 9, 30),
	},
};

/** A date field with help text below the control. */
export const WithDescription: Story = {
	args: {
		...Primary.args,
		description: "When this shot was pulled.",
	},
};

/** A required date field, displaying the required indicator on the label. */
export const Required: Story = {
	args: {
		...Primary.args,
		isRequired: true,
	},
};

/** An invalid date field with a visible error message. */
export const WithError: Story = {
	args: {
		...Primary.args,
		isInvalid: true,
		errorMessage: "Choose a date within the last 30 days.",
	},
};

/** A date field in the disabled state, preventing all interaction. */
export const Disabled: Story = {
	args: {
		...Primary.args,
		isDisabled: true,
	},
};

/** A date field in the read-only state, displaying a value that cannot be edited. */
export const Readonly: Story = {
	args: {
		...Primary.args,
		isReadOnly: true,
	},
};

/** A calendar caption with month and year dropdowns instead of a heading. */
export const DropdownCaption: Story = {
	args: {
		...Primary.args,
		captionLayout: "dropdown",
	},
};

const dateTimeLocalCodec: DatePickerValueCodec<CalendarDateTime, string> = {
	parse: (value) => (value ? parseDateTime(value) : null),
	format: (value) => (value ? value.toString().slice(0, 16) : ""),
};

/** A field bound to a `datetime-local` string value through a parse/format codec. */
export const WithCodec: Story = {
	render: () => {
		const [value, setValue] = useState("2026-10-12T09:30");

		return (
			<DatePickerField
				label="Time"
				description="Bound to a datetime-local string through a codec."
				granularity="minute"
				value={value}
				onChange={setValue}
				codec={dateTimeLocalCodec}
			/>
		);
	},
};
