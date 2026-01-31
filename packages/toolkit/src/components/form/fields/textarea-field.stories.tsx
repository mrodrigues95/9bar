import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextareaField } from "./textarea-field";

const meta = {
	component: TextareaField,
	title: "Form/TextareaField",
	parameters: {
		layout: "padded",
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
} satisfies Meta<typeof TextareaField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		label: "Name",
		description: "Enter your full name",
		textareaProps: { placeholder: "John Doe" },
	},
};
