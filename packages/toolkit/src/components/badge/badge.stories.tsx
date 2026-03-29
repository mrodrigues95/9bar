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

/** A badge with default props, useful as a baseline for testing variant and size controls. */
export const Default: Story = {
	args: {
		size: "sm",
	},
};

/** Compares all available badge variants side by side: `default`, `outline`, `solid`, `success`, `warning`, `info`, and `danger`. */
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

/** A badge with a leading icon, demonstrating how SVG icons are sized automatically. */
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
