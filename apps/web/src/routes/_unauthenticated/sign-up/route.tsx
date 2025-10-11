import { Button, Form, Heading, TextField } from "@9bar/toolkit";
import { createFileRoute } from "@tanstack/react-router";

const SignUp = () => {
	return (
		<>
			<Heading as="h1" variant="heading" className="mb-8 text-center">
				Sign Up
			</Heading>
			<Form className="w-full">
				<TextField
					name="name"
					label="Name"
					inputProps={{ maxLength: 70 }}
					isRequired
				/>
				<TextField
					name="email"
					type="email"
					label="Email address"
					autoComplete="email"
					isRequired
				/>
				<TextField
					name="password"
					type="password"
					label="Password"
					autoComplete="current-password"
					inputProps={{ minLength: 6 }}
					isRequired
				/>
				<Button type="submit" variant="solid" size="md" className="w-full">
					Create your account
				</Button>
			</Form>
		</>
	);
};

export const Route = createFileRoute("/_unauthenticated/sign-up")({
	component: SignUp,
});
