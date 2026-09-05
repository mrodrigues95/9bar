import type { Meta, StoryObj } from "@storybook/react-vite";
import { User } from "lucide-react";
import { IconButton } from "./icon-button";

const meta = {
	component: IconButton,
	title: "IconButton",
	parameters: {
		controls: { include: ["variant", "size", "isDisabled"] },
		docs: {
			controls: { include: ["variant", "size", "isDisabled"] },
			argTypes: { include: ["variant", "size", "isDisabled"] },
		},
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["default", "outline", "secondary", "ghost", "destructive", "link"],
		},
		size: {
			control: { type: "select" },
			options: ["md", "xs", "sm", "lg"],
		},
		isDisabled: { control: { type: "boolean" } },
	},
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Renders a ghost icon button at medium size. Use the controls to explore variant, size, and disabled states. */
export const Default: Story = {
	args: {
		"aria-label": "User",
		children: <User />,
		size: "md",
		variant: "ghost",
	},
};
