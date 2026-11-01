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
	duplicate: () => ({
		id: "duplicate",
		kind: "action",
		label: "Duplicate",
		icon: Copy,
		onAction: notImplemented,
	}),
	logAgain: () => ({
		id: "log-again",
		kind: "action",
		label: "Log again",
		icon: RotateCcw,
		onAction: notImplemented,
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
					actions.duplicate(),
					...(variant === "row" ? [actions.logAgain()] : []),
					actions.delete(open, {
						title: `Delete ${recipe.name}?`,
						description: "This permanently deletes the recipe and its logs. It can't be undone.",
						confirmLabel: "Delete",
					}),
				]}
			/>
			<ConfirmDialog {...dialogProps} />
		</>
	);
};
