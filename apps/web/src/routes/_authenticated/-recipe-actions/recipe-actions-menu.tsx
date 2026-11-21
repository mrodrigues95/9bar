import { Copy, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { ConfirmDialog } from "../../../components";
import type { Recipe } from "../../../utils/data";
import { useConfirmDialogAction } from "../../../utils/hooks";
import type { OpenConfirmDialog } from "../../../utils/hooks";
import { resolveActionDefinitions } from "./action-definitions";
import type { ActionDefinition } from "./action-definitions";
import { ActionsMenu } from "./actions-menu";

const notImplemented = () => undefined;

type ActionRecipe = Pick<Recipe, "id" | "name">;

interface RecipeActionContext {
	recipe: ActionRecipe;
	openConfirmDialog: OpenConfirmDialog;
}

const actions = {
	edit: {
		build: ({ recipe }) => ({
			id: "edit",
			kind: "link",
			label: "Edit",
			icon: Pencil,
			link: { to: "/recipes/$recipeId/edit", params: { recipeId: String(recipe.id) } },
		}),
	},
	duplicate: {
		build: ({ recipe }) => ({
			id: "duplicate",
			kind: "link",
			label: "Duplicate",
			icon: Copy,
			link: { to: "/recipes/new", search: { duplicateOf: String(recipe.id) } },
		}),
	},
	logAgain: {
		build: ({ recipe }) => ({
			id: "log-again",
			kind: "action",
			label: "Log again",
			icon: RotateCcw,
			onAction: () => {
				console.log("Log again:", { recipeId: recipe.id, shotAt: new Date().toISOString() });
			},
		}),
	},
	delete: {
		build: ({ recipe, openConfirmDialog }) => ({
			id: "delete",
			kind: "action",
			label: "Delete",
			icon: Trash2,
			section: "danger",
			onAction: () =>
				openConfirmDialog({
					title: `Delete ${recipe.name}?`,
					description: "This permanently deletes the recipe and its logs. It can't be undone.",
					confirmButtonProps: { children: "Delete" },
					onConfirm: notImplemented,
				}),
		}),
	},
} satisfies Record<string, ActionDefinition<RecipeActionContext>>;

const menus = {
	header: [actions.edit, actions.duplicate, actions.delete],
	row: [actions.edit, actions.duplicate, actions.logAgain, actions.delete],
};

interface RecipeActionsMenuProps {
	recipe: ActionRecipe;
	variant?: "header" | "row";
}

const useRecipeActionsMenu = ({ recipe, variant = "header" }: RecipeActionsMenuProps) => {
	const { open, dialogProps } = useConfirmDialogAction();

	return {
		items: resolveActionDefinitions(menus[variant], { recipe, openConfirmDialog: open }),
		confirmDialogProps: dialogProps,
	};
};

export const RecipeActionsMenu = (props: RecipeActionsMenuProps) => {
	const { items, confirmDialogProps } = useRecipeActionsMenu(props);

	return (
		<>
			<ActionsMenu label={`Actions for ${props.recipe.name}`} items={items} />
			<ConfirmDialog {...confirmDialogProps} />
		</>
	);
};
