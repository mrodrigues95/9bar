import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./text-field";

const meta = {
	component: TextField,
	title: "Form/TextField",
	parameters: {
		controls: {
			include: [
				"isDisabled",
				"isInvalid",
				"isReadOnly",
				"isRequired",
				"placeholder",
				"label",
				"description",
			],
		},
	},
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A text field with a label, showing the minimal required configuration. */
export const Primary: Story = {
	args: { label: "Name" },
};

/** A text field with help text below the input, providing additional guidance to the user. */
export const WithDescription: Story = {
	args: {
		...Primary.args,
		description: "Name must be at least 8 characters long.",
		isDisabled: false,
	},
};

/** A text field with placeholder text inside the input. */
export const WithPlaceholder: Story = {
	args: { ...Primary.args, inputProps: { placeholder: "Enter your name" } },
};

/** A text field in the disabled state, preventing all interaction. */
export const Disabled: Story = {
	args: { ...Primary.args, isDisabled: true },
};

/** A text field in the read-only state, displaying a value that cannot be edited. */
export const Readonly: Story = {
	args: { ...Primary.args, isReadOnly: true, defaultValue: "John Doe" },
};

/** A required text field, displaying the required indicator on the label. */
export const Required: Story = {
	args: { ...Primary.args, isRequired: true },
};

/** A text field in the invalid state with a visible error message. */
export const WithError: Story = {
	args: {
		...Primary.args,
		errorMessage: "Please fill out this field.",
		isInvalid: true,
	},
};
