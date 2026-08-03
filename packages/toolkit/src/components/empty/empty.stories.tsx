import type { Meta, StoryObj } from "@storybook/react-vite";
import { BookOpen, Users } from "lucide-react";
import { Button } from "../button/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "./empty";

const meta = {
	component: Empty,
	title: "Empty",
	parameters: {
		controls: {
			include: [],
		},
	},
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof Empty>;

/** A complete empty state with an icon, title, description, and action buttons, showing the standard composition pattern. */
export const Default: Story = {
	render: (props) => (
		<Empty {...props}>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Users />
				</EmptyMedia>
				<EmptyTitle>No upcoming meetings</EmptyTitle>
				<EmptyDescription>Create a meeting to get started.</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button size="sm" variant="default">
					Create meeting
				</Button>
				<Button size="sm" variant="outline">
					<BookOpen />
					View docs
				</Button>
			</EmptyContent>
		</Empty>
	),
};

/** An empty state with media rendered in the default variant, without a tinted background. */
export const MediaDefault: Story = {
	render: (props) => (
		<Empty {...props}>
			<EmptyHeader>
				<EmptyMedia variant="default">
					<Users />
				</EmptyMedia>
				<EmptyTitle>No team members yet</EmptyTitle>
				<EmptyDescription>Invite your team to get started.</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button size="sm" variant="outline">
					<Users />
					Invite team
				</Button>
			</EmptyContent>
		</Empty>
	),
};
