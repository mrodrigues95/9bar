import { formOptions } from "@tanstack/react-form";
import z from "zod";
import {
	METHOD_OPTIONS,
	RECIPE_STATUS_OPTIONS,
	type TRecipeGraph,
	type TRecipeStatus,
} from "../../../../../utils/data";
import { additionalDetailsDefaults } from "../sections/additional-details-fields";
import { basicInformationDefaults } from "../sections/basic-information-fields";
import { brewParametersDefaults } from "../sections/brew-parameters-fields";
import {
	coercedNumber,
	inputGroupSelectValue,
	snapshotToFormFields,
	type TAdditionalDetailsFields,
	type TBasicInformationFields,
	type TBrewParametersFields,
} from "./field-schema";

export interface TRecipeFormValues
	extends TBasicInformationFields, TBrewParametersFields, TAdditionalDetailsFields {
	name: string;
	status: TRecipeStatus;
}

export const recipeFormSchema = z.object({
	name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
	status: z.enum(RECIPE_STATUS_OPTIONS.map(({ id }) => id)),
	method: z.enum(METHOD_OPTIONS.map(({ id }) => id)),
	beans: z.string().min(1, "Beans is required").max(150, "Beans cannot exceed 150 characters"),
	grinder: z.string().min(1, "Grinder is required"),
	machine: z.string().min(1, "Machine is required"),
	grindSize: z
		.string()
		.min(1, "Grind size is required")
		.max(50, "Grind size cannot exceed 50 characters"),
	dose: coercedNumber((n) => n.min(0, "Dose cannot be negative")),
	yield: coercedNumber((n) => n.min(0, "Yield cannot be negative")),
	brewTime: inputGroupSelectValue(["s", "m"], "Brew time cannot be negative"),
	temperature: inputGroupSelectValue(["C", "F"], "Temperature cannot be negative"),
	pressure: coercedNumber((n) => n.min(0, "Pressure cannot be negative")),
	notes: z.string().max(2000, "Notes cannot exceed 2000 characters"),
});

export const recipeToFormValues = (recipe: TRecipeGraph): TRecipeFormValues => {
	return {
		...snapshotToFormFields(recipe.snapshot),
		name: recipe.name,
		status: recipe.status,
	};
};

export const defaultRecipeFormValues: TRecipeFormValues = {
	...basicInformationDefaults,
	...brewParametersDefaults,
	...additionalDetailsDefaults,
	name: "",
	status: "dialing-in",
};

export const recipeFormOpts = formOptions({
	defaultValues: defaultRecipeFormValues,
	validators: {
		onChange: recipeFormSchema,
	},
});
