import type { ReactNode } from "react";
import { Badge, Card, CardContent, CardHeader, Heading, Text } from "@9bar/toolkit/components";
import type { DesignVariantEntry } from "./registry/registry";

type VariantCardProps = {
	entry: DesignVariantEntry;
	badges?: ReactNode;
	level?: "h2" | "h3";
	headerAction?: ReactNode;
	footer?: ReactNode;
	children: ReactNode;
};

export const VariantCard = ({
	entry,
	badges,
	level = "h3",
	headerAction,
	footer,
	children,
}: VariantCardProps) => {
	return (
		<Card>
			<CardHeader>
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						{badges ?? <Badge variant="outline">{entry.kind}</Badge>}
						<Heading as={level} variant="subsection">
							{entry.title}
						</Heading>
					</div>
					{headerAction}
				</div>
				<Text variant="body-sm">{entry.description}</Text>
			</CardHeader>
			<CardContent className="space-y-3">
				{children}
				{footer}
			</CardContent>
		</Card>
	);
};
