import { Plus } from "lucide-react";
import { Button } from "@9bar/toolkit/components";
import { Link, ListEmpty } from "../../../components";

interface NoRecipesFoundProps {
	hasQuery: boolean;
	onClearQuery: () => void;
}

export const NoRecipesFound = ({ hasQuery, onClearQuery }: NoRecipesFoundProps) => {
	return (
		<ListEmpty
			title={hasQuery ? "No recipes match" : "No recipes yet"}
			description={
				hasQuery
					? "Try a different search, or clear the active filters."
					: "Log a shot, or create your first recipe to start dialling in."
			}
			action={
				hasQuery ? (
					<Button variant="outline" size="sm" onPress={onClearQuery}>
						Clear filters
					</Button>
				) : (
					<div className="flex flex-row gap-2">
						<Button variant="ghost" size="sm">
							Log a shot
						</Button>
						<Link variant="outline" size="sm" to="/recipes/new">
							<Plus />
							New recipe
						</Link>
					</div>
				)
			}
		/>
	);
};
