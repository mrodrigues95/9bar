import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useAppForm } from "@9bar/toolkit/components/composed";
import { RecipeForm } from "../../-form/recipe-form";
import {
	logToRecipeFormValues,
	recipeFormOpts,
	recipeToFormValues,
} from "../../-form/schemas/recipe-schema";
import { buildLogGraph, buildRecipeGraph } from "../../../../../utils/data";
import { DuplicateRecipeAlert } from "./-duplicate-recipe-alert";
import { SaveLogAsRecipeAlert } from "./-save-log-as-recipe-alert";

const NewRecipe = () => {
	const { duplicateOf, fromLog } = Route.useRouteContext();
	const navigate = useNavigate();
	const form = useAppForm({
		...recipeFormOpts,
		defaultValues: fromLog
			? logToRecipeFormValues(fromLog)
			: duplicateOf
				? { ...recipeToFormValues(duplicateOf), name: `Copy of ${duplicateOf.name}` }
				: recipeFormOpts.defaultValues,
		onSubmit: async ({ value }) => {
			// TODO(save-log-as-recipe): server fn that creates the recipe and attaches the source log to it.
			console.log("Recipe created:", value);
			navigate({ to: "/recipes" });
		},
	});

	return (
		<>
			{!!fromLog && <SaveLogAsRecipeAlert log={fromLog} />}
			{!!duplicateOf && <DuplicateRecipeAlert recipe={duplicateOf} />}
			<RecipeForm form={form} mode="create" />
		</>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/_form/new")({
	staticData: { breadcrumb: { label: "New" } },
	validateSearch: z.object({
		duplicateOf: z.coerce.number().int().positive().catch(Number.NaN).optional(),
		fromLog: z.coerce.number().int().positive().catch(Number.NaN).optional(),
	}),
	beforeLoad: ({ search }) => {
		const duplicateOf = search.duplicateOf ? buildRecipeGraph(search.duplicateOf) : undefined;
		const fromLog = search.fromLog ? buildLogGraph(search.fromLog) : undefined;
		if ((search.duplicateOf && !duplicateOf) || (search.fromLog && !fromLog)) {
			throw redirect({ to: "/recipes", replace: true });
		}
		return { duplicateOf, fromLog };
	},
	component: NewRecipe,
});
