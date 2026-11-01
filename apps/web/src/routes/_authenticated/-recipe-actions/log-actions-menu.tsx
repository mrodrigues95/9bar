import { BookmarkPlus, Paperclip, Pencil, Pin, Repeat, Trash2, Unlink } from "lucide-react";
import { ConfirmDialog } from "../../../components";
import type { Log } from "../../../utils/data";
import {
	useConfirmDialogAction,
	type ConfirmDialogRequest,
	type OpenConfirmDialog,
} from "../../../utils/hooks";
import { ActionsMenu, type ActionsMenuItem } from "./actions-menu";

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
	saveAsRecipe: () => ({
		id: "save-as-recipe",
		kind: "action",
		label: "Save as recipe",
		icon: BookmarkPlus,
		onAction: notImplemented,
	}),
	attach: () => ({
		id: "attach",
		kind: "action",
		label: "Attach to recipe",
		icon: Paperclip,
		onAction: notImplemented,
	}),
	setReference: () => ({
		id: "set-reference",
		kind: "action",
		label: "Set as reference shot",
		icon: Pin,
		onAction: notImplemented,
	}),
	detach: () => ({
		id: "detach",
		kind: "action",
		label: "Detach from recipe",
		icon: Unlink,
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

interface LogActionsMenuProps {
	log: Log;
	kind: "attached-log" | "quick-log";
	label: string;
}

export const LogActionsMenu = ({ log, kind, label }: LogActionsMenuProps) => {
	const { open, dialogProps } = useConfirmDialogAction();

	return (
		<>
			<ActionsMenu
				label={label}
				items={[
					actions.edit(log),
					...(kind === "quick-log"
						? [actions.repeat(log), actions.saveAsRecipe(), actions.attach()]
						: [actions.setReference(), actions.detach()]),
					actions.delete(open, {
						title: "Delete this log?",
						description:
							"This permanently removes the shot from your brew log. It can't be undone.",
						confirmLabel: "Delete",
					}),
				]}
			/>
			<ConfirmDialog {...dialogProps} />
		</>
	);
};
