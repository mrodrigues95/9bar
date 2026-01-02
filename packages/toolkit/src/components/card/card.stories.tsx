import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button";
import { Form } from "../form/form";
import { TextField } from "../text-field/text-field";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardPanel,
	CardTitle,
} from "./card";

const meta = {
	component: Card,
	title: "Card",
	parameters: {
		controls: { include: ["variant"] },
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default"],
		},
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card>
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>
					This is a description for the card component.
				</CardDescription>
			</CardHeader>
			<CardPanel>
				<p className="text-secondary text-sm">
					This is the main content area of the card. You can place any content
					here.
				</p>
			</CardPanel>
			<CardFooter>
				<Button variant="outline" className="w-full">
					Cancel
				</Button>
				<Button variant="solid" className="w-full">
					Confirm
				</Button>
			</CardFooter>
		</Card>
	),
};

export const WithoutFooter: Story = {
	render: () => (
		<Card>
			<CardHeader>
				<CardTitle>Simple Card</CardTitle>
				<CardDescription>This card has no footer.</CardDescription>
			</CardHeader>
			<CardPanel>
				<p className="text-secondary text-sm">
					Cards are flexible. You can use only the slots you need.
				</p>
			</CardPanel>
		</Card>
	),
};

export const WithoutHeader: Story = {
	render: () => (
		<Card>
			<CardPanel>
				<p className="text-secondary text-sm">
					This card doesn't have a header, just content in the panel.
				</p>
			</CardPanel>
			<CardFooter>
				<Button variant="solid" className="w-full">
					Action
				</Button>
			</CardFooter>
		</Card>
	),
};

export const FormCard: Story = {
	render: () => (
		<Card className="w-full max-w-xs">
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
				<CardPanel className="flex flex-col gap-4">
					<TextField
						label="Name"
						inputProps={{
							name: "name",
							type: "text",
							density: "compact",
						}}
					/>
				</CardPanel>
				<CardFooter>
					<Button variant="solid" className="w-full">
						Deploy
					</Button>
				</CardFooter>
			</Form>
		</Card>
	),
};

export const MinimalPanel: Story = {
	render: () => (
		<Card>
			<CardPanel className="space-y-4">
				<h4 className="font-semibold text-slate-900">Quick Stats</h4>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-slate-600 text-xs">Views</p>
						<p className="font-semibold text-2xl text-slate-900">1,234</p>
					</div>
					<div>
						<p className="text-slate-600 text-xs">Clicks</p>
						<p className="font-semibold text-2xl text-slate-900">567</p>
					</div>
				</div>
			</CardPanel>
		</Card>
	),
};
