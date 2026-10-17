import { createFileRoute, redirect, useLoaderData, useNavigate } from "@tanstack/react-router";
import { LogFormDialog } from "../../../../-form/log-form-dialog";
import { logToFormValues } from "../../../../-form/schemas/log-schema";
import { buildLogGraph } from "../../../../../../../utils/data";

const EditRecipeLog = () => {
	const { log } = Route.useLoaderData();
	const { recipe } = useLoaderData({ from: "/_authenticated/recipes_/$recipeId" });
	const navigate = useNavigate();

	return (
		<LogFormDialog
			defaultValues={logToFormValues(log)}
			mode="edit"
			onDone={() => {
				navigate({ to: "/recipes/$recipeId/logs", params: { recipeId: String(recipe.id) } });
			}}
		/>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId/logs/$logId/edit")({
	loader: ({ params }) => {
		const log = buildLogGraph(Number(params.logId));
		if (!log || log.recipeId !== Number(params.recipeId)) {
			throw redirect({
				to: "/recipes/$recipeId/logs",
				params: { recipeId: params.recipeId },
			});
		}
		return { log };
	},
	component: EditRecipeLog,
});
