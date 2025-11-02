import { Heading, Text } from "@9bar/toolkit";
import { createFileRoute } from "@tanstack/react-router";

const RecipePage = () => {
	return (
		<div className="space-y-4">
			<Heading as="h1" variant="title">
				Recipe
			</Heading>
			<Text as="p" variant="body-lg">
				Browse and manage your espresso recipes. Create, edit, and track your
				favorite brewing methods.
			</Text>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/recipe")({
	component: RecipePage,
});
