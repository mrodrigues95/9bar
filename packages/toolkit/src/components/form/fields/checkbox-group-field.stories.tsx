import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../../checkbox/checkbox";
import { CheckboxGroupField } from "./checkbox-group-field";

const meta = {
	component: CheckboxGroupField,
	title: "Form/CheckboxGroupField",
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
} satisfies Meta<typeof CheckboxGroupField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A checkbox group field with a label, description, and multiple checkbox options, showing the standard configuration. */
export const Primary: Story = {
	args: {
		label: "Favorite toppings",
		description: "Select your preferred toppings",
		children: (
			<>
				<Checkbox value="cheese">Cheese</Checkbox>
				<Checkbox value="pepperoni">Pepperoni</Checkbox>
				<Checkbox value="mushrooms">Mushrooms</Checkbox>
			</>
		),
	},
};

/** A checkbox group field in the disabled state, preventing all interaction. */
export const Disabled: Story = {
	args: { ...Primary.args, isDisabled: true },
};

/** A checkbox group field in the invalid state with a visible error message, such as when a minimum selection is not met. */
export const WithError: Story = {
	args: {
		...Primary.args,
		name: "toppings",
		isRequired: true,
		isInvalid: true,
		errorMessage: "Please select at least one topping.",
	},
};
