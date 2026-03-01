import { createFileRoute, redirect } from "@tanstack/react-router";
import { withBreadcrumb } from "../../../../../components";
import { recipes } from "../../../../../utils/data";

export const Route = createFileRoute(
	"/_authenticated/recipes_/_form/$recipeId_",
)({
	beforeLoad: ({ params }) => {
		const recipe = recipes.find((r) => r.id === Number(params.recipeId));
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
