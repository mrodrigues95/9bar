import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectItem } from "../../select/select";
import { SelectField, type SelectFieldProps } from "./select-field";

const items = [
	{ id: "apple", name: "Apple" },
	{ id: "banana", name: "Banana" },
	{ id: "orange", name: "Orange" },
	{ id: "grape", name: "Grape" },
	{ id: "watermelon", name: "Watermelon" },
];

const meta = {
	component: SelectField,
	title: "Form/SelectField",
	parameters: {
		controls: {
			include: [
				"isDisabled",
				"isInvalid",
				"isRequired",
				"placeholder",
				"label",
				"description",
			],
		},
	},
	args: {
		children: (item) => <SelectItem id={item.name}>{item.name}</SelectItem>,
	},
} satisfies Meta<SelectFieldProps<(typeof items)[number]>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		items,
		label: "Favorite Fruit",
	},
};

export const WithDescription: Story = {
	args: {
		...Primary.args,
		description: "Please select your favorite fruit from the list.",
	},
};

export const WithPlaceholder: Story = {
	args: {
		...Primary.args,
		placeholder: "Choose a fruit...",
	},
};

export const Disabled: Story = {
	args: {
		...Primary.args,
		isDisabled: true,
	},
};

export const Required: Story = {
	args: {
		...Primary.args,
		isRequired: true,
	},
};

export const WithError: Story = {
	args: {
		...Primary.args,
		errorMessage: "Please select a fruit.",
		isInvalid: true,
	},
};
