import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";
import { Description } from "../field/description";
import {
	Checkbox,
	CheckboxIcon,
	CheckboxIndicator,
	CheckboxRoot,
} from "./checkbox";

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

export const Default: Story = {
	args: {
		children: "Accept terms and conditions",
	},
	render: (props) => {
		return <Checkbox {...props} />;
	},
};

export const WithDescription: Story = {
	args: {
		...Default.args,
	},
	render: (props) => {
		const id = useId();

		return (
			<CheckboxRoot>
				<Checkbox {...props} aria-describedby={id} />
				<Description id={id}>
					By clicking this checkbox, you agree to the terms and conditions.
				</Description>
			</CheckboxRoot>
		);
	},
};

export const CustomIndicator: Story = {
	args: {
		...Default.args,
	},
	render: ({ children, ...props }) => {
		return (
			<Checkbox
				{...props}
				indicator={(renderProps) => (
					<CheckboxIndicator renderProps={renderProps}>
						<CheckboxIcon {...renderProps} />
					</CheckboxIndicator>
				)}
			>
				{children}
			</Checkbox>
		);
	},
};
