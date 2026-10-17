import { createFieldMap } from "@tanstack/react-form";
import { withFieldGroup } from "@9bar/toolkit/components/composed";
import type { AdditionalDetailsValues } from "../schemas/field-schema";
import { FormSection } from "./form-section";

export const additionalDetailsDefaults: AdditionalDetailsValues = {
	notes: "",
};

export const additionalDetailsFields = createFieldMap(additionalDetailsDefaults);

export const AdditionalDetailsFields = withFieldGroup({
	defaultValues: additionalDetailsDefaults,
	render: function Render({ group, children }) {
		return (
			<FormSection title="Additional Details">
				{children}
				<group.AppField name="notes">
					{(field) => (
						<field.Textarea
							label="Notes"
							description="Optional notes about your brew, tasting notes, or adjustments."
							maxLength={2000}
							className="sm:col-span-2"
						/>
					)}
				</group.AppField>
			</FormSection>
		);
	},
});
