import type { ReactNode } from "react";
import {
	Dialog,
	DialogCloseButton,
	DialogCloseIconButton,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@9bar/toolkit/components";

interface ConfirmDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	title: string;
	description: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm: () => void;
}

export const ConfirmDialog = ({
	isOpen,
	onOpenChange,
	title,
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	onConfirm,
}: ConfirmDialogProps) => {
	return (
		<Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
				<DialogCloseIconButton />
			</DialogHeader>
			<DialogFooter>
				<DialogCloseButton>{cancelLabel}</DialogCloseButton>
				<DialogCloseButton variant="destructive" onPress={onConfirm}>
					{confirmLabel}
				</DialogCloseButton>
			</DialogFooter>
		</Dialog>
	);
};
