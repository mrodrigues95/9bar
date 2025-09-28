import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button";
import { TextField } from "../text-field/text-field";
import { Form } from "./form";
import { useAppForm } from "./hooks/form";

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

interface FormErrors<TFormValues> {
	fields: { [K in keyof TFormValues]?: string };
}

export const ComposedForm: Story = {
	render: () => {
		const form = useAppForm({
			defaultValues: {
				firstName: "",
				lastName: "",
				email: "",
				age: "",
			},
			validators: {
				onChange: ({ value }) => {
					const errors: FormErrors<typeof value> = { fields: {} };

					if (!value.firstName) {
						errors.fields.firstName = "First name is required";
					}

					if (!value.lastName) {
						errors.fields.lastName = "Last name is required";
					}

					const age = Number(value.age);
					if (!age) {
						errors.fields.age = "Age is required";
					} else if (age < 18) {
						errors.fields.age = "Must be at least 18 years old";
					} else if (age > 120) {
						errors.fields.age = "Must be under 120 years old";
					}

					const email = value.email;
					if (!email) {
						errors.fields.email = "Email is required";
					} else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
						errors.fields.email = "Please enter a valid email";
					}

					return errors;
				},
			},
			onSubmit: async ({ value }) => {
				alert(`Form submitted with: ${JSON.stringify(value, null, 2)}`);
			},
		});

		return (
			<form.AppForm>
				<form.AppField name="firstName">
					{(field) => (
						<field.TextField
							label="First Name"
							description="Enter your first name"
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="lastName">
					{(field) => (
						<field.TextField
							label="Last Name"
							description="Enter your last name"
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="age">
					{(field) => (
						<field.TextField
							label="Age"
							description="Must be 18 or older"
							isRequired
							inputProps={{ type: "number", min: 18, max: 120 }}
						/>
					)}
				</form.AppField>
				<form.AppField name="email">
					{(field) => (
						<field.TextField
							label="Email"
							description="Enter a valid email address"
							isRequired
							inputProps={{ type: "email" }}
						/>
					)}
				</form.AppField>
				<form.SubmitButton>Submit Form</form.SubmitButton>
			</form.AppForm>
		);
	},
};

// const ContactFormComponent = withForm({
// 	defaultValues: {
// 		name: "",
// 		email: "",
// 		subject: "",
// 		message: "",
// 	},
// 	props: {
// 		title: "Contact Us",
// 	},
// 	render: function Render({ form, title }) {
// 		return (
// 			<div className="space-y-4">
// 				<h2 className="text-lg font-semibold">{title}</h2>

// 				<form.AppField
// 					name="name"
// 					validators={{
// 						onChange: ({ value }) => (!value ? "Name is required" : undefined),
// 					}}
// 				>
// 					{(field) => <field.TextField label="Full Name" isRequired />}
// 				</form.AppField>

// 				<form.AppField
// 					name="email"
// 					validators={{
// 						onChange: ({ value }) => {
// 							if (!value) return "Email is required";
// 							if (!/^[^@]+@[^@]+\.[^@]+$/.test(value)) {
// 								return "Please enter a valid email";
// 							}
// 							return undefined;
// 						},
// 					}}
// 				>
// 					{(field) => (
// 						<field.TextField
// 							label="Email"
// 							isRequired
// 							inputProps={{ type: "email" }}
// 						/>
// 					)}
// 				</form.AppField>

// 				<form.AppField
// 					name="subject"
// 					validators={{
// 						onChange: ({ value }) =>
// 							!value ? "Subject is required" : undefined,
// 					}}
// 				>
// 					{(field) => <field.TextField label="Subject" isRequired />}
// 				</form.AppField>

// 				<form.AppField
// 					name="message"
// 					validators={{
// 						onChange: ({ value }) =>
// 							!value ? "Message is required" : undefined,
// 					}}
// 				>
// 					{(field) => (
// 						<field.TextField
// 							label="Message"
// 							description="Tell us how we can help"
// 							isRequired
// 							inputProps={{
// 								placeholder: "Tell us how we can help...",
// 								className: "h-24",
// 							}}
// 						/>
// 					)}
// 				</form.AppField>

// 				<form.SubmitButton loadingText="Sending message...">
// 					Send Message
// 				</form.SubmitButton>
// 			</div>
// 		);
// 	},
// });

// export const ReusableContactForm: Story = {
// 	render: () => {
// 		const form = useAppForm({
// 			defaultValues: {
// 				name: "",
// 				email: "",
// 				subject: "",
// 				message: "",
// 			},
// 			onSubmit: async ({ value }) => {
// 				alert(`Contact form submitted: ${JSON.stringify(value, null, 2)}`);
// 			},
// 		});

// 		return <ContactFormComponent form={form} title="Get in Touch" />;
// 	},
// };
