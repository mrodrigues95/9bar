import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button";
import { Divider } from "./divider";

const meta = {
	title: "Divider",
	component: Divider,
	parameters: {
		controls: {
			disable: true,
		},
	},
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
	render: () => (
		<div className="w-96">
			<div className="p-4">Content above</div>
			<Divider orientation="horizontal" />
			<div className="p-4">Content below</div>
		</div>
	),
};

export const Vertical: Story = {
	render: () => (
		<div className="flex items-center">
			<div className="px-4">Left content</div>
			<Divider orientation="vertical" />
			<div className="px-4">Right content</div>
		</div>
	),
};

export const Middle: Story = {
	render: () => (
		<div className="w-96 rounded-lg border border-border">
			<div className="p-4">First item</div>
			<Divider variant="middle" />
			<div className="p-4">Second item</div>
			<Divider variant="middle" />
			<div className="p-4">Third item</div>
		</div>
	),
};

export const ListExample: Story = {
	render: () => (
		<div className="w-96 rounded-lg border border-border bg-white">
			<div className="flex items-center justify-between p-4">
				<div>
					<div className="font-medium text-sm">John Doe</div>
					<div className="text-muted text-xs">john@example.com</div>
				</div>
			</div>
			<Divider />
			<div className="flex items-center justify-between p-4">
				<div>
					<div className="font-medium text-sm">Jane Smith</div>
					<div className="text-muted text-xs">jane@example.com</div>
				</div>
			</div>
			<Divider />
			<div className="flex items-center justify-between p-4">
				<div>
					<div className="font-medium text-sm">Bob Johnson</div>
					<div className="text-muted text-xs">bob@example.com</div>
				</div>
			</div>
		</div>
	),
};

export const VerticalToolbar: Story = {
	render: () => (
		<div className="inline-flex items-center gap-2 rounded-lg border border-border bg-white p-2">
			<Button variant="ghost">Bold</Button>
			<Divider orientation="vertical" />
			<Button variant="ghost">Italic</Button>
			<Divider orientation="vertical" />
			<Button variant="ghost">Underline</Button>
		</div>
	),
};
