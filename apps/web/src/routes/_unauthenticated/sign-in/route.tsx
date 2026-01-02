import { Button, Form, Heading, TextField } from "@9bar/toolkit";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "../../../components";

const SignIn = () => {
	return (
		<>
			<Heading as="h1" variant="heading" className="mb-8 text-center">
				Sign In
			</Heading>
			<Form className="w-full">
				<TextField
					name="email"
					type="email"
					label="Email address"
					autoComplete="email"
					isRequired
				/>
				<div className="relative">
					<TextField
						name="password"
						type="password"
						label="Password"
						autoComplete="current-password"
						isRequired
					/>
					<Link to="/" className="absolute top-0 right-0 p-0 font-normal">
						Forgot password?
					</Link>
				</div>
				<Button type="submit" variant="solid" size="md" className="w-full">
					Sign in to account
				</Button>
			</Form>
			<hr className="mx-auto my-6 w-1/2 border border-border" />
			<div>
				<Button variant="outline" className="w-full" size="md">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="100"
						height="100"
						viewBox="0 0 24 24"
						aria-hidden="true"
						className="size-4"
					>
						<path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"></path>
					</svg>
					Sign in with Google
				</Button>
			</div>
		</>
	);
};

export const Route = createFileRoute("/_unauthenticated/sign-in")({
	component: SignIn,
});
