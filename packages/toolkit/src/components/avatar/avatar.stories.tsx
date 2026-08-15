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
		docs: {
			controls: { include: ["size"] },
			argTypes: { include: ["size"] },
		},
	},
	argTypes: {
		size: {
			control: { type: "select" },
			options: ["default", "sm", "lg"],
		},
	},
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An avatar displaying a user's profile image, falling back to initials on load error. */
export const WithImage: Story = {
	render: (props) => (
		<Avatar {...props}>
			<AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" />
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
};

/** An avatar displaying initials derived from the user's name when no image is provided. */
export const WithInitials: Story = {
	render: (props) => (
		<Avatar {...props}>
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
};

/** An avatar showing a default user icon placeholder when neither an image nor a name is provided. */
export const DefaultPlaceholder: Story = {
	render: (props) => (
		<Avatar {...props}>
			<AvatarFallback>
				<Users />
			</AvatarFallback>
		</Avatar>
	),
};

/** An avatar with custom placeholder content instead of the default user icon. */
export const CustomPlaceholder: Story = {
	render: (props) => (
		<Avatar {...props}>
			<AvatarFallback>?</AvatarFallback>
		</Avatar>
	),
};

/** Demonstrates the fallback behavior when an image URL fails to load, showing initials derived from the name. */
export const ImageError: Story = {
	render: (props) => (
		<Avatar {...props}>
			<AvatarImage src="https://invalid-url-that-will-fail.com/image.jpg" />
			<AvatarFallback>JS</AvatarFallback>
		</Avatar>
	),
};

/** Demonstrates the fallback behavior when an image URL fails to load and no name is provided, showing the placeholder icon. */
export const ImageErrorNoName: Story = {
	render: (props) => (
		<Avatar {...props}>
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
	render: (props) => (
		<Avatar {...props}>
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
