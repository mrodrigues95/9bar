import { BookOpenIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
			disable: true,
		},
	},
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof Empty>;

export const Default: Story = {
	args: {},
	render: () => (
		<Empty>
			<EmptyHeader>
				<EmptyMedia>
					<UserGroupIcon />
				</EmptyMedia>
				<EmptyTitle>No upcoming meetings</EmptyTitle>
				<EmptyDescription>Create a meeting to get started.</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button size="sm" variant="solid">
					Create meeting
				</Button>
				<Button size="sm" variant="outline">
					<BookOpenIcon />
					View docs
				</Button>
			</EmptyContent>
		</Empty>
	),
};
