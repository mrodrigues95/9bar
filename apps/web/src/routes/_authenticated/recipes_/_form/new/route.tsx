import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useAppForm } from "@9bar/toolkit/components/composed";
import { RecipeForm } from "../../-form/recipe-form";
import { recipeFormOpts, recipeToFormValues } from "../../-form/schemas/recipe-schema";
import { buildRecipeGraph } from "../../../../../utils/data";
import { DuplicateNotice } from "./-duplicate-notice";

const NewRecipe = () => {
	const { source } = Route.useRouteContext();
	const navigate = useNavigate();
	const form = useAppForm({
		...recipeFormOpts,
		defaultValues: source
			? { ...recipeToFormValues(source), name: `Copy of ${source.name}` }
			: recipeFormOpts.defaultValues,
		onSubmit: async ({ value }) => {
			console.log("Recipe created:", value);
			navigate({ to: "/recipes" });
		},
	});

	return (
		<>
			{!!source && <DuplicateNotice source={source} />}
			<RecipeForm form={form} mode="create" />
		</>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/_form/new")({
	staticData: { breadcrumb: { label: "New" } },
	validateSearch: z.object({
		duplicateOf: z.coerce.number().int().positive().catch(Number.NaN).optional(),
	}),
	beforeLoad: ({ search }) => {
		if (!search.duplicateOf) {
			return { source: null };
		}
		const source = buildRecipeGraph(search.duplicateOf);
		if (!source) {
			throw redirect({ to: "/recipes", replace: true });
		}
		return { source };
	},
	component: NewRecipe,
});
