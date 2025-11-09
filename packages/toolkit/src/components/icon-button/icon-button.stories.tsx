import { HeartIcon } from "@heroicons/react/24/solid";
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

export const Default: Story = {
	args: {
		"aria-label": "Like",
		children: <HeartIcon />,
		size: "sm",
	},
};
