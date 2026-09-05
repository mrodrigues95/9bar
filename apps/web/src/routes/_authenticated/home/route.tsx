import { createFileRoute } from "@tanstack/react-router";
import { Beaker } from "lucide-react";
import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
	Heading,
} from "@9bar/toolkit/components";
import { Link } from "../../../components";

const Home = () => {
	return (
		<div className="space-y-4">
			<Heading as="h1" variant="title">
				9bar
			</Heading>
			<Alert variant="default">
				<Beaker />
				<AlertTitle>Set your machine & grinder</AlertTitle>
				<AlertDescription>Get tailored recommendations based on your setup.</AlertDescription>
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
