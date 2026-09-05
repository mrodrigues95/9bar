import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button";
import { TextField } from "../form/fields/text-field";
import { Form } from "../form/form";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card";

const meta = {
	component: Card,
	title: "Card",
	parameters: {
		controls: { include: ["size"] },
		docs: {
			controls: { include: ["size"] },
			argTypes: { include: ["size"] },
		},
	},
	argTypes: {
		size: {
			control: "select",
			options: ["default", "sm"],
		},
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A full card with header, content, and footer sections showing the standard composition pattern. */
export const Default: Story = {
	render: (props) => (
		<Card {...props} className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>This is a description for the card component.</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground">
					This is the main content area of the card. You can place any content here.
				</p>
			</CardContent>
			<CardFooter className="flex-col gap-2">
				<Button variant="outline" className="w-full">
					Cancel
				</Button>
				<Button variant="default" className="w-full">
					Confirm
				</Button>
			</CardFooter>
		</Card>
	),
};

/** A card with an action button aligned to the end of its header. */
export const WithHeaderAction: Story = {
	render: (props) => (
		<Card {...props} className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Account Settings</CardTitle>
				<CardDescription>Manage your account preferences.</CardDescription>
				<CardAction>
					<Button variant="ghost" size="sm">
						Edit
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground">
					Your account settings are stored securely and synced across devices.
				</p>
			</CardContent>
		</Card>
	),
};

/** A card without a footer, showing that card slots are composable and optional. */
export const WithoutFooter: Story = {
	render: (props) => (
		<Card {...props} className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Simple Card</CardTitle>
				<CardDescription>This card has no footer.</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground">
					Cards are flexible. You can use only the slots you need.
				</p>
			</CardContent>
		</Card>
	),
};

/** A card without a header, containing only content and a footer. */
export const WithoutHeader: Story = {
	render: (props) => (
		<Card {...props} className="w-full max-w-sm">
			<CardContent>
				<p className="text-sm text-muted-foreground">
					This card doesn't have a header, just content.
				</p>
			</CardContent>
			<CardFooter>
				<Button variant="default" className="w-full">
					Action
				</Button>
			</CardFooter>
		</Card>
	),
};

/** A card containing a form, demonstrating how card slots compose with form elements. */
export const FormCard: Story = {
	render: (props) => (
		<Card {...props} className="w-full max-w-xs">
			<CardHeader>
				<CardTitle>Create project</CardTitle>
				<CardDescription>Deploy your new project in one-click.</CardDescription>
			</CardHeader>
			<Form
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					const data = Object.fromEntries(formData.entries());
					alert(`HTML Form submitted with: ${JSON.stringify(data, null, 2)}`);
				}}
			>
				<CardContent className="flex flex-col gap-4">
					<TextField
						label="Name"
						inputProps={{
							name: "name",
							type: "text",
						}}
					/>
				</CardContent>
				<CardFooter>
					<Button variant="default" className="w-full">
						Deploy
					</Button>
				</CardFooter>
			</Form>
		</Card>
	),
};

/** A card using only the content slot for minimal content-only layouts like stat dashboards. */
export const MinimalContent: Story = {
	render: (props) => (
		<Card {...props} className="w-full max-w-sm">
			<CardContent className="space-y-4">
				<h4 className="font-semibold text-slate-900">Quick Stats</h4>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-xs text-slate-600">Views</p>
						<p className="text-2xl font-semibold text-slate-900">1,234</p>
					</div>
					<div>
						<p className="text-xs text-slate-600">Clicks</p>
						<p className="text-2xl font-semibold text-slate-900">567</p>
					</div>
				</div>
			</CardContent>
		</Card>
	),
};
