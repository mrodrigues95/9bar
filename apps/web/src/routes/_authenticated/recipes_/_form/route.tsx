import { Heading, Text } from "@9bar/toolkit";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useRecipeFormMode } from "./-form-sections/use-recipe-form-mode";

const RecipeFormLayout = () => {
	const { isEditingRecipe, isEditingLog, isCreatingLog } = useRecipeFormMode();

	let title = "New Recipe";
	if (isEditingRecipe) {
		title = "Edit Recipe";
	} else if (isEditingLog) {
		title = "Edit Log";
	} else if (isCreatingLog) {
		title = "New Log";
	}

	return (
		<section>
			<Heading as="h1" variant="heading">
				{title}
			</Heading>
			<Text variant="body-sm" className="mb-6">
				{isEditingLog || isCreatingLog
					? "Log your espresso brew with detailed parameters and notes."
					: "Track your espresso recipe with detailed parameters and notes."}
			</Text>
			<Outlet />
		</section>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/_form")({
	component: RecipeFormLayout,
});
