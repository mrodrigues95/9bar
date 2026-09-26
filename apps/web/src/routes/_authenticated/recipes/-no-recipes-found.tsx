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
						: "Create your first recipe to start dialling in shots."}
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				{hasQuery ? (
					<Button variant="outline" size="sm" onPress={onClearQuery}>
						Clear filters
					</Button>
				) : (
					<Link variant="default" size="sm" to="/recipes/new">
						<Plus />
						New recipe
					</Link>
				)}
			</EmptyContent>
		</Empty>
	);
};
