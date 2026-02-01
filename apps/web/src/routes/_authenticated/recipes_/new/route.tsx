import { Form, Heading, Separator, Text, useAppForm } from "@9bar/toolkit";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppBreadcrumbs, Link } from "../../../../components";
import { AdditionalDetailsFormSection } from "./-form-sections/additional-details";
import { BasicInformationFormSection } from "./-form-sections/basic-information";
import { BrewParametersFormSection } from "./-form-sections/brew-parameters";
import { newRecipeFormOpts } from "./-form-sections/form-section";

const NewRecipe = () => {
	const navigate = useNavigate();

	const form = useAppForm({
		...newRecipeFormOpts,
		onSubmit: async ({ value }) => {
			console.log("Form submitted:", value);
			// TODO: Implement API call to save recipe
			// For now, just navigate back to recipes list
			navigate({ to: "/recipes" });
		},
	});

	return (
		<section>
			<AppBreadcrumbs aria-label="New recipe navigation" className="mb-4" />
			<Heading as="h1" variant="heading">
				New Recipe
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
					<Link to="/recipes" variant="outline">
						Cancel
					</Link>
					<form.AppForm>
						<form.SubmitButton variant="solid" loadingText="Creating...">
							Create Recipe
						</form.SubmitButton>
					</form.AppForm>
				</div>
			</Form>
		</section>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/new")({
	component: NewRecipe,
	staticData: {
		breadcrumb: { label: "New Recipe", parent: "/_authenticated/recipes" },
	},
});
