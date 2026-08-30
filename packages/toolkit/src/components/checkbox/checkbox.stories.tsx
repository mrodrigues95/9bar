import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";

const meta = {
	component: Checkbox,
	title: "Checkbox",
	args: { children: "Press me!" },
	parameters: {
		controls: {
			include: ["isDisabled", "isReadOnly", "isIndeterminate", "isInvalid"],
		},
		docs: {
			controls: {
				include: ["isDisabled", "isReadOnly", "isIndeterminate", "isInvalid"],
			},
			argTypes: {
				include: ["isDisabled", "isReadOnly", "isIndeterminate", "isInvalid"],
			},
		},
	},
	argTypes: {
		isDisabled: { control: { type: "boolean" } },
		isReadOnly: { control: { type: "boolean" } },
		isIndeterminate: { control: { type: "boolean" } },
		isInvalid: { control: { type: "boolean" } },
	},
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof Checkbox>;

/** A checkbox with a text label, demonstrating the default checked/unchecked toggle behavior. */
export const Default: Story = {
	args: {
		children: "Accept terms and conditions",
	},
};

/** A checkbox in the indeterminate state, shown when only a subset of related options is selected. */
export const Indeterminate: Story = {
	args: {
		isIndeterminate: true,
		children: "Select all",
	},
};

/** A checkbox that is disabled and cannot be toggled. */
export const Disabled: Story = {
	args: {
		isDisabled: true,
		children: "Accept terms and conditions",
	},
};

/** A checkbox in the invalid state, styled to indicate a validation error. */
export const Invalid: Story = {
	args: {
		isInvalid: true,
		children: "Accept terms and conditions",
	},
};
