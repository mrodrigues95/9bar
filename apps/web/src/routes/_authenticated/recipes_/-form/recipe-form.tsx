import { useStore } from "@tanstack/react-form";
import { SelectItem, Separator } from "@9bar/toolkit/components";
import { Form, withForm } from "@9bar/toolkit/components/composed";
import { Link } from "../../../../components";
import { RECIPE_STATUS_OPTIONS } from "../../../../utils/data";
import { recipeFormOpts } from "./schemas/recipe-schema";
import {
	additionalDetailsFields,
	AdditionalDetailsFields,
} from "./sections/additional-details-fields";
import {
	basicInformationFields,
	BasicInformationFields,
} from "./sections/basic-information-fields";
import { brewParametersFields, BrewParametersFields } from "./sections/brew-parameters-fields";

interface TRecipeFormProps {
	mode: "create" | "edit";
	recipeId?: string;
}

const recipeFormProps: TRecipeFormProps = {
	mode: "create",
};

export const RecipeForm = withForm({
	...recipeFormOpts,
	props: recipeFormProps,
	render: function Render({ form, mode, recipeId }) {
		const method = useStore(form.store, (state) => state.values.method);

		return (
			<Form className="space-y-6" validationBehavior="aria" onSubmit={() => form.handleSubmit()}>
				<BasicInformationFields form={form} fields={basicInformationFields} isIdentityRequired>
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
					{mode === "edit" && (
						<form.AppField name="status">
							{(field) => (
								<field.Select
									label="Status"
									description="Where this recipe is in your dial-in loop."
									items={RECIPE_STATUS_OPTIONS}
								>
									{(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
								</field.Select>
							)}
						</form.AppField>
					)}
				</BasicInformationFields>
				<BrewParametersFields
					form={form}
					fields={brewParametersFields}
					method={method}
					isGrindSizeRequired
				/>
				<AdditionalDetailsFields form={form} fields={additionalDetailsFields} />
				<Separator />
				<div className="flex items-center justify-end gap-2">
					<Link
						variant="outline"
						{...(recipeId
							? { to: "/recipes/$recipeId", params: { recipeId } }
							: { to: "/recipes" })}
					>
						Cancel
					</Link>
					<form.AppForm>
						<form.SubmitButton variant="default" loadingText="Saving...">
							{mode === "create" ? "Create Recipe" : "Save Recipe"}
						</form.SubmitButton>
					</form.AppForm>
				</div>
			</Form>
		);
	},
});
