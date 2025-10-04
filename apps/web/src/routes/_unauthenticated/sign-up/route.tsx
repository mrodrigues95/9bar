import { Button, Form, TextField } from "@9bar/toolkit";
import { createFileRoute } from "@tanstack/react-router";

const SignUp = () => {
	return (
		<>
			<h1 className="mb-8 text-center font-bold text-3xl">Sign Up</h1>
			<Form className="w-full">
				<TextField
					name="name"
					label="Name"
					inputProps={{ placeholder: "you@example.com", maxLength: 70 }}
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
