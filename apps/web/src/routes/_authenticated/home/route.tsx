import { Heading, Text } from "@9bar/toolkit";
import { createFileRoute } from "@tanstack/react-router";

const HomePage = () => {
	return (
		<div className="space-y-4">
			<Heading as="h1" variant="title">
				Home
			</Heading>
			<Text as="p" variant="body-lg">
				Welcome to your home page. This is where you can view your dashboard and
				recent activity.
			</Text>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/home")({
	component: HomePage,
});
