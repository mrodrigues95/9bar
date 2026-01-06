import { CheckIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta = {
	component: Badge,
	title: "Badge",
	args: { children: "Badge" },
	parameters: {
		controls: { include: ["children", "variant", "size"] },
	},
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
	args: {
		size: "sm",
	},
};

export const Variants: Story = {
	args: {
		size: "sm",
	},
	render: (props) => (
		<div className="flex items-center space-x-2">
			<Badge variant="default" {...props}>
				Default
			</Badge>
			<Badge variant="outline" {...props}>
				Outline
			</Badge>
			<Badge variant="solid" {...props}>
				Solid
			</Badge>
			<Badge variant="success" {...props}>
				Success
			</Badge>
			<Badge variant="warning" {...props}>
				Warning
			</Badge>
			<Badge variant="info" {...props}>
				Info
			</Badge>
			<Badge variant="danger" {...props}>
				Danger
			</Badge>
		</div>
	),
};

export const WithIcon: Story = {
	args: {
		size: "md",
	},
	render: (props) => (
		<Badge {...props}>
			<CheckIcon />
			Verified
		</Badge>
	),
};
