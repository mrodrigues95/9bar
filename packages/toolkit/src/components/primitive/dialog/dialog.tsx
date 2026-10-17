import { XIcon } from "lucide-react";
import type * as React from "react";
import {
	Dialog as AriaDialog,
	DialogTrigger as AriaDialogTrigger,
	Heading as AriaHeading,
	Modal as AriaModal,
	ModalOverlay as AriaModalOverlay,
	type DialogTriggerProps as AriaDialogTriggerProps,
	type HeadingProps as AriaHeadingProps,
	type ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components";
import { Button, type ButtonProps } from "#components/button";
import { IconButton, type IconButtonProps } from "#components/icon-button";
import { cn, composeTailwindRenderProps } from "#lib/utils";
import { dialogContentVariants, dialogOverlayVariants } from "./styles";

/** Props for the {@link DialogTrigger} component. */
export type DialogTriggerProps = AriaDialogTriggerProps;

/** The trigger that opens a {@link Dialog}, wrapping the element that receives the interaction. */
export const DialogTrigger = (props: DialogTriggerProps) => {
	return <AriaDialogTrigger data-slot="dialog-trigger" {...props} />;
};

/** Props for the {@link Dialog} component. */
export type DialogProps = Omit<AriaModalOverlayProps, "children"> & {
	children: React.ReactNode;
};

/**
 * A dialog is an overlay that interrupts the user with important content and
 * expects a response. Renders the overlay, modal, and content surface; open it
 * from a {@link DialogTrigger}, or with `defaultOpen` / `isOpen` for
 * route-driven dialogs. Compose {@link DialogHeader}, {@link DialogTitle},
 * {@link DialogDescription}, {@link DialogCloseButton}, {@link DialogCloseIconButton},
 * and {@link DialogFooter} inside.
 */
export const Dialog = ({ className, children, isDismissable = true, ...props }: DialogProps) => {
	return (
		<AriaModalOverlay
			data-slot="dialog-overlay"
			className={dialogOverlayVariants()}
			isDismissable={isDismissable}
			{...props}
		>
			<AriaModal
				data-slot="dialog-content"
				className={composeTailwindRenderProps(className, dialogContentVariants())}
			>
				<AriaDialog data-slot="dialog" className="[display:inherit] [gap:inherit] outline-none">
					{children}
				</AriaDialog>
			</AriaModal>
		</AriaModalOverlay>
	);
};

/** Props for the {@link DialogCloseButton} component. */
export type DialogCloseButtonProps = ButtonProps;

/**
 * A footer button that dismisses the surrounding {@link Dialog} when pressed.
 * Defaults to the outline variant. Use it in place of a plain {@link Button} so
 * the close behavior is never forgotten.
 */
export const DialogCloseButton = ({ variant = "outline", ...props }: DialogCloseButtonProps) => {
	return <Button slot="close" data-slot="dialog-close-button" variant={variant} {...props} />;
};

/** Props for the {@link DialogCloseIconButton} component. */
export type DialogCloseIconButtonProps = Partial<IconButtonProps>;

/**
 * A close button for a {@link Dialog}, rendered as an icon button that dismisses
 * it when pressed. Defaults to a "Close" label and an X icon. Place it inside a
 * {@link DialogHeader}; it sits in the top-right corner.
 */
export const DialogCloseIconButton = ({
	variant = "ghost",
	size = "sm",
	className,
	children,
	"aria-label": ariaLabel = "Close",
	...props
}: DialogCloseIconButtonProps) => {
	return (
		<IconButton
			slot="close"
			data-slot="dialog-close-icon-button"
			variant={variant}
			size={size}
			aria-label={ariaLabel}
			className={composeTailwindRenderProps(className, "absolute top-2 right-2")}
			{...props}
		>
			{children ?? <XIcon aria-hidden="true" />}
		</IconButton>
	);
};

/** Props for the {@link DialogHeader} component. */
export type DialogHeaderProps = React.ComponentProps<"div">;

/** The header section of a {@link Dialog}, containing its {@link DialogTitle} and {@link DialogDescription}. */
export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
	return (
		<div data-slot="dialog-header" className={cn("flex flex-col gap-1", className)} {...props} />
	);
};

/** Props for the {@link DialogFooter} component. */
export type DialogFooterProps = React.ComponentProps<"div">;

/** The footer section of a {@link Dialog}, typically holding the action buttons aligned to the end. */
export const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
	return (
		<div
			data-slot="dialog-footer"
			className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
			{...props}
		/>
	);
};

/** Props for the {@link DialogTitle} component. */
export type DialogTitleProps = AriaHeadingProps;

/** The title of a {@link Dialog}; React Aria labels the dialog with it. */
export const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
	return (
		<AriaHeading
			slot="title"
			data-slot="dialog-title"
			className={cn("font-heading text-base font-medium", className)}
			{...props}
		/>
	);
};

/** Props for the {@link DialogDescription} component. */
export type DialogDescriptionProps = React.ComponentProps<"div">;

/** Supporting text that explains the purpose of a {@link Dialog}. */
export const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
	return (
		<div
			data-slot="dialog-description"
			className={cn(
				[
					"text-sm/relaxed text-muted-foreground",
					"*:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
				],
				className,
			)}
			{...props}
		/>
	);
};
