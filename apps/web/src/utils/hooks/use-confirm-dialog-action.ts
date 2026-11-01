import { useState, type ReactNode } from "react";

export interface ConfirmDialogRequest {
	title: string;
	description: ReactNode;
	confirmLabel?: string;
	onConfirm: () => void;
}

export type OpenConfirmDialog = (request: ConfirmDialogRequest) => void;

export const useConfirmDialogAction = () => {
	const [pending, setPending] = useState<ConfirmDialogRequest | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const open: OpenConfirmDialog = (request) => {
		setPending(request);
		setIsOpen(true);
	};

	const dialogProps = {
		isOpen,
		onOpenChange: setIsOpen,
		title: pending?.title ?? "",
		description: pending?.description ?? "",
		confirmLabel: pending?.confirmLabel,
		onConfirm: () => {
			pending?.onConfirm();
		},
	};

	return { open, dialogProps };
};
