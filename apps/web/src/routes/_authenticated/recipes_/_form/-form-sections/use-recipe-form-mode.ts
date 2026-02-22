import { useMatch } from "@tanstack/react-router";

export const useRecipeFormMode = () => {
	const editRecipeMatch = useMatch({
		from: "/_authenticated/recipes_/_form/$recipeId_/edit",
		shouldThrow: false,
	});
	const newRecipeMatch = useMatch({
		from: "/_authenticated/recipes_/_form/new",
		shouldThrow: false,
	});
	const newLogMatch = useMatch({
		from: "/_authenticated/recipes_/_form/$recipeId_/logs/new",
		shouldThrow: false,
	});
	const editLogMatch = useMatch({
		from: "/_authenticated/recipes_/_form/$recipeId_/logs/$logId/edit",
		shouldThrow: false,
	});
	const recipeLayoutMatch = useMatch({
		from: "/_authenticated/recipes_/_form/$recipeId_",
		shouldThrow: false,
	});

	const isEditingRecipe = !!editRecipeMatch;
	const isCreatingRecipe = !!newRecipeMatch;
	const isCreatingLog = !!newLogMatch;
	const isEditingLog = !!editLogMatch;

	return {
		matches: {
			editRecipeMatch,
			newRecipeMatch,
			newLogMatch,
			editLogMatch,
			recipeLayoutMatch,
		},
		isEditingRecipe,
		isCreatingRecipe,
		isCreatingLog,
		isEditingLog,
	};
};
