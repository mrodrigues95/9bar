import { useAppForm } from "@9bar/toolkit";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { recipeFormOpts } from "../-form-sections/form-section";
import { RecipeForm } from "../-form-sections/recipe-form";

const NewRecipe = () => {
	const navigate = useNavigate();

	const form = useAppForm({
		...recipeFormOpts,
		onSubmit: async ({ value }) => {
			console.log("Recipe created:", value);
			navigate({ to: "/recipes" });
		},
	});

	return <RecipeForm form={form} />;
};

export const Route = createFileRoute("/_authenticated/recipes_/_form/new")({
	component: NewRecipe,
});
