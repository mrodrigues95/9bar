import { useAppForm } from "@9bar/toolkit";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { recipeFormOpts } from "../../../../-form-sections/form-section";
import { RecipeForm } from "../../../../-form-sections/recipe-form";

const EditLog = () => {
	const { recipe } = Route.useLoaderData();
	const navigate = useNavigate();
	const { id: _, ...recipeDefaults } = recipe;

	const form = useAppForm({
		...recipeFormOpts,
		defaultValues: recipeDefaults,
		onSubmit: async ({ value }) => {
			console.log("Log updated:", value);
			navigate(
				recipe.isStandalone
					? { to: "/recipes" }
					: {
							to: "/recipes/$recipeId/logs",
							params: { recipeId: recipe.id },
						},
			);
		},
	});

	return <RecipeForm form={form} />;
};

export const Route = createFileRoute(
	"/_authenticated/recipes_/_form/$recipeId_/logs/$logId/edit",
)({
	loader: ({ context, params }) => {
		const log = context.recipe.logs.find((l) => l.id === params.logId);
		if (!log) {
			throw redirect({
				to: "/recipes/$recipeId/logs",
				params: { recipeId: params.recipeId },
			});
		}

		return { recipe: context.recipe, log };
	},
	component: EditLog,
});
