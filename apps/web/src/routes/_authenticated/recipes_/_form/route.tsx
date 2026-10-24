import { createFileRoute, Outlet, useMatch } from "@tanstack/react-router";
import { Page, PageHeader } from "../../../../components";

const RecipeFormLayout = () => {
	const isCreatingRecipe = !!useMatch({
		from: "/_authenticated/recipes_/_form/new",
		shouldThrow: false,
	});

	return (
		<Page breadcrumbsProps={{ "aria-label": "Recipe navigation" }}>
			<PageHeader
				title={isCreatingRecipe ? "New Recipe" : "Edit Recipe"}
				description="Track your espresso recipe with detailed parameters and notes."
			/>
			<Outlet />
		</Page>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/_form")({
	component: RecipeFormLayout,
});
