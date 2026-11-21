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
import { logStubSave } from "../../../../../utils/stub-save";
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
			logStubSave("Recipe created:", value);
			await navigate({ to: "/recipes" });
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

const isId = (value: number | undefined): value is number =>
	value !== undefined && !Number.isNaN(value);

export const Route = createFileRoute("/_authenticated/recipes_/_form/new")({
	staticData: { breadcrumb: { label: "New" } },
	validateSearch: z.object({
		duplicateOf: z.coerce.number().int().positive().catch(Number.NaN).optional(),
		fromLog: z.coerce.number().int().positive().catch(Number.NaN).optional(),
	}),
	beforeLoad: ({ search }) => {
		const duplicateOf = isId(search.duplicateOf) ? buildRecipeGraph(search.duplicateOf) : undefined;
		const fromLog = isId(search.fromLog) ? buildLogGraph(search.fromLog) : undefined;
		if (
			(isId(search.duplicateOf) && duplicateOf === undefined) ||
			(isId(search.fromLog) && fromLog === undefined)
		) {
			throw redirect({ to: "/recipes", replace: true });
		}
		return { duplicateOf, fromLog };
	},
	component: NewRecipe,
});
