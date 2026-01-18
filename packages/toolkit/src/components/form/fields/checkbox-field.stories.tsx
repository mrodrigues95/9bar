import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxField } from "./checkbox-field";

const meta = {
	component: CheckboxField,
	title: "CheckboxField",
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

export const Primary: Story = {
	args: {
		label: "Newsletter subscription",
		description: "I agree to receive newsletters",
	},
};

export const Disabled: Story = {
	args: { ...Primary.args, isDisabled: true },
};

export const WithError: Story = {
	args: {
		...Primary.args,
		name: "foo",
		isRequired: true,
		isInvalid: true,
		errorMessage: "You must agree to continue.",
	},
};
