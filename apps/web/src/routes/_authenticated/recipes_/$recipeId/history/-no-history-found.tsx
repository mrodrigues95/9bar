import { SearchX } from "lucide-react";
import {
	Button,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@9bar/toolkit/components";

interface NoHistoryFoundProps {
	hasFilters: boolean;
	onClearFilters: () => void;
}

export const NoHistoryFound = ({ hasFilters, onClearFilters }: NoHistoryFoundProps) => {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<SearchX />
				</EmptyMedia>
				<EmptyTitle>{hasFilters ? "No changes match" : "No changes yet"}</EmptyTitle>
				<EmptyDescription>
					{hasFilters
						? "Try a different field, or clear the active filters."
						: "Edits to this recipe's settings will appear here."}
				</EmptyDescription>
			</EmptyHeader>
			{hasFilters && (
				<EmptyContent>
					<Button variant="outline" size="sm" onPress={onClearFilters}>
						Clear filters
					</Button>
				</EmptyContent>
			)}
		</Empty>
	);
};
