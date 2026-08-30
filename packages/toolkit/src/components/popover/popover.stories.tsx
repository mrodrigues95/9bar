import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings2 } from "lucide-react";
import { DialogTrigger } from "react-aria-components";
import { IconButton } from "../icon-button/icon-button";
import { Popover } from "./popover";

const meta = {
	component: Popover,
	title: "Popover",
	parameters: {
		controls: {
			include: ["placement", "shouldFlip", "offset", "crossOffset"],
		},
		docs: {
			controls: {
				include: ["placement", "shouldFlip", "offset", "crossOffset"],
			},
			argTypes: {
				include: ["placement", "shouldFlip", "offset", "crossOffset"],
			},
		},
	},
	argTypes: {
		placement: {
			control: { type: "select" },
			options: [
				"bottom",
				"top",
				"left",
				"right",
				"bottom start",
				"bottom end",
				"top start",
				"top end",
				"start",
				"end",
			],
		},
		shouldFlip: { control: { type: "boolean" } },
		offset: { control: { type: "number" } },
		crossOffset: { control: { type: "number" } },
	},
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof Popover>;

/** Opens a basic popover from an icon button trigger. Use the controls to toggle the arrow, placement, and offset. */
export const Default: Story = {
	args: {},
	render: (props) => (
		<DialogTrigger>
			<IconButton aria-label="Open settings" variant="ghost">
				<Settings2 />
			</IconButton>
			<Popover {...props}>
				<div className="p-4">
					<p className="text-sm">This is a simple popover content.</p>
				</div>
			</Popover>
		</DialogTrigger>
	),
};
