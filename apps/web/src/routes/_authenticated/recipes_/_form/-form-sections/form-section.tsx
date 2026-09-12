import type { ComponentProps, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@9bar/toolkit/components";
import { cn } from "@9bar/toolkit/utils";

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
		<Card>
			<legend className="sr-only">{title}</legend>
			<CardHeader>
				<CardTitle aria-hidden="true">{title}</CardTitle>
			</CardHeader>
			<CardContent
				{...panelProps}
				className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2", panelProps?.className)}
			>
				{children}
			</CardContent>
		</Card>
	);
};
