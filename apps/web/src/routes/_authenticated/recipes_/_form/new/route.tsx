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
import { DuplicateRecipeNotice } from "./-duplicate-recipe-notice";
import { SaveLogAsRecipeNotice } from "./-save-log-as-recipe-notice";

const NewRecipe = () => {
	const { duplicateSource, logSource } = Route.useRouteContext();
	const navigate = useNavigate();
	const form = useAppForm({
		...recipeFormOpts,
		defaultValues: logSource
			? logToRecipeFormValues(logSource)
			: duplicateSource
				? { ...recipeToFormValues(duplicateSource), name: `Copy of ${duplicateSource.name}` }
				: recipeFormOpts.defaultValues,
		onSubmit: async ({ value }) => {
			// TODO(save-log-as-recipe): server fn that creates the recipe and attaches the source log to it.
			console.log("Recipe created:", value);
			navigate({ to: "/recipes" });
		},
	});

	return (
		<>
			{!!logSource && <SaveLogAsRecipeNotice log={logSource} />}
			{!!duplicateSource && <DuplicateRecipeNotice recipe={duplicateSource} />}
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
		const duplicateSource = search.duplicateOf ? buildRecipeGraph(search.duplicateOf) : undefined;
		const logSource = search.fromLog ? buildLogGraph(search.fromLog) : undefined;
		if ((search.duplicateOf && !duplicateSource) || (search.fromLog && !logSource)) {
			throw redirect({ to: "/recipes", replace: true });
		}
		return { duplicateSource, logSource };
	},
	component: NewRecipe,
});
