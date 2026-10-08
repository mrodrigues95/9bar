import { createFileRoute, redirect } from "@tanstack/react-router";
import { withBreadcrumb } from "../../../../../components";
import { buildRecipeGraph } from "../../../../../utils/data";

export const Route = createFileRoute("/_authenticated/recipes_/_form/$recipeId_")({
	beforeLoad: ({ params }) => {
		const recipe = buildRecipeGraph(Number(params.recipeId));
		if (!recipe) {
			throw redirect({ to: "/recipes" });
		}
		return { recipe };
	},
	loader: ({ context }) => {
		return withBreadcrumb(
			{},
			{
				label: context.recipe.name || "Untitled",
				disabled: context.recipe.isQuickBrew,
			},
		);
	},
});
