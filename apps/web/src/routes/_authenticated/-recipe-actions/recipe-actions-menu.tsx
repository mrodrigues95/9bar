import { Copy, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { ConfirmDialog } from "../../../components";
import type { Recipe } from "../../../utils/data";
import {
	useConfirmDialogAction,
	type ConfirmDialogRequest,
	type OpenConfirmDialog,
} from "../../../utils/hooks";
import { ActionsMenu, type ActionsMenuItem } from "./actions-menu";

// TODO: wire up once the flow is decided.
const notImplemented = () => undefined;

const actions = {
	edit: (recipe: Recipe) => ({
		id: "edit",
		kind: "link",
		label: "Edit",
		icon: Pencil,
		link: { to: "/recipes/$recipeId/edit", params: { recipeId: String(recipe.id) } },
	}),
	duplicate: (recipe: Recipe) => ({
		id: "duplicate",
		kind: "link",
		label: "Duplicate",
		icon: Copy,
		link: { to: "/recipes/new", search: { duplicateOf: String(recipe.id) } },
	}),
	logAgain: (recipe: Recipe) => ({
		id: "log-again",
		kind: "action",
		label: "Log again",
		icon: RotateCcw,
		onAction: () => {
			// TODO(log-again): replace this stub with a server fn that copies the recipe's current
			// snapshot into a new log (recipeId set, verdict null, shotAt now) and calls the API.
			// The Recipes list then re-renders with the new "· Logged <time>" dose line, announces
			// "Logged at <time>" in a polite live region, and keeps focus on the menu trigger.
			console.log("Log again:", { recipeId: recipe.id, shotAt: new Date().toISOString() });
		},
	}),
	delete: (
		openConfirmDialog: OpenConfirmDialog,
		request: Omit<ConfirmDialogRequest, "onConfirm">,
	) => ({
		id: "delete",
		kind: "action",
		label: "Delete",
		icon: Trash2,
		section: "danger",
		onAction: () => openConfirmDialog({ ...request, onConfirm: notImplemented }),
	}),
} satisfies Record<string, (...args: never) => ActionsMenuItem>;

interface RecipeActionsMenuProps {
	recipe: Recipe;
	variant?: "header" | "row";
}

export const RecipeActionsMenu = ({ recipe, variant = "header" }: RecipeActionsMenuProps) => {
	const { open, dialogProps } = useConfirmDialogAction();

	return (
		<>
			<ActionsMenu
				label={`Actions for ${recipe.name}`}
				items={[
					actions.edit(recipe),
					actions.duplicate(recipe),
					...(variant === "row" ? [actions.logAgain(recipe)] : []),
					actions.delete(open, {
						title: `Delete ${recipe.name}?`,
						description: "This permanently deletes the recipe and its logs. It can't be undone.",
						confirmButtonProps: { children: "Delete" },
					}),
				]}
			/>
			<ConfirmDialog {...dialogProps} />
		</>
	);
};
