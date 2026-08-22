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
				"label",
				"description",
			],
		},
		docs: {
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
			argTypes: {
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
	},
	argTypes: {
		isDisabled: { control: { type: "boolean" } },
		isInvalid: { control: { type: "boolean" } },
		isReadOnly: { control: { type: "boolean" } },
		isRequired: { control: { type: "boolean" } },
		label: { control: { type: "text" } },
		description: { control: { type: "text" } },
	},
} satisfies Meta<typeof TextareaField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A textarea field with a label, description, and placeholder, showing the standard configuration. */
export const Primary: Story = {
	args: {
		label: "Name",
		description: "Enter your full name",
		textareaProps: { placeholder: "John Doe" },
	},
};
