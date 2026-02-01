import { SelectItem, withForm } from "@9bar/toolkit";
import { FormSection, newRecipeFormOpts } from "./form-section";

export const BasicInformationFormSection = withForm({
	...newRecipeFormOpts,
	render: function Render({ form }) {
		return (
			<FormSection title="Basic Information">
				<form.AppField name="name">
					{(field) => (
						<field.Input
							label="Name"
							description="Give your recipe a memorable name."
							className="sm:col-span-2"
							maxLength={100}
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="grindSize">
					{(field) => (
						<field.Input
							label="Grind Size"
							description="The grind setting used on your grinder."
							maxLength={50}
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="beans">
					{(field) => (
						<field.Input
							label="Beans"
							description="The coffee beans or blend used for this recipe."
							maxLength={150}
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="grinder">
					{(field) => (
						<field.Select
							label="Grinder"
							description="The grinder used to grind your coffee."
							isRequired
							placeholder="Select a grinder"
							items={[
								{ id: "comandante", name: "Comandante" },
								{ id: "niche-zero", name: "Niche Zero" },
								{ id: "baratza-sette", name: "Baratza Sette 270" },
								{ id: "eureka-mignon", name: "Eureka Mignon" },
								{ id: "other", name: "Other" },
							]}
						>
							{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
						</field.Select>
					)}
				</form.AppField>
				<form.AppField name="machine">
					{(field) => (
						<field.Select
							label="Machine"
							description="The espresso machine used for brewing."
							isRequired
							placeholder="Select a machine"
							items={[
								{ id: "la-pavoni", name: "La Pavoni" },
								{ id: "gaggia-classic", name: "Gaggia Classic" },
								{ id: "rancilio-silvia", name: "Rancilio Silvia" },
								{ id: "breville-barista", name: "Breville Barista Express" },
								{ id: "lelit-bianca", name: "Lelit Bianca" },
								{ id: "other", name: "Other" },
							]}
						>
							{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
						</field.Select>
					)}
				</form.AppField>
			</FormSection>
		);
	},
});
