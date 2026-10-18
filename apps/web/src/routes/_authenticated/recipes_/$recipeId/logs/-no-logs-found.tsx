import { Plus, SearchX } from "lucide-react";
import {
	Button,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@9bar/toolkit/components";
import { Link } from "../../../../../components";

interface NoLogsFoundProps {
	hasFilters: boolean;
	onClearFilters: () => void;
	recipeId: string;
}

export const NoLogsFound = ({ hasFilters, onClearFilters, recipeId }: NoLogsFoundProps) => {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<SearchX />
				</EmptyMedia>
				<EmptyTitle>{hasFilters ? "No logs match" : "No logs yet"}</EmptyTitle>
				<EmptyDescription>
					{hasFilters
						? "Try a different search, or clear the active filters."
						: "Log a shot to record this recipe's first brew."}
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				{hasFilters ? (
					<Button variant="outline" size="sm" onPress={onClearFilters}>
						Clear filters
					</Button>
				) : (
					<Link variant="outline" size="sm" to="/recipes/$recipeId/logs/new" params={{ recipeId }}>
						<Plus />
						New log
					</Link>
				)}
			</EmptyContent>
		</Empty>
	);
};
