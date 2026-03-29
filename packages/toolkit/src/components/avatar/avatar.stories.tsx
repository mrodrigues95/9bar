import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar";

const meta = {
	component: Avatar,
	title: "Avatar",
	parameters: {
		layout: "centered",
		controls: { include: ["src", "alt", "name", "size", "color", "radius"] },
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An avatar displaying a user's profile image. Falls back to initials or a placeholder icon on load error. */
export const WithImage: Story = {
	args: {
		src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
		alt: "User avatar",
		name: "John Doe",
		size: "md",
	},
};

/** An avatar displaying initials derived from the user's name when no image is provided. */
export const WithInitials: Story = {
	args: {
		name: "John Doe",
		size: "md",
	},
};

/** An avatar showing the default user icon placeholder when neither an image nor a name is provided. */
export const DefaultPlaceholder: Story = {
	args: {
		size: "md",
	},
};

/** An avatar with custom placeholder content instead of the default user icon. */
export const CustomPlaceholder: Story = {
	args: {
		size: "md",
		placeholder: "?",
	},
};

/** Demonstrates the fallback behavior when an image URL fails to load, showing initials derived from the name. */
export const ImageError: Story = {
	args: {
		src: "https://invalid-url-that-will-fail.com/image.jpg",
		name: "Jane Smith",
		size: "md",
	},
};

/** Demonstrates the fallback behavior when an image URL fails to load and no name is provided, showing the placeholder icon. */
export const ImageErrorNoName: Story = {
	args: {
		src: "https://invalid-url-that-will-fail.com/image.jpg",
		size: "md",
	},
};

/** Compares all available avatar sizes side by side: `xs`, `sm`, `md`, and `lg`. */
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

/** Compares all available color options for initials avatars: `slate`, `sky`, `emerald`, and `rose`. */
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

/** Compares all available border radius options: `none`, `sm`, `md`, `lg`, and `full`. */
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

/** Placeholder avatars in different colors, showing how the placeholder icon adapts to the color scheme. */
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
