import { SearchX } from "lucide-react";
import type { ReactNode } from "react";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	Heading,
} from "@9bar/toolkit/components";

type EmptyStateProps = {
	title: string;
	body: ReactNode;
	action?: ReactNode;
	icon?: ReactNode;
	as?: "h1" | "h2";
};

export const EmptyState = ({ title, body, action, icon, as = "h2" }: EmptyStateProps) => {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">{icon ?? <SearchX />}</EmptyMedia>
				<Heading as={as} variant={as === "h1" ? "title" : "subsection"}>
					{title}
				</Heading>
				<EmptyDescription>{body}</EmptyDescription>
			</EmptyHeader>
			{action && <EmptyContent>{action}</EmptyContent>}
		</Empty>
	);
};
