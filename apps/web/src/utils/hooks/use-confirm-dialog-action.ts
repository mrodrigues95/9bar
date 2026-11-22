import { useState } from "react";
import type { ReactNode } from "react";
import type { DialogCloseButtonProps } from "@9bar/toolkit/components";

export interface ConfirmDialogRequest {
	title: string;
	description: ReactNode;
	confirmButtonProps?: DialogCloseButtonProps;
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
		confirmButtonProps: pending?.confirmButtonProps,
		onConfirm: () => {
			pending?.onConfirm();
		},
	};

	return { open, dialogProps };
};
