import { createFileRoute, redirect } from "@tanstack/react-router";
import { recipes } from "../../../../../../utils/data";

export const Route = createFileRoute(
	"/_authenticated/recipes_/_form/$recipeId_/edit",
)({
	loader: ({ params }) => {
		const recipe = recipes.find((r) => r.id === params.recipeId);
		if (!recipe) {
			throw redirect({ to: "/recipes" });
		}

		return { recipe };
	},
});
