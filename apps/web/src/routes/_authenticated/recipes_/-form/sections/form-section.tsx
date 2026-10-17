import { useMatchRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@9bar/toolkit/components";

const LOG_DIALOG_ROUTES = [
	"/recipes/logs/new",
	"/recipes/logs/$logId/edit",
	"/recipes/logs/$logId/repeat",
	"/recipes/$recipeId/logs/new",
	"/recipes/$recipeId/logs/$logId/edit",
] as const;

const useFormSectionVariant = () => {
	const matchRoute = useMatchRoute();
	return LOG_DIALOG_ROUTES.some((to) => !!matchRoute({ to })) ? "plain" : "card";
};

interface FormSectionProps {
	title: string;
	children: ReactNode;
}

export const FormSection = ({ title, children }: FormSectionProps) => {
	const variant = useFormSectionVariant();

	if (variant === "plain") {
		return (
			<section className="space-y-4">
				<h3 className="font-heading text-sm font-medium">{title}</h3>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{children}</div>
			</section>
		);
	}

	return (
		<Card>
			<legend className="sr-only">{title}</legend>
			<CardHeader>
				<CardTitle aria-hidden="true">{title}</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">{children}</CardContent>
		</Card>
	);
};
