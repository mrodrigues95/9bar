import { BookmarkPlus, Paperclip, Pencil, Pin, Repeat, Trash2, Unlink } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "../../../components";
import { buildLogGraph, getLog, type Log, type Recipe } from "../../../utils/data";
import { formatShotAt } from "../../../utils/format";
import { useConfirmDialogAction, type OpenConfirmDialog } from "../../../utils/hooks";
import { resolveActionDefinitions, type ActionDefinition } from "./action-definitions";
import { ActionsMenu } from "./actions-menu";
import { AttachToRecipeDialog } from "./attach-to-recipe-dialog";

// TODO: wire up once the flow is decided.
const notImplemented = () => undefined;

type ActionLog = Pick<Log, "id" | "shotAt">;
type ActionRecipe = Pick<Recipe, "id" | "name" | "pinnedLogId">;

interface LogActionContext {
	log: ActionLog;
	openConfirmDialog: OpenConfirmDialog;
}

const getShotDescription = (log: ActionLog) => `your ${formatShotAt(log.shotAt)} shot`;

const actions = {
	edit: {
		build: ({ log }) => ({
			id: "edit",
			kind: "link",
			label: "Edit",
			icon: Pencil,
			link: {
				to: "/recipes/logs/$logId/edit",
				params: { logId: String(log.id) },
				search: true,
			},
		}),
	} satisfies ActionDefinition<LogActionContext>,
	repeat: {
		build: ({ log }) => ({
			id: "repeat",
			kind: "link",
			label: "Repeat",
			icon: Repeat,
			link: {
				to: "/recipes/logs/$logId/repeat",
				params: { logId: String(log.id) },
				search: true,
			},
		}),
	} satisfies ActionDefinition<LogActionContext>,
	saveAsRecipe: {
		build: ({ log }) => ({
			id: "save-as-recipe",
			kind: "link",
			label: "Save as recipe",
			icon: BookmarkPlus,
			link: { to: "/recipes/new", search: { fromLog: String(log.id) } },
		}),
	} satisfies ActionDefinition<LogActionContext>,
	attach: {
		build: ({ startAttach }) => ({
			id: "attach",
			kind: "action",
			label: "Attach to recipe",
			icon: Paperclip,
			onAction: startAttach,
		}),
	} satisfies ActionDefinition<QuickLogActionContext>,
	setReference: {
		isAvailable: ({ isReference }) => !isReference,
		build: ({ log, recipe, openConfirmDialog }) => ({
			id: "set-reference",
			kind: "action",
			label: "Set as reference shot",
			icon: Pin,
			onAction: () => {
				const currentReference = recipe.pinnedLogId ? getLog(recipe.pinnedLogId) : undefined;
				const replacing = currentReference
					? `, replacing ${getShotDescription(currentReference)}`
					: "";
				openConfirmDialog({
					title: "Set as reference shot?",
					description: `Your ${formatShotAt(log.shotAt)} shot becomes the reference for ${recipe.name}${replacing}. The recipe overview will show its values.`,
					confirmButtonProps: { variant: "default", children: "Set as reference" },
					// TODO(set-reference-shot): server fn that pins the log as the recipe's reference.
					onConfirm: () =>
						console.log("Set as reference shot:", { logId: log.id, recipeId: recipe.id }),
				});
			},
		}),
	} satisfies ActionDefinition<AttachedLogActionContext>,
	detach: {
		build: ({ log, recipe, isReference, openConfirmDialog }) => ({
			id: "detach",
			kind: "action",
			label: "Detach from recipe",
			icon: Unlink,
			onAction: () => {
				const reference = isReference ? " It will no longer be this recipe's reference shot." : "";
				openConfirmDialog({
					title: `Detach from ${recipe.name}?`,
					description: `Your ${formatShotAt(log.shotAt)} shot moves to quick logs and keeps its values, verdict, and notes.${reference}`,
					confirmButtonProps: { variant: "default", children: "Detach" },
					// TODO(detach-from-recipe): server fn that clears the log's recipeId and the recipe's pinnedLogId.
					onConfirm: () =>
						console.log("Detached from recipe:", { logId: log.id, recipeId: recipe.id }),
				});
			},
		}),
	} satisfies ActionDefinition<AttachedLogActionContext>,
	delete: {
		build: ({ log, openConfirmDialog }) => ({
			id: "delete",
			kind: "action",
			label: "Delete",
			icon: Trash2,
			section: "danger",
			onAction: () =>
				openConfirmDialog({
					title: `Delete ${getShotDescription(log)}?`,
					description: "This permanently removes it from your brew log. It can't be undone.",
					confirmButtonProps: { children: "Delete" },
					onConfirm: notImplemented,
				}),
		}),
	} satisfies ActionDefinition<LogActionContext>,
};

interface QuickLogActionContext extends LogActionContext {
	startAttach: () => void;
}

interface AttachedLogActionContext extends LogActionContext {
	recipe: ActionRecipe;
	isReference: boolean;
}

const menus = {
	"quick-log": [actions.edit, actions.repeat, actions.saveAsRecipe, actions.attach, actions.delete],
	"attached-log": [actions.edit, actions.setReference, actions.detach, actions.delete],
};

type LogActionsMenuProps =
	| { kind: "quick-log"; log: ActionLog; label: string }
	| { kind: "attached-log"; log: ActionLog; recipe: ActionRecipe; label: string };

const useLogActionsMenu = (props: LogActionsMenuProps) => {
	const { open, dialogProps } = useConfirmDialogAction();
	const [isAttaching, setIsAttaching] = useState(false);
	const context = { log: props.log, openConfirmDialog: open };
	const logGraph = isAttaching ? buildLogGraph(props.log.id) : undefined;

	return {
		items:
			props.kind === "attached-log"
				? resolveActionDefinitions(menus["attached-log"], {
						...context,
						recipe: props.recipe,
						isReference: props.recipe.pinnedLogId === props.log.id,
					})
				: resolveActionDefinitions(menus["quick-log"], {
						...context,
						startAttach: () => setIsAttaching(true),
					}),
		confirmDialogProps: dialogProps,
		attachDialogProps: logGraph ? { log: logGraph, onOpenChange: setIsAttaching } : null,
	};
};

export const LogActionsMenu = (props: LogActionsMenuProps) => {
	const { items, confirmDialogProps, attachDialogProps } = useLogActionsMenu(props);

	return (
		<>
			<ActionsMenu label={props.label} items={items} />
			<ConfirmDialog {...confirmDialogProps} />
			{!!attachDialogProps && <AttachToRecipeDialog {...attachDialogProps} />}
		</>
	);
};
