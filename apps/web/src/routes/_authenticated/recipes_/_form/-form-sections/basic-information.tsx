import { SelectItem, withForm } from "@9bar/toolkit";
import { grinderOptions, machineOptions } from "../../../../../utils/data";
import { FormSection, recipeFormOpts } from "./form-section";
import { useRecipeFormMode } from "./use-recipe-form-mode";

export const BasicInformationFormSection = withForm({
	...recipeFormOpts,
	render: function Render({ form }) {
		const {
			matches: { editLogMatch },
			isCreatingLog,
			isEditingLog,
		} = useRecipeFormMode();

		let isDisabled = false;
		if (isCreatingLog) {
			isDisabled = true;
		} else if (isEditingLog) {
			isDisabled = !editLogMatch?.context?.recipe?.isStandalone;
		}

		return (
			<FormSection title="Basic Information">
				{!isCreatingLog && !isEditingLog && (
					<form.AppField name="name">
						{(field) => (
							<field.Input
								label="Name"
								description="Give your recipe a memorable name."
								className="sm:col-span-2"
								maxLength={100}
								isDisabled={isDisabled}
								isRequired
							/>
						)}
					</form.AppField>
				)}
				<form.AppField name="grindSize">
					{(field) => (
						<field.Input
							label="Grind Size"
							description="The grind setting used on your grinder."
							maxLength={50}
							isDisabled={isDisabled}
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
							isDisabled={isDisabled}
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
							items={grinderOptions}
							isDisabled={isDisabled}
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
							items={machineOptions}
							isDisabled={isDisabled}
						>
							{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
						</field.Select>
					)}
				</form.AppField>
			</FormSection>
		);
	},
});
