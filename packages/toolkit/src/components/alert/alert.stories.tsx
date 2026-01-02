import { UserGroupIcon, XMarkIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button";
import { IconButton } from "../icon-button/icon-button";
import { Link } from "../link/link";
import {
	Alert,
	AlertAction,
	AlertContent,
	AlertDescription,
	AlertIndicator,
	AlertTitle,
} from "./alert";

const meta = {
	component: Alert,
	title: "Alert",
	parameters: {
		layout: "padded",
		controls: { disable: true },
	},
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Alert variant="info">
				<AlertIndicator />
				<AlertContent>
					<AlertTitle>Information</AlertTitle>
					<AlertDescription>This is an informational message.</AlertDescription>
				</AlertContent>
			</Alert>
			<Alert variant="success">
				<AlertIndicator />
				<AlertContent>
					<AlertTitle>Success</AlertTitle>
					<AlertDescription>Your action was successful.</AlertDescription>
				</AlertContent>
			</Alert>
			<Alert variant="warning">
				<AlertIndicator />
				<AlertContent>
					<AlertTitle>Warning</AlertTitle>
					<AlertDescription>Please proceed with caution.</AlertDescription>
				</AlertContent>
			</Alert>
			<Alert variant="danger">
				<AlertIndicator />
				<AlertContent>
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>An error has occurred.</AlertDescription>
				</AlertContent>
			</Alert>
		</div>
	),
};

export const TitleOnly: Story = {
	render: () => (
		<Alert variant="success">
			<AlertIndicator />
			<AlertContent>
				<AlertTitle>Operation completed successfully</AlertTitle>
			</AlertContent>
		</Alert>
	),
};

export const DescriptionOnly: Story = {
	render: () => (
		<Alert variant="info">
			<AlertIndicator />
			<AlertContent>
				<AlertDescription>
					This alert only contains a description without a title.
				</AlertDescription>
			</AlertContent>
		</Alert>
	),
};

export const CustomIcon: Story = {
	render: () => (
		<Alert variant="success">
			<AlertIndicator>
				<UserGroupIcon />
			</AlertIndicator>
			<AlertContent>
				<AlertTitle>Team Invitation</AlertTitle>
				<AlertDescription>
					You've been invited to join the team workspace.
				</AlertDescription>
			</AlertContent>
		</Alert>
	),
};

export const WithoutIndicator: Story = {
	render: () => (
		<Alert variant="info">
			<AlertContent>
				<AlertTitle>Simple Alert</AlertTitle>
				<AlertDescription>
					This alert doesn't use an indicator icon.
				</AlertDescription>
			</AlertContent>
		</Alert>
	),
};

export const WithButtons: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Alert variant="success">
				<AlertIndicator />
				<AlertContent>
					<AlertTitle>Storage Almost Full</AlertTitle>
					<AlertDescription>
						You're using 90% of your available storage. Consider upgrading your
						plan.
					</AlertDescription>
				</AlertContent>
				<AlertAction>
					<IconButton aria-label="Close" variant="ghost" size="sm">
						<XMarkIcon />
					</IconButton>
				</AlertAction>
			</Alert>
			<Alert variant="warning">
				<AlertIndicator />
				<AlertContent>
					<AlertTitle>Storage Almost Full</AlertTitle>
					<AlertDescription>
						You're using 90% of your available storage. Consider upgrading your
						plan.
					</AlertDescription>
				</AlertContent>
				<AlertAction>
					<Button variant="ghost">Upgrade Plan</Button>
				</AlertAction>
			</Alert>
			<Alert variant="info">
				<AlertIndicator />
				<AlertContent>
					<AlertTitle>New Feature Available</AlertTitle>
					<AlertDescription>
						Check out our new dashboard with enhanced analytics.
					</AlertDescription>
				</AlertContent>
				<AlertAction>
					<Link size="sm">Learn More</Link>
				</AlertAction>
			</Alert>
			<Alert variant="danger">
				<AlertIndicator />
				<AlertContent>
					<AlertTitle>Delete Account</AlertTitle>
					<AlertDescription>
						Are you sure you want to delete your account? This action cannot be
						undone.
					</AlertDescription>
				</AlertContent>
				<AlertAction>
					<Button variant="ghost">Cancel</Button>
				</AlertAction>
				<AlertAction>
					<Button variant="ghost">Delete</Button>
				</AlertAction>
			</Alert>
		</div>
	),
};
