import type { RecipeStatus } from "../../../../../utils/data";

const DIALED_IN_REASON = "Three balanced logs in a row suggest Dialed in.";
const NEEDS_RETUNE_REASON = "The last 2 shots pulled under or over. Retune this recipe?";

/**
 * Deterministic mock suggestion variety: only some recipes surface a banner, split
 * between dialed-in and needs-retune. Stable per recipe so the banner never flickers.
 */
export const resolveStatusSuggestion = (
	recipeId: number,
): { status: RecipeStatus; reason: string } | null => {
	if (recipeId % 3 === 1) {
		return { status: "dialed-in", reason: DIALED_IN_REASON };
	}
	if (recipeId % 3 === 2) {
		return { status: "needs-retune", reason: NEEDS_RETUNE_REASON };
	}
	return null;
};
