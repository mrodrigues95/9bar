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

export const Variants: Story = {
	args: {},
	render: () => (
		<div className="flex items-center space-x-2">
			<Button variant="ghost">Ghost</Button>
			<Button variant="danger">Danger</Button>
			<Button variant="default">Default</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="solid">Solid</Button>
			<Button variant="solidBlue">Solid Blue</Button>
			<Button variant="link">Link</Button>
		</div>
	),
};
