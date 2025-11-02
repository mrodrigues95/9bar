import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar";

const meta = {
	component: Avatar,
	parameters: {
		layout: "centered",
		controls: { include: ["src", "alt", "name", "size", "color", "radius"] },
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
	args: {
		src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
		alt: "User avatar",
		name: "John Doe",
		size: "md",
	},
};

export const WithInitials: Story = {
	args: {
		name: "John Doe",
		size: "md",
	},
};

export const DefaultPlaceholder: Story = {
	args: {
		size: "md",
	},
};

export const CustomPlaceholder: Story = {
	args: {
		size: "md",
		placeholder: "?",
	},
};

export const ImageError: Story = {
	args: {
		src: "https://invalid-url-that-will-fail.com/image.jpg",
		name: "Jane Smith",
		size: "md",
	},
};

export const ImageErrorNoName: Story = {
	args: {
		src: "https://invalid-url-that-will-fail.com/image.jpg",
		size: "md",
	},
};

export const AllSizes: Story = {
	render: () => (
		<div className="flex items-end gap-4">
			<Avatar name="John Doe" size="xs" />
			<Avatar name="John Doe" size="sm" />
			<Avatar name="John Doe" size="md" />
			<Avatar name="John Doe" size="lg" />
		</div>
	),
};

export const MixedStates: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar
				src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
				name="John Doe"
				size="md"
			/>
			<Avatar name="Jane Smith" size="md" />
			<Avatar size="md" alt="foo" />
		</div>
	),
};

export const AllColors: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar name="John Doe" size="lg" color="slate" />
			<Avatar name="Jane Smith" size="lg" color="sky" />
			<Avatar name="Bob Johnson" size="lg" color="emerald" />
			<Avatar name="Alice Williams" size="lg" color="rose" />
		</div>
	),
};

export const AllRadius: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar name="JD" size="lg" radius="none" />
			<Avatar name="JS" size="lg" radius="sm" />
			<Avatar name="BJ" size="lg" radius="md" />
			<Avatar name="AW" size="lg" radius="lg" />
			<Avatar name="MR" size="lg" radius="full" />
		</div>
	),
};

export const ColoredPlaceholders: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Avatar size="lg" color="slate" />
			<Avatar size="lg" color="sky" />
			<Avatar size="lg" color="emerald" />
			<Avatar size="lg" color="rose" />
		</div>
	),
};
