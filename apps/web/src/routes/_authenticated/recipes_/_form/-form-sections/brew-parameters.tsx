import { withForm } from "@9bar/toolkit";
import { FormSection, recipeFormOpts } from "./form-section";

const BREW_TIME_UNIT_OPTIONS = [
	{ id: "s", label: "Seconds (s)" },
	{ id: "m", label: "Minutes (m)" },
];

const TEMPERATURE_UNIT_OPTIONS = [
	{ id: "C", label: "Celsius (°C)" },
	{ id: "F", label: "Fahrenheit (°F)" },
];

export const BrewParametersFormSection = withForm({
	...recipeFormOpts,
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
						<field.InputGroupSelect
							label="Brew Time"
							description="Total extraction time from first drip."
							items={BREW_TIME_UNIT_OPTIONS}
							inputProps={{
								type: "number",
								step: "0.1",
								min: "0",
								"aria-label": "Brew time value",
							}}
							selectProps={{ "aria-label": "Brew time unit" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="temperature">
					{(field) => (
						<field.InputGroupSelect
							label="Temperature"
							description="Brew water temperature setting."
							items={TEMPERATURE_UNIT_OPTIONS}
							inputProps={{
								type: "number",
								step: "0.1",
								min: "0",
								"aria-label": "Temperature value",
							}}
							selectProps={{ "aria-label": "Temperature unit" }}
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
