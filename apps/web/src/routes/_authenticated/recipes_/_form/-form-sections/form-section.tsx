import { Card, CardHeader, CardPanel, CardTitle } from "@9bar/toolkit";
import { formOptions } from "@tanstack/react-form";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "tailwind-variants";

export const recipeFormOpts = formOptions({
	defaultValues: {
		name: "",
		grindSize: "",
		grinder: "",
		machine: "",
		dose: "",
		yield: "",
		brewTime: "",
		beans: "",
		temperature: "",
		pressure: "",
		isQuickLog: false,
		notes: "",
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
