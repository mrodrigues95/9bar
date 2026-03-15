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
	brewTime: TInputGroupSelectFieldValue;
	temperature: TInputGroupSelectFieldValue;
}

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

export const recipeFormOpts = formOptions({
	defaultValues: DEFAULT_RECIPE,
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
