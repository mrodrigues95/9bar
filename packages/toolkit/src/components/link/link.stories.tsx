import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./link";

const meta = {
	component: Link,
	title: "Link",
	args: { children: "Press me!", href: "#" },
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
			options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
		},
		isDisabled: { control: { type: "boolean" } },
	},
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof Link>;

/** Renders the default link variant. Use the controls to switch between button-style variants, sizes, and disabled states. */
export const Primary: Story = {
	args: {},
};
