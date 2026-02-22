import { withForm } from "@9bar/toolkit";
import { FormSection, recipeFormOpts } from "./form-section";
import { useRecipeFormMode } from "./use-recipe-form-mode";

export const AdditionalDetailsFormSection = withForm({
	...recipeFormOpts,
	render: function Render({ form }) {
		const { isCreatingRecipe } = useRecipeFormMode();
		return (
			<FormSection
				title="Additional Details"
				panelProps={{ className: "flex" }}
			>
				{isCreatingRecipe && (
					<form.AppField name="isStandalone">
						{(field) => (
							<field.Checkbox
								label="Log"
								description="Mark this as a log for faster reference."
							/>
						)}
					</form.AppField>
				)}
				<form.AppField name="notes">
					{(field) => (
						<field.Textarea
							label="Notes"
							description="Optional notes about your brew, tasting notes, or adjustments."
							maxLength={2000}
						/>
					)}
				</form.AppField>
			</FormSection>
		);
	},
});
