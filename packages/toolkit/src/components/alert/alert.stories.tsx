import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	CircleCheck,
	Info as InfoIcon,
	TriangleAlert,
	Users,
	X,
} from "lucide-react";
import { Button } from "../button/button";
import { IconButton } from "../icon-button/icon-button";
import { Link } from "../link/link";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";

const meta = {
	component: Alert,
	title: "Alert",
	parameters: {
		layout: "padded",
		controls: { include: ["variant"] },
		docs: {
			controls: { include: ["variant"] },
			argTypes: { include: ["variant"] },
		},
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["default", "destructive"],
		},
	},
	args: { variant: "default" },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An informational alert used for neutral, non-critical messages. */
export const Info: Story = {
	render: (props) => (
		<Alert {...props}>
			<InfoIcon />
			<AlertTitle>Information</AlertTitle>
			<AlertDescription>This is an informational message.</AlertDescription>
		</Alert>
	),
};

/** A success alert used to confirm that an action completed successfully. */
export const Success: Story = {
	render: (props) => (
		<Alert {...props}>
			<CircleCheck />
			<AlertTitle>Success</AlertTitle>
			<AlertDescription>Your action was successful.</AlertDescription>
		</Alert>
	),
};

/** A warning alert used to caution the user about a potential issue. */
export const Warning: Story = {
	render: (props) => (
		<Alert {...props}>
			<TriangleAlert />
			<AlertTitle>Warning</AlertTitle>
			<AlertDescription>Please proceed with caution.</AlertDescription>
		</Alert>
	),
};

/** A destructive alert used to communicate errors or destructive outcomes. */
export const Danger: Story = {
	args: { variant: "destructive" },
	render: (props) => (
		<Alert {...props}>
			<TriangleAlert />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>An error has occurred.</AlertDescription>
		</Alert>
	),
};

/** An alert with only a title and no description, for brief single-line messages. */
export const TitleOnly: Story = {
	render: (props) => (
		<Alert {...props}>
			<CircleCheck />
			<AlertTitle>Operation completed successfully</AlertTitle>
		</Alert>
	),
};

/** An alert with only a description and no title, for supplementary messages that don't need a heading. */
export const DescriptionOnly: Story = {
	render: (props) => (
		<Alert {...props}>
			<InfoIcon />
			<AlertDescription>
				This alert only contains a description without a title.
			</AlertDescription>
		</Alert>
	),
};

/** An alert with a custom icon passed as a direct child of the `Alert`. */
export const CustomIcon: Story = {
	render: (props) => (
		<Alert {...props}>
			<Users />
			<AlertTitle>Team Invitation</AlertTitle>
			<AlertDescription>
				You've been invited to join the team workspace.
			</AlertDescription>
		</Alert>
	),
};

/** An alert without an icon, relying solely on color and text. */
export const WithoutIndicator: Story = {
	render: (props) => (
		<Alert {...props}>
			<AlertTitle>Simple Alert</AlertTitle>
			<AlertDescription>This alert doesn't use an icon.</AlertDescription>
		</Alert>
	),
};

/** An alert with a dismiss button using `AlertAction` and an `IconButton`. */
export const WithDismiss: Story = {
	render: (props) => (
		<Alert {...props}>
			<CircleCheck />
			<AlertTitle>Storage Almost Full</AlertTitle>
			<AlertDescription>
				You're using 90% of your available storage. Consider upgrading your
				plan.
			</AlertDescription>
			<AlertAction>
				<IconButton aria-label="Close" variant="ghost" size="sm">
					<X />
				</IconButton>
			</AlertAction>
		</Alert>
	),
};

/** An alert with an inline action button using `AlertAction` and a `Button`. */
export const WithActionButton: Story = {
	render: (props) => (
		<Alert {...props}>
			<TriangleAlert />
			<AlertTitle>Storage Almost Full</AlertTitle>
			<AlertDescription>
				You're using 90% of your available storage. Consider upgrading your
				plan.
			</AlertDescription>
			<AlertAction>
				<Button variant="ghost">Upgrade Plan</Button>
			</AlertAction>
		</Alert>
	),
};

/** An alert with an inline link action using `AlertAction` and a `Link`. */
export const WithLinkAction: Story = {
	render: (props) => (
		<Alert {...props}>
			<InfoIcon />
			<AlertTitle>New Feature Available</AlertTitle>
			<AlertDescription>
				Check out our new dashboard with enhanced analytics.
			</AlertDescription>
			<AlertAction>
				<Link size="sm">Learn More</Link>
			</AlertAction>
		</Alert>
	),
};
