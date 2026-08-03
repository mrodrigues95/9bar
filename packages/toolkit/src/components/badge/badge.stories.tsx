import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check } from "lucide-react";
import { Badge } from "./badge";

const meta = {
	component: Badge,
	title: "Badge",
	args: { children: "Badge" },
	parameters: {
		controls: { include: ["children", "variant"] },
	},
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof Badge>;

/** A badge with default props, useful as a baseline for testing variant controls. */
export const Default: Story = {};

/** Compares all available badge variants side by side: `default`, `secondary`, `destructive`, `outline`, `ghost`, and `link`. */
export const Variants: Story = {
	render: (props) => (
		<div className="flex items-center space-x-2">
			<Badge variant="default" {...props}>
				Default
			</Badge>
			<Badge variant="secondary" {...props}>
				Secondary
			</Badge>
			<Badge variant="destructive" {...props}>
				Destructive
			</Badge>
			<Badge variant="outline" {...props}>
				Outline
			</Badge>
			<Badge variant="ghost" {...props}>
				Ghost
			</Badge>
			<Badge variant="link" {...props}>
				Link
			</Badge>
		</div>
	),
};

/** A badge with a leading icon, demonstrating how SVG icons are sized automatically. */
export const WithIcon: Story = {
	render: (props) => (
		<Badge {...props}>
			<Check />
			Verified
		</Badge>
	),
};
