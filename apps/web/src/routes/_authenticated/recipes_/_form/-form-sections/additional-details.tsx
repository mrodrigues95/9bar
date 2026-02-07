import { withForm } from "@9bar/toolkit";
import { FormSection, recipeFormOpts } from "./form-section";

export const AdditionalDetailsFormSection = withForm({
	...recipeFormOpts,
	render: function Render({ form }) {
		return (
			<FormSection
				title="Additional Details"
				panelProps={{ className: "flex" }}
			>
				<form.AppField name="isQuickLog">
					{(field) => (
						<field.Checkbox
							label="Quick Log"
							description="Mark this as a quick log for faster reference."
						/>
					)}
				</form.AppField>
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
