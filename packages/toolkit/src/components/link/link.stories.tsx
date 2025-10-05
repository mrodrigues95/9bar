import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./link";

const meta = {
	component: Link,
	title: "Link",
	args: { children: "Press me!", href: "#" },
	parameters: { controls: { include: ["variant", "size", "isDisabled"] } },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof Link>;

export const Primary: Story = {
	args: {},
};
