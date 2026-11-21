import { createFileRoute, useNavigate, useRouteContext } from "@tanstack/react-router";
import { useAppForm } from "@9bar/toolkit/components/composed";
import { RecipeForm } from "../../../-form/recipe-form";
import { recipeFormOpts, recipeToFormValues } from "../../../-form/schemas/recipe-schema";
import { logStubSave } from "../../../../../../utils/stub-save";

const EditRecipe = () => {
	const { recipe } = useRouteContext({
		from: "/_authenticated/recipes_/_form/$recipeId_",
	});
	const navigate = useNavigate();
	const form = useAppForm({
		...recipeFormOpts,
		defaultValues: recipeToFormValues(recipe),
		onSubmit: async ({ value }) => {
			logStubSave("Recipe updated:", value);
			await navigate({
				to: "/recipes/$recipeId",
				params: { recipeId: String(recipe.id) },
			});
		},
	});

	return <RecipeForm form={form} mode="edit" recipeId={String(recipe.id)} />;
};

export const Route = createFileRoute("/_authenticated/recipes_/_form/$recipeId_/edit")({
	staticData: { breadcrumb: { label: "Edit" } },
	component: EditRecipe,
});
