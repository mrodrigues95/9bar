import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";
import { FieldDescription } from "../field/field";
import { Checkbox } from "./checkbox";

const meta = {
	component: Checkbox,
	title: "Checkbox",
	args: { children: "Press me!" },
	parameters: {
		controls: {
			include: ["isDisabled", "isReadOnly", "isIndeterminate", "isInvalid"],
		},
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

/** A checkbox with a description below the label, linked via `aria-describedby`. */
export const WithDescription: Story = {
	args: {
		children: "Accept terms and conditions",
	},
	render: (props) => {
		const id = useId();

		return (
			<div className="flex flex-col gap-1">
				<Checkbox {...props} aria-describedby={id} />
				<FieldDescription id={id}>
					By clicking this checkbox, you agree to the terms and conditions.
				</FieldDescription>
			</div>
		);
	},
};
