import {
	Card,
	CardHeader,
	CardPanel,
	CardTitle,
	type TInputGroupSelectFieldValue,
} from "@9bar/toolkit";
import { formOptions } from "@tanstack/react-form";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "tailwind-variants";
import z from "zod";
import type { TRecipeGraph, TRecipeSnapshot } from "../../../../../utils/data";

export interface TRecipeFormValues
	extends Pick<TRecipeGraph, "isQuickBrew" | "name">,
		Pick<
			TRecipeSnapshot,
			| "machine"
			| "grinder"
			| "grindSize"
			| "dose"
			| "yield"
			| "beans"
			| "pressure"
			| "notes"
		> {
	brewTime: TInputGroupSelectFieldValue<number, "s" | "m">;
	temperature: TInputGroupSelectFieldValue<number, "C" | "F">;
}

/** Coerces a string (from an HTML input) to a number while preserving the `number` input type for StandardSchema compatibility. */
const coercedNumber = (checks: (n: z.ZodNumber) => z.ZodNumber = (n) => n) =>
	z.pipe(
		z.transform<number, number>((val) => Number(val)),
		checks(z.number()),
	);

const inputGroupSelectValue = <
	const T extends readonly [string, ...Array<string>],
>(
	selectValue: T,
	message: string,
) =>
	z
		.object({
			inputValue: coercedNumber(),
			selectValue: z.enum(selectValue),
		})
		.refine(({ inputValue }) => inputValue >= 0, { message });

export const recipeFormSchema = z
	.object({
		name: z.string().max(100, "Name cannot exceed 100 characters"),
		isQuickBrew: z.boolean(),
		grindSize: z
			.string()
			.min(1, "Grind size is required")
			.max(50, "Grind size cannot exceed 50 characters"),
		grinder: z.string().min(1, "Grinder is required"),
		machine: z.string().min(1, "Machine is required"),
		dose: coercedNumber((n) => n.min(0, "Dose cannot be negative")),
		yield: coercedNumber((n) => n.min(0, "Yield cannot be negative")),
		brewTime: inputGroupSelectValue(["s", "m"], "Brew time cannot be negative"),
		temperature: inputGroupSelectValue(
			["C", "F"],
			"Temperature cannot be negative",
		),
		beans: z
			.string()
			.min(1, "Beans is required")
			.max(150, "Beans cannot exceed 150 characters"),
		pressure: coercedNumber((n) => n.min(0, "Pressure cannot be negative")),
		notes: z.string().max(2000, "Notes cannot exceed 2000 characters"),
	})
	.refine((data) => data.isQuickBrew || !!data.name.length, {
		message: "Name is required",
		path: ["name"],
	});

export const recipeToFormValues = (recipe: TRecipeGraph): TRecipeFormValues => {
	const { snapshot } = recipe;
	return {
		name: recipe.name ?? "",
		isQuickBrew: recipe.isQuickBrew,
		grindSize: snapshot.grindSize,
		grinder: snapshot.grinder,
		machine: snapshot.machine,
		dose: snapshot.dose,
		yield: snapshot.yield,
		brewTime: {
			inputValue: snapshot.brewTime,
			selectValue: snapshot.brewTimeUnit,
		},
		beans: snapshot.beans,
		temperature: {
			inputValue: snapshot.temperature,
			selectValue: snapshot.temperatureUnit,
		},
		pressure: snapshot.pressure,
		notes: snapshot.notes ?? "",
	};
};

const DEFAULT_RECIPE: TRecipeFormValues = {
	name: "",
	isQuickBrew: false,
	grindSize: "",
	grinder: "",
	machine: "",
	dose: 0,
	yield: 0,
	brewTime: { inputValue: 0, selectValue: "s" },
	temperature: { inputValue: 0, selectValue: "C" },
	beans: "",
	pressure: 0,
	notes: "",
};

export const recipeFormOpts = formOptions({
	defaultValues: DEFAULT_RECIPE,
	validators: {
		onChange: recipeFormSchema,
	},
});

export const FormSection = ({
	title,
	children,
	panelProps,
}: {
	title: string;
	children: ReactNode;
	panelProps?: ComponentProps<"div">;
}) => {
	return (
		<Card render={<fieldset />}>
			<legend className="sr-only">{title}</legend>
			<CardHeader>
				<CardTitle aria-hidden="true">{title}</CardTitle>
			</CardHeader>
			<CardPanel
				{...panelProps}
				className={cn(
					"grid grid-cols-1 gap-6 sm:grid-cols-2",
					panelProps?.className,
				)}
			>
				{children}
			</CardPanel>
		</Card>
	);
};
