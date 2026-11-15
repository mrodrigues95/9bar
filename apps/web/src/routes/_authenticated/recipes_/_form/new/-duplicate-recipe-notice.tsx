import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@9bar/toolkit/components";
import { Link } from "../../../../../components";
import type { RecipeGraph } from "../../../../../utils/data";

interface DuplicateRecipeNoticeProps {
	recipe: RecipeGraph;
}

export const DuplicateRecipeNotice = ({ recipe }: DuplicateRecipeNoticeProps) => {
	return (
		<Alert variant="info">
			<Info />
			<AlertTitle className="[&_a]:no-underline [&_a]:hover:underline">
				Duplicating{" "}
				<Link
					to="/recipes/$recipeId"
					params={{ recipeId: String(recipe.id) }}
					target="_blank"
					rel="noreferrer"
					className="h-auto p-0 font-[inherit] text-[length:inherit] text-inherit italic"
				>
					{recipe.name}
				</Link>
			</AlertTitle>
			<AlertDescription>
				Everything below is copied from that recipe. Adjust it, then save it as a new recipe.
			</AlertDescription>
		</Alert>
	);
};
