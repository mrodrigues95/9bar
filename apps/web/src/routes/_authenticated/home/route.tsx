import {
	Alert,
	AlertAction,
	AlertContent,
	AlertDescription,
	AlertIndicator,
	AlertTitle,
	Heading,
} from "@9bar/toolkit";
import { BeakerIcon } from "@heroicons/react/24/solid";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "src/components";

const Home = () => {
	return (
		<div className="space-y-4">
			<Heading as="h1" variant="title">
				9bar
			</Heading>
			<Alert variant="info">
				<AlertIndicator>
					<BeakerIcon />
				</AlertIndicator>
				<AlertContent>
					<AlertTitle>Set your machine & grinder</AlertTitle>
					<AlertDescription>
						Get tailored recommendations based on your setup.
					</AlertDescription>
				</AlertContent>
				<AlertAction>
					<Link to="/profile">Set up now</Link>
				</AlertAction>
			</Alert>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/home")({
	component: Home,
});
