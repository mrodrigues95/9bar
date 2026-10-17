import { CalendarDateTime } from "@internationalized/date";
import { formOptions } from "@tanstack/react-form";
import z from "zod";
import {
	METHOD_OPTIONS,
	VERDICT_OPTIONS,
	type BrewSnapshot,
	type Log,
	type RecipeGraph,
	type Verdict,
} from "../../../../../utils/data";
import { additionalDetailsDefaults } from "../sections/additional-details-fields";
import { basicInformationDefaults } from "../sections/basic-information-fields";
import { brewParametersDefaults } from "../sections/brew-parameters-fields";
import {
	coercedNumber,
	inputGroupSelectValue,
	nowAsCalendarDateTime,
	snapshotToFormFields,
	toFormDateTime,
	type AdditionalDetailsValues,
	type BasicInformationValues,
	type BrewParametersValues,
} from "./field-schema";

export interface LogFormValues
	extends BasicInformationValues, BrewParametersValues, AdditionalDetailsValues {
	recipeId: string | null;
	shotAt: CalendarDateTime;
	verdict: Verdict | null;
}

export type LogSubmitIntent = "save" | "log-another";

export interface LogSubmitMeta {
	intent: LogSubmitIntent;
}

const logSubmitMeta: LogSubmitMeta = { intent: "save" };

export const logFormSchema = z.object({
	recipeId: z.string().nullable(),
	method: z.enum(METHOD_OPTIONS.map(({ id }) => id)),
	beans: z.string().max(150, "Beans cannot exceed 150 characters"),
	grinder: z.string(),
	machine: z.string(),
	grindSize: z.string().max(50, "Grind size cannot exceed 50 characters"),
	dose: coercedNumber((n) => n.min(0, "Dose cannot be negative")),
	yield: coercedNumber((n) => n.min(0, "Yield cannot be negative")),
	brewTime: inputGroupSelectValue(["s", "m"], "Brew time cannot be negative"),
	temperature: inputGroupSelectValue(["C", "F"], "Temperature cannot be negative"),
	pressure: coercedNumber((n) => n.min(0, "Pressure cannot be negative")),
	shotAt: z.instanceof(CalendarDateTime, { error: "Time is required" }),
	verdict: z.enum(VERDICT_OPTIONS.map(({ id }) => id)).nullable(),
	notes: z.string().max(2000, "Notes cannot exceed 2000 characters"),
});

export const emptyLogFormValues = (shotAt = nowAsCalendarDateTime()): LogFormValues => {
	return {
		...basicInformationDefaults,
		...brewParametersDefaults,
		...additionalDetailsDefaults,
		recipeId: null,
		shotAt,
		verdict: null,
	};
};

export const logToFormValues = (
	log: Log & { snapshot: BrewSnapshot },
	shotAt = toFormDateTime(new Date(log.shotAt)),
): LogFormValues => {
	return {
		...emptyLogFormValues(shotAt),
		...snapshotToFormFields(log.snapshot),
		recipeId: log.recipeId === null ? null : String(log.recipeId),
		verdict: log.verdict,
	};
};

export const recipeToLogFormValues = (
	recipe: RecipeGraph,
	shotAt = nowAsCalendarDateTime(),
): LogFormValues => {
	return {
		...emptyLogFormValues(shotAt),
		...snapshotToFormFields(recipe.snapshot),
		recipeId: String(recipe.id),
	};
};

export const logFormOpts = formOptions({
	defaultValues: emptyLogFormValues(),
	onSubmitMeta: logSubmitMeta,
	validators: {
		onChange: logFormSchema,
	},
});
