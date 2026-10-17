import { useStore } from "@tanstack/react-form";
import type { RefObject } from "react";
import { Button, DialogFooter, SelectItem } from "@9bar/toolkit/components";
import { Form, withForm } from "@9bar/toolkit/components/composed";
import { VERDICT_OPTIONS, buildRecipeGraph, recipes } from "../../../../utils/data";
import { snapshotToFormFields } from "./schemas/field-schema";
import { logFormOpts } from "./schemas/log-schema";
import {
	additionalDetailsFields,
	AdditionalDetailsFields,
} from "./sections/additional-details-fields";
import {
	basicInformationFields,
	BasicInformationFields,
} from "./sections/basic-information-fields";
import { brewParametersFields, BrewParametersFields } from "./sections/brew-parameters-fields";

interface LogFormProps {
	formRef: RefObject<HTMLFormElement | null>;
	onCancel: () => void;
	onLogAnother?: () => void;
}

const logFormProps: LogFormProps = {
	formRef: { current: null },
	onCancel: () => {},
};

const noRecipeOptionId = "no-recipe";
const noRecipeOptionLabel = "No recipe (quick log)";

export const LogForm = withForm({
	...logFormOpts,
	props: logFormProps,
	render: function Render({ form, formRef, onCancel, onLogAnother }) {
		const method = useStore(form.store, (state) => state.values.method);
		const recipeId = useStore(form.store, (state) => state.values.recipeId);

		const applyRecipe = (selectedRecipeId: string | null) => {
			const recipe =
				selectedRecipeId === null ? undefined : buildRecipeGraph(Number(selectedRecipeId));
			if (!recipe) {
				return;
			}
			// Selecting a recipe seeds the log from the recipe's current values.
			const fields = snapshotToFormFields(recipe.snapshot);
			form.setFieldValue("method", fields.method);
			form.setFieldValue("beans", fields.beans);
			form.setFieldValue("grinder", fields.grinder);
			form.setFieldValue("machine", fields.machine);
			form.setFieldValue("grindSize", fields.grindSize);
			form.setFieldValue("dose", fields.dose);
			form.setFieldValue("yield", fields.yield);
			form.setFieldValue("brewTime", fields.brewTime);
			form.setFieldValue("temperature", fields.temperature);
			form.setFieldValue("pressure", fields.pressure);
			form.setFieldValue("notes", fields.notes);
		};

		const recipeItems = [
			{ id: noRecipeOptionId, name: noRecipeOptionLabel },
			...recipes.map((recipe) => ({ id: String(recipe.id), name: recipe.name })),
		];

		return (
			<Form ref={formRef} validationBehavior="aria" onSubmit={() => form.handleSubmit()}>
				<div className="-mx-4 no-scrollbar flex max-h-[50vh] flex-col gap-6 overflow-y-auto px-4">
					<BasicInformationFields
						form={form}
						fields={basicInformationFields}
						isIdentityLocked={recipeId !== null}
					>
						<form.AppField
							name="recipeId"
							listeners={{
								onChange: ({ value, fieldApi }) => {
									if (value === noRecipeOptionId) {
										fieldApi.setValue(null);
										return;
									}
									applyRecipe(value);
								},
							}}
						>
							{(field) => (
								<field.Select
									label="Recipe"
									description="Choosing a recipe fills its current values and locks beans, grinder, and machine."
									className="sm:col-span-2"
									placeholder={noRecipeOptionLabel}
									items={recipeItems}
								>
									{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
								</field.Select>
							)}
						</form.AppField>
					</BasicInformationFields>
					<BrewParametersFields form={form} fields={brewParametersFields} method={method} />
					<AdditionalDetailsFields form={form} fields={additionalDetailsFields}>
						<form.AppField name="shotAt">
							{(field) => (
								<field.DatePicker
									label="Time"
									description="When this shot was pulled."
									granularity="minute"
									isRequired
								/>
							)}
						</form.AppField>
						<form.AppField name="verdict">
							{(field) => (
								<field.Select
									label="Verdict"
									description="Optional taste result for this shot."
									placeholder="No verdict"
									items={VERDICT_OPTIONS}
								>
									{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
								</field.Select>
							)}
						</form.AppField>
					</AdditionalDetailsFields>
				</div>
				<DialogFooter>
					<Button type="button" variant="ghost" onPress={onCancel}>
						Cancel
					</Button>
					{onLogAnother && (
						<Button type="button" variant="ghost" onPress={onLogAnother}>
							Save and log another
						</Button>
					)}
					<form.AppForm>
						<form.SubmitButton variant="default" loadingText="Saving...">
							Save Log
						</form.SubmitButton>
					</form.AppForm>
				</DialogFooter>
			</Form>
		);
	},
});
