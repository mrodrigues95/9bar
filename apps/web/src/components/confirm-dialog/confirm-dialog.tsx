import type { ReactNode } from "react";
import {
	Dialog,
	DialogCloseButton,
	DialogCloseIconButton,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	type DialogCloseButtonProps,
} from "@9bar/toolkit/components";

interface ConfirmDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	title: string;
	description: ReactNode;
	confirmButtonProps?: DialogCloseButtonProps;
	onConfirm: () => void;
}

export const ConfirmDialog = ({
	isOpen,
	onOpenChange,
	title,
	description,
	confirmButtonProps,
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
				<DialogCloseButton>Cancel</DialogCloseButton>
				<DialogCloseButton variant="destructive" {...confirmButtonProps} onPress={onConfirm} />
			</DialogFooter>
		</Dialog>
	);
};
