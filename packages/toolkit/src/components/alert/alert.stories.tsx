import { UserGroupIcon, XMarkIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
// import { Button } from "../button/button";
import { IconButton } from "../icon-button/icon-button";
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

export const WithCustomContent: Story = {
	render: () => (
		<Alert variant="success">
			<Alert.Indicator />
			<Alert.Content>
				<Alert.Title>Storage Almost Full</Alert.Title>
				<Alert.Description>
					You're using 90% of your available storage. Consider upgrading your
					plan.
				</Alert.Description>
			</Alert.Content>
			{/* <Button className="self-center text-yellow-700 bg-yellow-100 hover:bg-yellow-200 hover:text-yellow-900 pressed:bg-yellow-300">
				Upgrade Plan
			</Button> */}
			<IconButton
				aria-label="Close"
				variant="ghost"
				size="sm"
				// className="text-yellow-700 bg-yellow-100 hover:bg-yellow-200 hover:text-yellow-900 pressed:bg-yellow-300"
			>
				<XMarkIcon />
			</IconButton>
		</Alert>
	),
};
