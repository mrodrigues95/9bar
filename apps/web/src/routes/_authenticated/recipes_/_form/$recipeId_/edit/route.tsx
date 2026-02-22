import { useAppForm } from "@9bar/toolkit";
import {
	createFileRoute,
	useNavigate,
	useRouteContext,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { recipeFormOpts } from "../../-form-sections/form-section";
import { RecipeForm } from "../../-form-sections/recipe-form";

const EditRecipe = () => {
	const { recipe } = useRouteContext({
		from: "/_authenticated/recipes_/_form/$recipeId_",
	});
	const { convert } = Route.useSearch();
	const navigate = useNavigate();
	const isConverting = convert === "log";
	const { id: _, ...recipeDefaults } = recipe;

	const form = useAppForm({
		...recipeFormOpts,
		defaultValues: {
			...recipeDefaults,
			...(isConverting ? { isStandalone: false } : {}),
		},
		onSubmit: async ({ value }) => {
			console.log("Recipe updated:", value);
			navigate({
				to: "/recipes/$recipeId",
				params: { recipeId: recipe.id },
			});
		},
	});

	return <RecipeForm form={form} />;
};

const searchSchema = z.object({
	convert: z.enum(["log"]).optional(),
});

export const Route = createFileRoute(
	"/_authenticated/recipes_/_form/$recipeId_/edit",
)({
	validateSearch: zodValidator(searchSchema),
	component: EditRecipe,
});
