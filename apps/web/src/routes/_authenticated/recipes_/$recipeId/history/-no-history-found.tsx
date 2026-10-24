import { Button } from "@9bar/toolkit/components";
import { ListEmpty } from "../../../../../components";

interface NoHistoryFoundProps {
	hasFilters: boolean;
	onClearFilters: () => void;
}

export const NoHistoryFound = ({ hasFilters, onClearFilters }: NoHistoryFoundProps) => {
	return (
		<ListEmpty
			title={hasFilters ? "No changes match" : "No changes yet"}
			description={
				hasFilters
					? "Try a different field, or clear the active filters."
					: "Edits to this recipe's settings will appear here."
			}
			action={
				!!hasFilters && (
					<Button variant="outline" size="sm" onPress={onClearFilters}>
						Clear filters
					</Button>
				)
			}
		/>
	);
};
