import { Copy, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { ConfirmDialog } from "../../../components";
import type { Recipe } from "../../../utils/data";
import { useConfirmDialogAction, type OpenConfirmDialog } from "../../../utils/hooks";
import { resolveActionDefinitions, type ActionDefinition } from "./action-definitions";
import { ActionsMenu } from "./actions-menu";

// TODO: wire up once the flow is decided.
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
				// TODO(log-again): replace this stub with a server fn that copies the recipe's current
				// snapshot into a new log (recipeId set, verdict null, shotAt now) and calls the API.
				// The Recipes list then re-renders with the new "· Logged <time>" dose line, announces
				// "Logged at <time>" in a polite live region, and keeps focus on the menu trigger.
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
