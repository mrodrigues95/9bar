import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button";
import { Form } from "../form/form";
import { TextField } from "../text-field/text-field";
import { Card } from "./card";

const meta = {
	component: Card,
	title: "Card",
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card>
			<Card.Header>
				<Card.Title>Card Title</Card.Title>
				<Card.Description>
					This is a description for the card component.
				</Card.Description>
			</Card.Header>
			<Card.Panel>
				<p className="text-slate-700 text-sm">
					This is the main content area of the card. You can place any content
					here.
				</p>
			</Card.Panel>
			<Card.Footer>
				<Button variant="outline" className="w-full">
					Cancel
				</Button>
				<Button variant="solid" className="w-full">
					Confirm
				</Button>
			</Card.Footer>
		</Card>
	),
};

export const WithoutFooter: Story = {
	render: () => (
		<Card>
			<Card.Header>
				<Card.Title>Simple Card</Card.Title>
				<Card.Description>This card has no footer.</Card.Description>
			</Card.Header>
			<Card.Panel>
				<p className="text-slate-700 text-sm">
					Cards are flexible. You can use only the slots you need.
				</p>
			</Card.Panel>
		</Card>
	),
};

export const WithoutHeader: Story = {
	render: () => (
		<Card>
			<Card.Panel>
				<p className="text-slate-700 text-sm">
					This card doesn't have a header, just content in the panel.
				</p>
			</Card.Panel>
			<Card.Footer>
				<Button variant="solid" className="w-full">
					Action
				</Button>
			</Card.Footer>
		</Card>
	),
};

export const FormCard: Story = {
	render: () => (
		<Card className="w-full max-w-xs">
			<Card.Header>
				<Card.Title>Create project</Card.Title>
				<Card.Description>
					Deploy your new project in one-click.
				</Card.Description>
			</Card.Header>
			<Form
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					const data = Object.fromEntries(formData.entries());
					alert(`HTML Form submitted with: ${JSON.stringify(data, null, 2)}`);
				}}
			>
				<Card.Panel className="flex flex-col gap-4">
					<TextField
						label="Name"
						inputProps={{
							name: "name",
							type: "text",
							density: "compact",
						}}
					/>
				</Card.Panel>
				<Card.Footer>
					<Button variant="solid" className="w-full">
						Deploy
					</Button>
				</Card.Footer>
			</Form>
		</Card>
	),
};

export const MinimalPanel: Story = {
	render: () => (
		<Card>
			<Card.Panel className="space-y-4">
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
			</Card.Panel>
		</Card>
	),
};
