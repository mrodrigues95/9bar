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
		controls: { include: [] },
	},
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An informational alert used for neutral, non-critical messages. */
export const Info: Story = {
	render: (props) => (
		<Alert {...props} variant="info">
			<AlertIndicator />
			<AlertContent>
				<AlertTitle>Information</AlertTitle>
				<AlertDescription>This is an informational message.</AlertDescription>
			</AlertContent>
		</Alert>
	),
};

/** A success alert used to confirm that an action completed successfully. */
export const Success: Story = {
	render: (props) => (
		<Alert {...props} variant="success">
			<AlertIndicator />
			<AlertContent>
				<AlertTitle>Success</AlertTitle>
				<AlertDescription>Your action was successful.</AlertDescription>
			</AlertContent>
		</Alert>
	),
};

/** A warning alert used to caution the user about a potential issue. */
export const Warning: Story = {
	render: (props) => (
		<Alert {...props} variant="warning">
			<AlertIndicator />
			<AlertContent>
				<AlertTitle>Warning</AlertTitle>
				<AlertDescription>Please proceed with caution.</AlertDescription>
			</AlertContent>
		</Alert>
	),
};

/** A danger alert used to communicate errors or destructive outcomes. */
export const Danger: Story = {
	render: (props) => (
		<Alert {...props} variant="danger">
			<AlertIndicator />
			<AlertContent>
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>An error has occurred.</AlertDescription>
			</AlertContent>
		</Alert>
	),
};

/** An alert with only a title and no description, for brief single-line messages. */
export const TitleOnly: Story = {
	render: (props) => (
		<Alert {...props} variant="success">
			<AlertIndicator />
			<AlertContent>
				<AlertTitle>Operation completed successfully</AlertTitle>
			</AlertContent>
		</Alert>
	),
};

/** An alert with only a description and no title, for supplementary messages that don't need a heading. */
export const DescriptionOnly: Story = {
	render: (props) => (
		<Alert {...props} variant="info">
			<AlertIndicator />
			<AlertContent>
				<AlertDescription>
					This alert only contains a description without a title.
				</AlertDescription>
			</AlertContent>
		</Alert>
	),
};

/** An alert with a custom icon overriding the default variant icon via `AlertIndicator` children. */
export const CustomIcon: Story = {
	render: (props) => (
		<Alert {...props} variant="success">
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

/** An alert without an indicator icon, relying solely on color and text. */
export const WithoutIndicator: Story = {
	render: (props) => (
		<Alert {...props} variant="info">
			<AlertContent>
				<AlertTitle>Simple Alert</AlertTitle>
				<AlertDescription>
					This alert doesn't use an indicator icon.
				</AlertDescription>
			</AlertContent>
		</Alert>
	),
};

/** An alert with a dismiss button using `AlertAction` and an `IconButton`. */
export const WithDismiss: Story = {
	render: (props) => (
		<Alert {...props} variant="success">
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
	),
};

/** An alert with an inline action button using `AlertAction` and a `Button`. */
export const WithActionButton: Story = {
	render: (props) => (
		<Alert {...props} variant="warning">
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
	),
};

/** An alert with an inline link action using `AlertAction` and a `Link`. */
export const WithLinkAction: Story = {
	render: (props) => (
		<Alert {...props} variant="info">
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
	),
};

/** An alert with multiple action slots, such as a confirm/cancel pair for destructive actions. */
export const WithMultipleActions: Story = {
	render: (props) => (
		<Alert {...props} variant="danger">
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
	),
};
