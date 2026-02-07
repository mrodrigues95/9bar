import { Form, Heading, Separator, Text, useAppForm } from "@9bar/toolkit";
import {
	createFileRoute,
	useMatchRoute,
	useNavigate,
} from "@tanstack/react-router";
import { Link } from "../../../../components";
import { AdditionalDetailsFormSection } from "./-form-sections/additional-details";
import { BasicInformationFormSection } from "./-form-sections/basic-information";
import { BrewParametersFormSection } from "./-form-sections/brew-parameters";
import { recipeFormOpts } from "./-form-sections/form-section";

const PLACEHOLDER_RECIPE = {
	name: "Morning Espresso",
	grindSize: "6",
	grinder: "eureka-mignon",
	machine: "rancilio-silvia",
	dose: "18",
	yield: "36",
	brewTime: "28s",
	beans: "Sunset Roast Espresso Blend",
	temperature: "93°C",
	pressure: "9",
	isQuickLog: false,
	notes: "Sweet caramel aroma, balanced acidity.",
};

const RecipeFormLayout = () => {
	const matchRoute = useMatchRoute();
	const navigate = useNavigate();
	const match = matchRoute({ to: "/recipes/$recipeId/edit" });
	const isEditing = !!match;

	const form = useAppForm({
		...recipeFormOpts,
		...(isEditing ? { defaultValues: PLACEHOLDER_RECIPE } : {}),
		onSubmit: async ({ value }) => {
			console.log("Recipe updated:", value);
			// TODO: Implement API call to update recipe
			navigate(
				isEditing
					? { to: "/recipes/$recipeId", params: { recipeId: match.recipeId } }
					: { to: "/recipes" },
			);
		},
	});

	return (
		<section>
			<Heading as="h1" variant="heading">
				{isEditing ? "Edit Recipe" : "New Recipe"}
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
									params: { recipeId: match.recipeId },
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

export const Route = createFileRoute("/_authenticated/recipes_/_form")({
	component: RecipeFormLayout,
});
