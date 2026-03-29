import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxField } from "./checkbox-field";

const meta = {
	component: CheckboxField,
	title: "Form/CheckboxField",
	parameters: {
		controls: {
			include: [
				"isDisabled",
				"isInvalid",
				"isReadOnly",
				"isRequired",
				"label",
				"description",
			],
		},
	},
} satisfies Meta<typeof CheckboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A checkbox field with a label and description, showing the standard configuration. */
export const Primary: Story = {
	args: {
		label: "Newsletter subscription",
		description: "I agree to receive newsletters",
	},
};

/** A checkbox field in the disabled state, preventing all interaction. */
export const Disabled: Story = {
	args: { ...Primary.args, isDisabled: true },
};

/** A checkbox field in the invalid state with a visible error message, such as when a required agreement is not checked. */
export const WithError: Story = {
	args: {
		...Primary.args,
		name: "foo",
		isRequired: true,
		isInvalid: true,
		errorMessage: "You must agree to continue.",
	},
};
