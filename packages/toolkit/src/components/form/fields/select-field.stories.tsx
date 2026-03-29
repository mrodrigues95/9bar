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

/** A select field with a label and a list of options, showing the minimal required configuration. */
export const Primary: Story = {
	args: {
		items,
		label: "Favorite Fruit",
	},
};

/** A select field with help text below the trigger, providing additional guidance to the user. */
export const WithDescription: Story = {
	args: {
		...Primary.args,
		description: "Please select your favorite fruit from the list.",
	},
};

/** A select field with placeholder text displayed when no option is selected. */
export const WithPlaceholder: Story = {
	args: {
		...Primary.args,
		placeholder: "Choose a fruit...",
	},
};

/** A select field in the disabled state, preventing all interaction. */
export const Disabled: Story = {
	args: {
		...Primary.args,
		isDisabled: true,
	},
};

/** A required select field, displaying the required indicator on the label. */
export const Required: Story = {
	args: {
		...Primary.args,
		isRequired: true,
	},
};

/** A select field in the invalid state with a visible error message. */
export const WithError: Story = {
	args: {
		...Primary.args,
		errorMessage: "Please select a fruit.",
		isInvalid: true,
	},
};
