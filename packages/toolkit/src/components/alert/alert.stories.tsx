import { UserGroupIcon, XMarkIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button";
import { IconButton } from "../icon-button/icon-button";
import { Link } from "../link/link";
import { Alert } from "./alert";

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
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>Information</Alert.Title>
					<Alert.Description>
						This is an informational message.
					</Alert.Description>
				</Alert.Content>
			</Alert>
			<Alert variant="success">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>Success</Alert.Title>
					<Alert.Description>Your action was successful.</Alert.Description>
				</Alert.Content>
			</Alert>
			<Alert variant="warning">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>Warning</Alert.Title>
					<Alert.Description>Please proceed with caution.</Alert.Description>
				</Alert.Content>
			</Alert>
			<Alert variant="danger">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>An error has occurred.</Alert.Description>
				</Alert.Content>
			</Alert>
		</div>
	),
};

export const TitleOnly: Story = {
	render: () => (
		<Alert variant="success">
			<Alert.Indicator />
			<Alert.Content>
				<Alert.Title>Operation completed successfully</Alert.Title>
			</Alert.Content>
		</Alert>
	),
};

export const DescriptionOnly: Story = {
	render: () => (
		<Alert variant="info">
			<Alert.Indicator />
			<Alert.Content>
				<Alert.Description>
					This alert only contains a description without a title.
				</Alert.Description>
			</Alert.Content>
		</Alert>
	),
};

export const CustomIcon: Story = {
	render: () => (
		<Alert variant="success">
			<Alert.Indicator>
				<UserGroupIcon />
			</Alert.Indicator>
			<Alert.Content>
				<Alert.Title>Team Invitation</Alert.Title>
				<Alert.Description>
					You've been invited to join the team workspace.
				</Alert.Description>
			</Alert.Content>
		</Alert>
	),
};

export const WithoutIndicator: Story = {
	render: () => (
		<Alert variant="info">
			<Alert.Content>
				<Alert.Title>Simple Alert</Alert.Title>
				<Alert.Description>
					This alert doesn't use an indicator icon.
				</Alert.Description>
			</Alert.Content>
		</Alert>
	),
};

export const WithButtons: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Alert variant="success">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>Storage Almost Full</Alert.Title>
					<Alert.Description>
						You're using 90% of your available storage. Consider upgrading your
						plan.
					</Alert.Description>
				</Alert.Content>
				<Alert.Action>
					<IconButton aria-label="Close" variant="ghost" size="sm">
						<XMarkIcon />
					</IconButton>
				</Alert.Action>
			</Alert>
			<Alert variant="warning">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>Storage Almost Full</Alert.Title>
					<Alert.Description>
						You're using 90% of your available storage. Consider upgrading your
						plan.
					</Alert.Description>
				</Alert.Content>
				<Alert.Action>
					<Button variant="ghost">Upgrade Plan</Button>
				</Alert.Action>
			</Alert>
			<Alert variant="info">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>New Feature Available</Alert.Title>
					<Alert.Description>
						Check out our new dashboard with enhanced analytics.
					</Alert.Description>
				</Alert.Content>
				<Alert.Action>
					<Link size="sm">Learn More</Link>
				</Alert.Action>
			</Alert>
			<Alert variant="danger">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>Delete Account</Alert.Title>
					<Alert.Description>
						Are you sure you want to delete your account? This action cannot be
						undone.
					</Alert.Description>
				</Alert.Content>
				<Alert.Action>
					<Button variant="ghost">Cancel</Button>
				</Alert.Action>
				<Alert.Action>
					<Button variant="ghost">Delete</Button>
				</Alert.Action>
			</Alert>
		</div>
	),
};
