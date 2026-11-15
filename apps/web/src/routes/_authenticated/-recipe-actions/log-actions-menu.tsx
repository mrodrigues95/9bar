import { BookmarkPlus, Paperclip, Pencil, Pin, Repeat, Trash2, Unlink } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "../../../components";
import { buildLogGraph, getLog, type Log, type Recipe } from "../../../utils/data";
import { formatShotAt } from "../../../utils/format";
import {
	useConfirmDialogAction,
	type ConfirmDialogRequest,
	type OpenConfirmDialog,
} from "../../../utils/hooks";
import { ActionsMenu, type ActionsMenuItem } from "./actions-menu";
import { AttachToRecipeDialog } from "./attach-to-recipe-dialog";

// TODO: wire up once the flow is decided.
const notImplemented = () => undefined;

const actions = {
	edit: (log: Log) => ({
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
	repeat: (log: Log) => ({
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
	saveAsRecipe: (log: Log) => ({
		id: "save-as-recipe",
		kind: "link",
		label: "Save as recipe",
		icon: BookmarkPlus,
		link: { to: "/recipes/new", search: { fromLog: String(log.id) } },
	}),
	attach: (onAttach: () => void) => ({
		id: "attach",
		kind: "action",
		label: "Attach to recipe",
		icon: Paperclip,
		onAction: onAttach,
	}),
	setReference: (openConfirmDialog: OpenConfirmDialog, request: ConfirmDialogRequest) => ({
		id: "set-reference",
		kind: "action",
		label: "Set as reference shot",
		icon: Pin,
		onAction: () => openConfirmDialog(request),
	}),
	detach: (openConfirmDialog: OpenConfirmDialog, request: ConfirmDialogRequest) => ({
		id: "detach",
		kind: "action",
		label: "Detach from recipe",
		icon: Unlink,
		onAction: () => openConfirmDialog(request),
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

interface LogActionsMenuProps {
	log: Log;
	recipe?: Recipe;
	label: string;
}

const describeShot = (log: Log) => `your ${formatShotAt(log.shotAt)} shot`;

const describeSetReference = (log: Log, recipe: Recipe) => {
	const currentReference = recipe.pinnedLogId ? getLog(recipe.pinnedLogId) : undefined;
	const replacing = currentReference ? `, replacing ${describeShot(currentReference)}` : "";
	return `Your ${formatShotAt(log.shotAt)} shot becomes the reference for ${recipe.name}${replacing}. The recipe overview will show its values.`;
};

const describeDetach = (log: Log, isReference: boolean) => {
	const reference = isReference ? " It will no longer be this recipe's reference shot." : "";
	return `Your ${formatShotAt(log.shotAt)} shot moves to quick logs and keeps its values, verdict, and notes.${reference}`;
};

export const LogActionsMenu = ({ log, recipe, label }: LogActionsMenuProps) => {
	const { open, dialogProps } = useConfirmDialogAction();
	const [isAttaching, setIsAttaching] = useState(false);
	const logGraph = isAttaching ? buildLogGraph(log.id) : undefined;
	const isReference = recipe?.pinnedLogId === log.id;
	const payload = { logId: log.id, recipeId: log.recipeId };

	const attachmentItems = recipe
		? [
				...(isReference
					? []
					: [
							actions.setReference(open, {
								title: "Set as reference shot?",
								description: describeSetReference(log, recipe),
								confirmButtonProps: { variant: "default", children: "Set as reference" },
								// TODO(set-reference-shot): server fn that pins the log as the recipe's reference.
								onConfirm: () => console.log("Set as reference shot:", payload),
							}),
						]),
				actions.detach(open, {
					title: `Detach from ${recipe.name}?`,
					description: describeDetach(log, isReference),
					confirmButtonProps: { variant: "default", children: "Detach" },
					// TODO(detach-from-recipe): server fn that clears the log's recipeId and the recipe's pinnedLogId.
					onConfirm: () => console.log("Detached from recipe:", payload),
				}),
			]
		: [actions.repeat(log), actions.saveAsRecipe(log), actions.attach(() => setIsAttaching(true))];

	return (
		<>
			<ActionsMenu
				label={label}
				items={[
					actions.edit(log),
					...attachmentItems,
					actions.delete(open, {
						title: `Delete ${describeShot(log)}?`,
						description: "This permanently removes it from your brew log. It can't be undone.",
						confirmButtonProps: { children: "Delete" },
					}),
				]}
			/>
			<ConfirmDialog {...dialogProps} />
			{!!logGraph && <AttachToRecipeDialog log={logGraph} onOpenChange={setIsAttaching} />}
		</>
	);
};
