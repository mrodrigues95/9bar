import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@9bar/toolkit/components/composed";
import { RecipeForm } from "../../-form/recipe-form";
import { recipeFormOpts } from "../../-form/schemas/recipe-schema";

const NewRecipe = () => {
	const navigate = useNavigate();
	const form = useAppForm({
		...recipeFormOpts,
		onSubmit: async ({ value }) => {
			console.log("Recipe created:", value);
			navigate({ to: "/recipes" });
		},
	});

	return <RecipeForm form={form} mode="create" />;
};

export const Route = createFileRoute("/_authenticated/recipes_/_form/new")({
	staticData: { breadcrumb: { label: "New" } },
	component: NewRecipe,
});
