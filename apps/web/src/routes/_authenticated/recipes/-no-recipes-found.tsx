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
import { Link } from "../../../components";

interface NoRecipesFoundProps {
	hasQuery: boolean;
	onClearQuery: () => void;
}

export const NoRecipesFound = ({ hasQuery, onClearQuery }: NoRecipesFoundProps) => {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<SearchX />
				</EmptyMedia>
				<EmptyTitle>{hasQuery ? "No recipes match" : "No recipes yet"}</EmptyTitle>
				<EmptyDescription>
					{hasQuery
						? "Try a different search, or clear the active filters."
						: "Log a shot, or create your first recipe to start dialling in."}
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				{hasQuery ? (
					<Button variant="outline" size="sm" onPress={onClearQuery}>
						Clear filters
					</Button>
				) : (
					<div className="flex flex-row gap-2">
						<Button size="sm">Log a shot</Button>
						<Link variant="outline" size="sm" to="/recipes/new">
							<Plus />
							New recipe
						</Link>
					</div>
				)}
			</EmptyContent>
		</Empty>
	);
};
