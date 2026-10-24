import { Plus } from "lucide-react";
import { Button } from "@9bar/toolkit/components";
import { Link, ListEmpty } from "../../../../../components";

interface NoLogsFoundProps {
	hasFilters: boolean;
	onClearFilters: () => void;
	recipeId: string;
}

export const NoLogsFound = ({ hasFilters, onClearFilters, recipeId }: NoLogsFoundProps) => {
	return (
		<ListEmpty
			title={hasFilters ? "No logs match" : "No logs yet"}
			description={
				hasFilters
					? "Try a different search, or clear the active filters."
					: "Log a shot to record this recipe's first brew."
			}
			action={
				hasFilters ? (
					<Button variant="outline" size="sm" onPress={onClearFilters}>
						Clear filters
					</Button>
				) : (
					<Link variant="outline" size="sm" to="/recipes/$recipeId/logs/new" params={{ recipeId }}>
						<Plus />
						New log
					</Link>
				)
			}
		/>
	);
};
