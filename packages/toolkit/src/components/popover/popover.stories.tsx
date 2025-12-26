import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DialogTrigger } from "react-aria-components";
import { IconButton } from "../icon-button/icon-button";
import { Popover } from "./popover";

const meta = {
	component: Popover,
	title: "Popover",
	parameters: {
		controls: {
			include: [
				"showArrow",
				"placement",
				"shouldFlip",
				"offset",
				"crossOffset",
			],
		},
	},
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
	args: {},
	render: (props) => (
		<DialogTrigger>
			<IconButton aria-label="Open settings">
				<AdjustmentsHorizontalIcon />
			</IconButton>
			<Popover {...props}>
				<div className="p-4">
					<p className="text-sm">This is a simple popover content.</p>
				</div>
			</Popover>
		</DialogTrigger>
	),
};
