import { SelectItem, withForm } from "@9bar/toolkit";
import { FormSection, recipeFormOpts } from "./form-section";

const BREW_TIME_UNIT_OPTIONS = [
	{ id: "s", name: "Seconds (s)" },
	{ id: "m", name: "Minutes (m)" },
] as const;

const TEMPERATURE_UNIT_OPTIONS = [
	{ id: "C", name: "Celsius (°C)" },
	{ id: "F", name: "Fahrenheit (°F)" },
] as const;

// TODO: implement input group for brew time (value + unit) and temperature (value + unit).
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
						<field.Input
							label="Brew Time"
							description="Total extraction time from first drip."
							isRequired
							inputProps={{ type: "number", step: "0.1", min: "0" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="brewTimeUnit">
					{(field) => (
						<field.Select
							label="Brew Time Unit"
							description="Unit for the brew time value."
							isRequired
							items={BREW_TIME_UNIT_OPTIONS}
						>
							{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
						</field.Select>
					)}
				</form.AppField>
				<form.AppField name="temperature">
					{(field) => (
						<field.Input
							label="Temperature"
							description="Brew water temperature setting."
							inputProps={{ type: "number", step: "0.1", min: "0" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="temperatureUnit">
					{(field) => (
						<field.Select
							label="Temperature Unit"
							description="Unit for the temperature value."
							items={TEMPERATURE_UNIT_OPTIONS}
						>
							{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
						</field.Select>
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
