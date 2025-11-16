import { Alert, Heading } from "@9bar/toolkit";
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
				<Alert.Indicator>
					<BeakerIcon />
				</Alert.Indicator>
				<Alert.Content>
					<Alert.Title>Set your machine & grinder</Alert.Title>
					<Alert.Description>
						Get tailored recommendations based on your setup.
					</Alert.Description>
				</Alert.Content>
				<Alert.Action>
					<Link to="/profile">Set up now</Link>
				</Alert.Action>
			</Alert>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/home")({
	component: Home,
});
