import { createFieldMap } from "@tanstack/react-form";
import { withFieldGroup } from "@9bar/toolkit/components/composed";
import type { TMethod } from "../../../../../utils/data";
import type { TBrewParametersFields } from "../schemas/field-schema";
import { FormSection } from "./form-section";

const BREW_TIME_UNIT_OPTIONS = [
	{ id: "s", label: "Seconds (s)" },
	{ id: "m", label: "Minutes (m)" },
];

const TEMPERATURE_UNIT_OPTIONS = [
	{ id: "C", label: "Celsius (°C)" },
	{ id: "F", label: "Fahrenheit (°F)" },
];

export const brewParametersDefaults: TBrewParametersFields = {
	grindSize: "",
	dose: 0,
	yield: 0,
	brewTime: { inputValue: 0, selectValue: "s" },
	temperature: { inputValue: 0, selectValue: "C" },
	pressure: 0,
};

export const brewParametersFields = createFieldMap(brewParametersDefaults);

interface BrewParametersFieldsProps {
	method: TMethod;
	isGrindSizeRequired?: boolean;
}

// Exported so the quick-log dialog can focus this input after "Save and log another".
export const grindSizeFieldName = "grindSize" satisfies keyof TBrewParametersFields;

const brewParametersProps: BrewParametersFieldsProps = {
	method: "espresso",
	isGrindSizeRequired: false,
};

const isImmersionOrPourOver = (method: TMethod) => {
	return method === "pour-over" || method === "immersion";
};

const doseLabel = (method: TMethod) => {
	return isImmersionOrPourOver(method) ? "Coffee (g)" : "Dose (g)";
};

const yieldLabel = (method: TMethod) => {
	return isImmersionOrPourOver(method) ? "Water (g)" : "Yield (g)";
};

export const BrewParametersFields = withFieldGroup({
	defaultValues: brewParametersDefaults,
	props: brewParametersProps,
	render: function Render({ group, method, isGrindSizeRequired }) {
		return (
			<FormSection title="Brew Parameters">
				<group.AppField name={grindSizeFieldName}>
					{(field) => (
						<field.Input
							label="Grind Size"
							description="The grind setting used on your grinder."
							maxLength={50}
							isRequired={isGrindSizeRequired}
						/>
					)}
				</group.AppField>
				<group.AppField name="dose">
					{(field) => (
						<field.Input
							label={doseLabel(method)}
							description="Weight of dry coffee grounds."
							isRequired
							inputProps={{ type: "number", step: "0.1", min: "0" }}
						/>
					)}
				</group.AppField>
				<group.AppField name="yield">
					{(field) => (
						<field.Input
							label={yieldLabel(method)}
							description="Weight of the brewed output."
							isRequired
							inputProps={{ type: "number", step: "0.1", min: "0" }}
						/>
					)}
				</group.AppField>
				<group.AppField name="brewTime">
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
				</group.AppField>
				<group.AppField name="temperature">
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
				</group.AppField>
				{method === "espresso" && (
					<group.AppField name="pressure">
						{(field) => (
							<field.Input
								label="Pressure (bars)"
								description="Pump pressure during extraction."
								inputProps={{ type: "number", step: "0.1", min: "0" }}
							/>
						)}
					</group.AppField>
				)}
			</FormSection>
		);
	},
});
