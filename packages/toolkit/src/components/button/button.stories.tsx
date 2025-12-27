import { PlusIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta = {
	component: Button,
	title: "Button",
	args: { children: "Press me!" },
	parameters: {
		controls: { include: ["children", "variant", "size", "isDisabled"] },
	},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: {
		size: "sm",
	},
};

export const WithIcon: Story = {
	args: {
		size: "sm",
	},
	render: (props) => (
		<Button {...props}>
			<PlusIcon />
			Create
		</Button>
	),
};

export const Variants: Story = {
	args: {
		isDisabled: false,
	},
	render: (props) => (
		<div className="flex items-center space-x-2">
			<Button variant="ghost" {...props}>
				Ghost
			</Button>
			<Button variant="danger" {...props}>
				Danger
			</Button>
			<Button variant="default" {...props}>
				Default
			</Button>
			<Button variant="outline" {...props}>
				Outline
			</Button>
			<Button variant="solid" {...props}>
				Solid
			</Button>
			<Button variant="solidBlue" {...props}>
				Solid Blue
			</Button>
			<Button variant="link" {...props}>
				Link
			</Button>
		</div>
	),
};
