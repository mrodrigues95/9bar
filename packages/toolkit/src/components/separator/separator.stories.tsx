import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button";
import { Separator } from "./separator";

const meta = {
	title: "Separator",
	component: Separator,
	parameters: {
		controls: { include: ["orientation"] },
		docs: {
			controls: { include: ["orientation"] },
			argTypes: { include: ["orientation"] },
		},
	},
	argTypes: {
		orientation: {
			control: { type: "select" },
			options: ["horizontal", "vertical"],
		},
	},
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A full-width horizontal rule between two content blocks. */
export const Horizontal: Story = {
	render: (props) => (
		<div className="w-96">
			<div className="p-4">Content above</div>
			<Separator {...props} orientation="horizontal" />
			<div className="p-4">Content below</div>
		</div>
	),
};

/** A vertical rule dividing two side-by-side content blocks. */
export const Vertical: Story = {
	render: (props) => (
		<div className="flex items-center">
			<div className="px-4">Left content</div>
			<Separator {...props} orientation="vertical" />
			<div className="px-4">Right content</div>
		</div>
	),
};

/** A contact list where separators divide individual records inside a card. */
export const ListExample: Story = {
	render: (props) => (
		<div className="w-96 rounded-lg border border-border bg-white">
			<div className="flex items-center justify-between p-4">
				<div>
					<div className="font-medium text-sm">John Doe</div>
					<div className="text-muted-foreground text-xs">john@example.com</div>
				</div>
			</div>
			<Separator {...props} />
			<div className="flex items-center justify-between p-4">
				<div>
					<div className="font-medium text-sm">Jane Smith</div>
					<div className="text-muted-foreground text-xs">jane@example.com</div>
				</div>
			</div>
			<Separator {...props} />
			<div className="flex items-center justify-between p-4">
				<div>
					<div className="font-medium text-sm">Bob Johnson</div>
					<div className="text-muted-foreground text-xs">bob@example.com</div>
				</div>
			</div>
		</div>
	),
};

/** Vertical separators between toolbar buttons, showing how to split action groups. */
export const VerticalToolbar: Story = {
	render: (props) => (
		<div className="inline-flex items-center gap-2 rounded-lg border border-border bg-white p-2">
			<Button variant="ghost">Bold</Button>
			<Separator {...props} orientation="vertical" />
			<Button variant="ghost">Italic</Button>
			<Separator {...props} orientation="vertical" />
			<Button variant="ghost">Underline</Button>
		</div>
	),
};
