import { createFileRoute, Outlet, useMatch } from "@tanstack/react-router";
import { Heading, Text } from "@9bar/toolkit/components";
import { AppBreadcrumbs } from "../../../../components";

const RecipeFormLayout = () => {
	const isCreatingRecipe = !!useMatch({
		from: "/_authenticated/recipes_/_form/new",
		shouldThrow: false,
	});

	return (
		<section>
			<AppBreadcrumbs aria-label="Recipe navigation" className="mb-6" />
			<Heading as="h1" variant="heading">
				{isCreatingRecipe ? "New Recipe" : "Edit Recipe"}
			</Heading>
			<Text variant="body-sm" className="mb-6">
				Track your espresso recipe with detailed parameters and notes.
			</Text>
			<Outlet />
		</section>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/_form")({
	component: RecipeFormLayout,
});
