import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button";
import { TextField } from "../text-field/text-field";
import { Form } from "./form";

const meta = {
	component: Form,
	title: "Form",
	parameters: {},
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HTMLValidation: Story = {
	render: () => (
		<Form
			onFormSubmit={(e) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);
				const data = Object.fromEntries(formData.entries());
				alert(`HTML Form submitted with: ${JSON.stringify(data, null, 2)}`);
			}}
		>
			<TextField
				label="Email"
				description="Enter a valid email address"
				isRequired
				inputProps={{
					name: "email",
					type: "email",
				}}
			/>
			<TextField
				label="Password"
				description="Minimum 8 characters"
				isRequired
				inputProps={{
					name: "password",
					type: "password",
					minLength: 8,
				}}
			/>
			<TextField
				label="Age"
				description="Must be between 18 and 120"
				isRequired
				inputProps={{
					name: "age",
					type: "number",
					min: 18,
					max: 120,
				}}
			/>
			<Button type="submit" variant="solid">
				Submit
			</Button>
		</Form>
	),
};

export const TanStackForm: Story = {
	render: () => (
		<div className="w-80 space-y-4">
			<p className="text-slate-600 text-sm">
				This example shows how TanStack Form would be integrated. For a working
				demo, you'd need to properly type the form instance.
			</p>
			<TextField
				label="First Name (TanStack would validate this)"
				description="This field would have async validation"
				inputProps={{
					placeholder: "Enter your first name",
				}}
			/>
			<TextField
				label="Email (TanStack would validate this)"
				description="Custom email validation logic"
				inputProps={{
					type: "email",
					placeholder: "Enter your email",
				}}
			/>
			<Button type="submit" variant="solid">
				Submit with TanStack Form
			</Button>
		</div>
	),
};
