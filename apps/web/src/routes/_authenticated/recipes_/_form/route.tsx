import { Form, Heading, Separator, Text, useAppForm } from "@9bar/toolkit";
import { createFileRoute, useMatch, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Link } from "../../../../components";
import { AdditionalDetailsFormSection } from "./-form-sections/additional-details";
import { BasicInformationFormSection } from "./-form-sections/basic-information";
import { BrewParametersFormSection } from "./-form-sections/brew-parameters";
import { recipeFormOpts } from "./-form-sections/form-section";

const RecipeFormLayout = () => {
	const { convert } = Route.useSearch();
	const navigate = useNavigate();
	const editMatch = useMatch({
		from: "/_authenticated/recipes_/_form/$recipeId_/edit",
		shouldThrow: false,
	});
	const recipe = editMatch?.loaderData?.recipe;
	const isEditing = !!recipe;
	const isConverting = convert === "log";

	const form = useAppForm({
		...recipeFormOpts,
		...(isEditing
			? {
					defaultValues: {
						...recipe,
						...(isConverting ? { isQuickLog: false } : {}),
					},
				}
			: {}),
		onSubmit: async ({ value }) => {
			console.log("Recipe updated:", value);
			navigate(
				isEditing
					? {
							to: "/recipes/$recipeId",
							params: { recipeId: editMatch.params.recipeId },
						}
					: { to: "/recipes" },
			);
		},
	});

	return (
		<section>
			<Heading as="h1" variant="heading">
				{isConverting
					? "Convert to Recipe"
					: isEditing
						? "Edit Recipe"
						: "New Recipe"}
			</Heading>
			<Text variant="body-sm">
				Track your espresso recipe with detailed parameters and notes.
			</Text>
			<Form
				className="mt-6 space-y-6"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<BasicInformationFormSection form={form} />
				<BrewParametersFormSection form={form} />
				<AdditionalDetailsFormSection form={form} />
				<Separator />
				<div className="flex items-center justify-end gap-2">
					<Link
						{...(isEditing
							? {
									to: "/recipes/$recipeId",
									params: { recipeId: editMatch.params.recipeId },
								}
							: { to: "/recipes" })}
						variant="outline"
					>
						Cancel
					</Link>
					<form.AppForm>
						<form.SubmitButton variant="solid" loadingText="Saving...">
							{isEditing ? "Save Recipe" : "Create Recipe"}
						</form.SubmitButton>
					</form.AppForm>
				</div>
			</Form>
		</section>
	);
};

const searchSchema = z.object({
	convert: z.enum(["log"]).optional(),
});

export const Route = createFileRoute("/_authenticated/recipes_/_form")({
	validateSearch: zodValidator(searchSchema),
	component: RecipeFormLayout,
});
