import { withForm } from "@9bar/toolkit";
import { FormSection, newRecipeFormOpts } from "./form-section";

export const BrewParametersFormSection = withForm({
	...newRecipeFormOpts,
	render: function Render({ form }) {
		return (
			<FormSection title="Brew Parameters">
				<form.AppField name="dose">
					{(field) => (
						<field.Input
							label="Dose (g)"
							description="Weight of dry coffee grounds in grams."
							isRequired
							inputProps={{ type: "number", step: "0.1", min: "0" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="yield">
					{(field) => (
						<field.Input
							label="Yield (g)"
							description="Weight of espresso output in grams."
							isRequired
							inputProps={{ type: "number", step: "0.1", min: "0" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="brewTime">
					{(field) => (
						<field.Input
							label="Brew Time"
							description="Total extraction time from first drip."
							isRequired
							inputProps={{ placeholder: "e.g., 25s or 0:25" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="temperature">
					{(field) => (
						<field.Input
							label="Temperature"
							description="Brew water temperature setting."
							inputProps={{ placeholder: "e.g., 93°C or 200°F" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="pressure">
					{(field) => (
						<field.Input
							label="Pressure (bars)"
							description="Pump pressure during extraction."
							inputProps={{ type: "number", step: "0.1", min: "0" }}
						/>
					)}
				</form.AppField>
			</FormSection>
		);
	},
});
