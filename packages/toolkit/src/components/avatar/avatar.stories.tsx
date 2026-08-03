import type { Meta, StoryObj } from "@storybook/react-vite";
import { Users } from "lucide-react";
import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "./avatar";

const meta = {
	component: Avatar,
	title: "Avatar",
	parameters: {
		layout: "centered",
		controls: { include: ["size"] },
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An avatar displaying a user's profile image, falling back to initials on load error. */
export const WithImage: Story = {
	render: () => (
		<Avatar>
			<AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" />
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
};

/** An avatar displaying initials derived from the user's name when no image is provided. */
export const WithInitials: Story = {
	render: () => (
		<Avatar>
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
};

/** An avatar showing a default user icon placeholder when neither an image nor a name is provided. */
export const DefaultPlaceholder: Story = {
	render: () => (
		<Avatar>
			<AvatarFallback>
				<Users />
			</AvatarFallback>
		</Avatar>
	),
};

/** An avatar with custom placeholder content instead of the default user icon. */
export const CustomPlaceholder: Story = {
	render: () => (
		<Avatar>
			<AvatarFallback>?</AvatarFallback>
		</Avatar>
	),
};

/** Demonstrates the fallback behavior when an image URL fails to load, showing initials derived from the name. */
export const ImageError: Story = {
	render: () => (
		<Avatar>
			<AvatarImage src="https://invalid-url-that-will-fail.com/image.jpg" />
			<AvatarFallback>JS</AvatarFallback>
		</Avatar>
	),
};

/** Demonstrates the fallback behavior when an image URL fails to load and no name is provided, showing the placeholder icon. */
export const ImageErrorNoName: Story = {
	render: () => (
		<Avatar>
			<AvatarImage src="https://invalid-url-that-will-fail.com/image.jpg" />
			<AvatarFallback>
				<Users />
			</AvatarFallback>
		</Avatar>
	),
};

/** Compares all available avatar sizes side by side: `default`, `sm`, and `lg`. */
export const AllSizes: Story = {
	render: () => (
		<div className="flex items-end gap-4">
			<Avatar size="sm">
				<AvatarFallback>JD</AvatarFallback>
			</Avatar>
			<Avatar size="default">
				<AvatarFallback>JD</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarFallback>JD</AvatarFallback>
			</Avatar>
		</div>
	),
};

/** An avatar with a status badge anchored to its corner. */
export const WithBadge: Story = {
	render: () => (
		<Avatar>
			<AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" />
			<AvatarFallback>JD</AvatarFallback>
			<AvatarBadge />
		</Avatar>
	),
};

/** A cluster of overlapping avatars, useful for representing a group of users. */
export const Group: Story = {
	render: () => (
		<AvatarGroup>
			<Avatar>
				<AvatarFallback>JD</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback>JS</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback>BJ</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback>AW</AvatarFallback>
			</Avatar>
		</AvatarGroup>
	),
};

/** A cluster of overlapping avatars with a count chip showing the number of remaining users. */
export const GroupWithCount: Story = {
	render: () => (
		<AvatarGroup>
			<Avatar>
				<AvatarFallback>JD</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback>JS</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback>BJ</AvatarFallback>
			</Avatar>
			<AvatarGroupCount>+3</AvatarGroupCount>
		</AvatarGroup>
	),
};
