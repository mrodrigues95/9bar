import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@9bar/toolkit/components";

export const FormSection = ({ title, children }: { title: string; children: ReactNode }) => {
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
