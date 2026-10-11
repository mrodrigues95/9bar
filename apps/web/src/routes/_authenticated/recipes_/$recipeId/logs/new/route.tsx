import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import { LogSheet } from "../../../-form/log-sheet";
import { recipeToLogFormValues } from "../../../-form/schemas/log-schema";

const NewRecipeLog = () => {
	const { recipe } = useLoaderData({ from: "/_authenticated/recipes_/$recipeId" });
	const navigate = useNavigate();

	return (
		<LogSheet
			defaultValues={recipeToLogFormValues(recipe)}
			mode="create"
			onDone={() => {
				navigate({ to: "/recipes/$recipeId/logs", params: { recipeId: String(recipe.id) } });
			}}
		/>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId/logs/new")({
	component: NewRecipeLog,
});
