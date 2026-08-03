import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlusIcon } from "lucide-react";
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

/** A button with default props, useful as a baseline for testing variant and size controls. */
export const Default: Story = {
	args: {
		size: "sm",
	},
};

/** Compares all available button variants side by side: `default`, `secondary`, `outline`, `ghost`, `destructive`, and `link`. */
export const Variants: Story = {
	args: {
		isDisabled: false,
	},
	render: (props) => (
		<div className="flex items-center space-x-2">
			<Button variant="default" {...props}>
				Default
			</Button>
			<Button variant="secondary" {...props}>
				Secondary
			</Button>
			<Button variant="outline" {...props}>
				Outline
			</Button>
			<Button variant="ghost" {...props}>
				Ghost
			</Button>
			<Button variant="destructive" {...props}>
				Destructive
			</Button>
			<Button variant="link" {...props}>
				Link
			</Button>
		</div>
	),
};

/** A button with a leading icon, demonstrating how SVG icons are sized and aligned automatically. */
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
