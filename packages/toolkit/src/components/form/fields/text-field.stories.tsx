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

export const Primary: Story = {
	args: { label: "Name" },
};

export const WithDescription: Story = {
	args: {
		...Primary.args,
		description: "Name must be at least 8 characters long.",
		isDisabled: false,
	},
};

export const WithPlaceholder: Story = {
	args: { ...Primary.args, inputProps: { placeholder: "Enter your name" } },
};

export const Disabled: Story = {
	args: { ...Primary.args, isDisabled: true },
};

export const Readonly: Story = {
	args: { ...Primary.args, isReadOnly: true, defaultValue: "John Doe" },
};

export const Required: Story = {
	args: { ...Primary.args, isRequired: true },
};

export const WithError: Story = {
	args: {
		...Primary.args,
		errorMessage: "Please fill out this field.",
		isInvalid: true,
	},
};
