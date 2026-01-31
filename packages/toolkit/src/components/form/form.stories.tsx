import type { Meta, StoryObj } from "@storybook/react-vite";
import z from "zod";
import { Button } from "../button/button";
import { Checkbox } from "../checkbox/checkbox";
import { SelectItem } from "../select/select";
import { CheckboxGroupField } from "./fields/checkbox-group-field";
import { SelectField } from "./fields/select-field";
import { TextField } from "./fields/text-field";
import { TextareaField } from "./fields/textarea-field";
import { Form } from "./form";
import { useAppForm, withForm } from "./utils/form";

const meta = {
	component: Form,
	title: "Form",
	parameters: { controls: { disable: true } },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HTMLValidation: Story = {
	render: (props) => (
		<Form
			{...props}
			onSubmit={(e) => {
				e.preventDefault();
				const formData = new FormData(e.currentTarget);
				const data = Object.fromEntries(formData.entries());
				alert(`HTML Form submitted with: ${JSON.stringify(data, null, 2)}`);
			}}
		>
			<TextField
				isRequired
				label="Email"
				description="Enter a valid email address"
				inputProps={{
					name: "email",
					type: "email",
					autoComplete: "email",
				}}
			/>
			<TextField
				isRequired
				label="Password"
				description="Minimum 8 characters"
				inputProps={{
					name: "password",
					type: "password",
					minLength: 8,
					autoComplete: "current-password",
				}}
			/>
			<TextField
				isRequired
				label="Age"
				description="Must be between 18 and 120"
				inputProps={{
					name: "age",
					type: "number",
					min: 18,
					max: 120,
				}}
			/>
			<TextareaField
				isRequired
				label="Bio"
				description="Tell us a little about yourself"
				textareaProps={{
					name: "bio",
					minLength: 10,
					maxLength: 500,
				}}
			/>
			<SelectField
				isRequired
				label="Preferred Contact Method"
				description="How would you like to be contacted?"
				name="contactMethod"
				placeholder="Choose a method..."
				items={[
					{ id: "email", name: "Email" },
					{ id: "phone", name: "Phone" },
					{ id: "sms", name: "SMS" },
				]}
			>
				{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
			</SelectField>
			<CheckboxGroupField
				label="Communication Preferences"
				description="Select how you'd like to receive updates"
				name="preferences"
				isRequired
			>
				<Checkbox value="email">Email notifications</Checkbox>
				<Checkbox value="sms">SMS alerts</Checkbox>
				<Checkbox value="newsletter">Monthly newsletter</Checkbox>
			</CheckboxGroupField>
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
	render: (props) => {
		const form = useAppForm({
			defaultValues: {
				firstName: "",
				lastName: "",
				email: "",
				age: "",
				bio: "",
				country: "",
				newsletter: [] as Array<string>,
				acceptTerms: false,
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

					if (!value.bio) {
						errors.fields.bio = "Bio is required";
					} else if (value.bio.length < 10) {
						errors.fields.bio = "Bio must be at least 10 characters";
					}

					if (!value.country) {
						errors.fields.country = "Country is required";
					}

					if (!value.newsletter?.length) {
						errors.fields.newsletter = "You must subscribe to receive updates";
					}

					return errors;
				},
			},
			onSubmit: async ({ value }) => {
				alert(`Form submitted with: ${JSON.stringify(value, null, 2)}`);
			},
		});

		return (
			<Form
				{...props}
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<form.AppForm>
					<form.AppField name="firstName">
						{(field) => (
							<field.Input
								label="First Name"
								description="Enter your first name"
								isRequired
							/>
						)}
					</form.AppField>
					<form.AppField name="lastName">
						{(field) => (
							<field.Input
								label="Last Name"
								description="Enter your last name"
								isRequired
							/>
						)}
					</form.AppField>
					<form.AppField name="age">
						{(field) => (
							<field.Input
								label="Age"
								description="Must be 18 or older"
								isRequired
								inputProps={{ type: "number", min: 18, max: 120 }}
							/>
						)}
					</form.AppField>
					<form.AppField name="bio">
						{(field) => (
							<field.Textarea
								label="Bio"
								description="Tell us about yourself (min 10 characters)"
								isRequired
								textareaProps={{ minLength: 10 }}
							/>
						)}
					</form.AppField>
					<form.AppField name="country">
						{(field) => (
							<field.Select
								label="Country"
								description="Select your country"
								isRequired
								placeholder="Choose a country..."
								items={[
									{ id: "us", name: "United States" },
									{ id: "ca", name: "Canada" },
									{ id: "uk", name: "United Kingdom" },
									{ id: "au", name: "Australia" },
									{ id: "de", name: "Germany" },
								]}
							>
								{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
							</field.Select>
						)}
					</form.AppField>
					<form.AppField name="email">
						{(field) => (
							<field.Input
								label="Email"
								description="Enter a valid email address"
								isRequired
								inputProps={{ type: "email" }}
							/>
						)}
					</form.AppField>
					<form.AppField name="newsletter">
						{(field) => (
							<field.CheckboxGroup
								label="Newsletter"
								description="Receive updates about new features"
								isRequired
							>
								<Checkbox value="subscribe">Subscribe to newsletter</Checkbox>
							</field.CheckboxGroup>
						)}
					</form.AppField>
					<form.SubmitButton variant="solid">Submit</form.SubmitButton>
				</form.AppForm>
			</Form>
		);
	},
};

const schema = z.object({
	username: z
		.string()
		.min(3, "[Zod] You must have a length of at least 3")
		.startsWith("A", "[Zod] Username must start with 'A'"),
	email: z.email("[Zod] Invalid email address"),
	password: z
		.string()
		.min(8, "[Zod] Password must be at least 8 characters long"),
	bio: z
		.string()
		.min(20, "[Zod] Bio must be at least 20 characters")
		.max(500, "[Zod] Bio cannot exceed 500 characters"),
	role: z.string().min(1, "[Zod] Please select a role"),
	preferences: z
		.array(z.string())
		.min(2, "[Zod] Please select at least 2 preferences")
		.max(3, "[Zod] You can only select up to 3 preferences"),
});

export const WithZodValidation: Story = {
	render: (props) => {
		const form = useAppForm({
			defaultValues: {
				username: "",
				email: "",
				password: "",
				bio: "",
				role: "",
				preferences: [] as Array<string>,
			},
			validators: {
				onChange: schema,
			},
			onSubmit: async ({ value }) => {
				alert(`Form submitted with: ${JSON.stringify(value, null, 2)}`);
			},
		});

		return (
			<Form
				{...props}
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<form.AppField name="username">
					{(field) => (
						<field.Input
							label="Username"
							description="Choose a unique username"
							inputProps={{ autoComplete: "username" }}
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="email">
					{(field) => (
						<field.Input
							label="Email"
							description="Enter a valid email address"
							isRequired
							inputProps={{ type: "email", autoComplete: "email" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="password">
					{(field) => (
						<field.Input
							label="Password"
							description="Minimum 8 characters"
							isRequired
							inputProps={{ type: "password", autoComplete: "new-password" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="bio">
					{(field) => (
						<field.Textarea
							label="Bio"
							description="Tell us about yourself (20-500 characters)"
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="role">
					{(field) => (
						<field.Select
							label="Role"
							description="Select your account type"
							isRequired
							placeholder="Choose a role..."
							items={[
								{ id: "user", name: "User" },
								{ id: "admin", name: "Administrator" },
								{ id: "moderator", name: "Moderator" },
							]}
						>
							{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
						</field.Select>
					)}
				</form.AppField>
				<form.AppField name="preferences">
					{(field) => (
						<field.CheckboxGroup
							label="Preferences"
							description="Select between 2 and 3 options"
							isRequired
						>
							<Checkbox value="notifications">Email Notifications</Checkbox>
							<Checkbox value="newsletter">Weekly Newsletter</Checkbox>
							<Checkbox value="updates">Product Updates</Checkbox>
							<Checkbox value="promotions">Special Promotions</Checkbox>
						</field.CheckboxGroup>
					)}
				</form.AppField>
				<form.AppForm>
					<form.SubmitButton variant="solid">Register</form.SubmitButton>
				</form.AppForm>
			</Form>
		);
	},
};

const ContactFormComponent = withForm({
	defaultValues: {
		name: "",
		email: "",
		subject: "",
		topic: "",
		message: "",
		notifications: [] as Array<string>,
	},
	props: {
		title: "Contact Us",
	},
	render: function Render({ form, title }) {
		return (
			<div className="space-y-4">
				<h2 className="font-semibold text-lg">{title}</h2>
				<form.AppField
					name="name"
					validators={{
						onChange: ({ value }) => (!value ? "Name is required" : undefined),
					}}
				>
					{(field) => <field.Input label="Full Name" isRequired />}
				</form.AppField>
				<form.AppField
					name="email"
					validators={{
						onChange: ({ value }) => {
							if (!value) {
								return "Email is required";
							}

							if (!/^[^@]+@[^@]+\.[^@]+$/.test(value)) {
								return "Please enter a valid email";
							}

							return undefined;
						},
					}}
				>
					{(field) => (
						<field.Input
							label="Email"
							isRequired
							inputProps={{ type: "email" }}
						/>
					)}
				</form.AppField>
				<form.AppField
					name="subject"
					validators={{
						onChange: ({ value }) =>
							!value ? "Subject is required" : undefined,
					}}
				>
					{(field) => <field.Input label="Subject" isRequired />}
				</form.AppField>
				<form.AppField
					name="topic"
					validators={{
						onChange: ({ value }) => (!value ? "Topic is required" : undefined),
					}}
				>
					{(field) => (
						<field.Select
							label="Topic"
							description="What is your inquiry about?"
							isRequired
							placeholder="Select a topic..."
							items={[
								{ id: "general", name: "General Inquiry" },
								{ id: "support", name: "Technical Support" },
								{ id: "billing", name: "Billing" },
								{ id: "feedback", name: "Feedback" },
							]}
						>
							{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
						</field.Select>
					)}
				</form.AppField>
				<form.AppField
					name="message"
					validators={{
						onChange: ({ value }) =>
							!value ? "Message is required" : undefined,
					}}
				>
					{(field) => (
						<field.Textarea
							label="Message"
							description="Tell us how we can help"
							isRequired
							textareaProps={{
								placeholder: "Tell us how we can help...",
							}}
						/>
					)}
				</form.AppField>
				<form.AppField
					name="notifications"
					validators={{
						onChange: ({ value }) =>
							!value.length ? "Notification preference is required" : undefined,
					}}
				>
					{(field) => (
						<field.CheckboxGroup
							label="Notifications"
							description="We'll email you a copy for your records"
							isRequired
						>
							<Checkbox value="sendCopy">
								Send me a copy of this message
							</Checkbox>
						</field.CheckboxGroup>
					)}
				</form.AppField>
				<form.AppForm>
					<form.SubmitButton loadingText="Sending message..." variant="solid">
						Send Message
					</form.SubmitButton>
				</form.AppForm>
			</div>
		);
	},
});

export const ReusableContactForm: Story = {
	render: (props) => {
		const form = useAppForm({
			defaultValues: {
				name: "",
				email: "",
				subject: "",
				topic: "",
				message: "",
				notifications: [] as Array<string>,
			},
			onSubmit: async ({ value }) => {
				alert(`Contact form submitted: ${JSON.stringify(value, null, 2)}`);
			},
		});

		return (
			<Form
				{...props}
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<ContactFormComponent form={form} title="Get in Touch" />
			</Form>
		);
	},
};
