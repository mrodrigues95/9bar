import { Form, Separator, withForm } from "@9bar/toolkit";
import { Link } from "../../../../../components";
import { AdditionalDetailsFormSection } from "./additional-details";
import { BasicInformationFormSection } from "./basic-information";
import { BrewParametersFormSection } from "./brew-parameters";
import { recipeFormOpts } from "./form-section";
import { useRecipeFormMode } from "./use-recipe-form-mode";

export const RecipeForm = withForm({
	...recipeFormOpts,
	render: function Render({ form }) {
		const {
			matches: { recipeLayoutMatch },
			isCreatingLog,
			isEditingRecipe,
			isCreatingRecipe,
			isEditingLog,
		} = useRecipeFormMode();
		const recipe = recipeLayoutMatch?.context?.recipe;

		return (
			<Form
				className="space-y-6"
				onSubmit={() => {
					form.handleSubmit();
				}}
			>
				<BasicInformationFormSection form={form} />
				<BrewParametersFormSection form={form} />
				<AdditionalDetailsFormSection form={form} />
				<Separator />
				<div className="flex items-center justify-end gap-2">
					<Link
						variant="outline"
						{...(!recipe || (isEditingLog && recipe.isStandalone)
							? { to: "/recipes" }
							: { to: "/recipes/$recipeId", params: { recipeId: recipe.id } })}
					>
						Cancel
					</Link>
					<form.AppForm>
						<form.SubmitButton variant="solid" loadingText="Saving...">
							{isCreatingLog && "Create Log"}
							{isEditingLog && "Save Log"}
							{isCreatingRecipe && "Create Recipe"}
							{isEditingRecipe && "Save Recipe"}
						</form.SubmitButton>
					</form.AppForm>
				</div>
			</Form>
		);
	},
});
