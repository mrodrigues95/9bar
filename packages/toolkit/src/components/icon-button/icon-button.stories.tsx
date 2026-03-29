import { UserIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "./icon-button";

const meta = {
	component: IconButton,
	title: "IconButton",
	parameters: {
		controls: { include: ["variant", "size", "isDisabled"] },
	},
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Renders a ghost icon button at medium size. Use the controls to explore variant, size, and disabled states. */
export const Default: Story = {
	args: {
		"aria-label": "User",
		children: <UserIcon />,
		size: "md",
		variant: "ghost",
	},
};
