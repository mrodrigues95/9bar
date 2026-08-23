"use client";

import { CheckIcon, MinusIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
	CheckboxButton as AriaCheckboxButton,
	CheckboxField as AriaCheckboxField,
	type CheckboxFieldProps as AriaCheckboxFieldProps,
	type CheckboxButtonRenderProps,
	composeRenderProps,
} from "react-aria-components";
import { cn } from "#lib/utils";

/** Props for the {@link CheckboxControl} component. */
export type CheckboxControlProps = {
	/** The content of the control. Pass a render prop to access the checkbox state. */
	children?: ReactNode | ((values: CheckboxButtonRenderProps) => ReactNode);
	/** Additional classes applied to the control. */
	className?: string;
};

/**
 * The clickable region of a {@link Checkbox}. Renders the checkbox input semantics
 * and composes the {@link CheckboxIndicator} with the label.
 */
export const CheckboxControl = ({
	children,
	className,
}: CheckboxControlProps) => {
	return (
		<AriaCheckboxButton
			data-slot="checkbox-control"
			className={cn(
				[
					"group/checkbox flex shrink-0 select-none items-center gap-2 text-sm outline-none",
				],
				className,
			)}
		>
			{composeRenderProps(children, (children) => (
				<>{children}</>
			))}
		</AriaCheckboxButton>
	);
};

/** Props for the {@link CheckboxIndicator} component. */
export type CheckboxIndicatorProps = {
	/** The icon rendered inside the indicator when the checkbox is checked or indeterminate. */
	children?: ReactNode;
	/** Additional classes applied to the indicator box. */
	className?: string;
};

/** The visual box of a {@link Checkbox}, rendered inside the {@link CheckboxControl}. */
export const CheckboxIndicator = ({
	children,
	className,
}: CheckboxIndicatorProps) => {
	return (
		<span
			data-slot="checkbox-indicator"
			aria-hidden="true"
			className={cn(
				[
					"relative flex size-4 shrink-0 items-center justify-center rounded-[4px]",
					"border border-input transition-shadow",
					"after:absolute after:-inset-x-3 after:-inset-y-2",
					"group-data-focus-visible/checkbox:border-ring",
					"group-data-focus-visible/checkbox:ring-2",
					"group-data-focus-visible/checkbox:ring-ring/30",
					"group-aria-invalid/checkbox:border-destructive",
					"group-aria-invalid/checkbox:ring-2",
					"group-aria-invalid/checkbox:ring-destructive/20",
					"group-data-invalid/checkbox:border-destructive",
					"group-data-invalid/checkbox:ring-2",
					"group-data-invalid/checkbox:ring-destructive/20",
					"group-data-invalid/checkbox:group-data-selected/checkbox:border-primary",
					"group-data-checked/checkbox:border-primary",
					"group-data-checked/checkbox:bg-primary",
					"group-data-selected/checkbox:border-primary",
					"group-data-selected/checkbox:bg-primary",
					"group-data-checked/checkbox:text-primary-foreground",
					"group-data-selected/checkbox:text-primary-foreground",
					"dark:bg-input/30",
					"dark:group-data-checked/checkbox:bg-primary",
					"dark:group-data-selected/checkbox:bg-primary",
					"dark:group-data-invalid/checkbox:border-destructive/50",
					"dark:group-data-invalid/checkbox:ring-destructive/40",
					"dark:group-aria-invalid/checkbox:border-destructive/50",
					"dark:group-aria-invalid/checkbox:ring-destructive/40",
					"[&>svg]:size-3.5 [&>svg]:shrink-0",
				],
				className,
			)}
		>
			{children}
		</span>
	);
};

/** Props for the {@link Checkbox} component. */
export type CheckboxProps = AriaCheckboxFieldProps;

/**
 * A control that allows a user to toggle a single option on or off, supporting an
 * indeterminate state.
 */
export const Checkbox = ({ className, children, ...props }: CheckboxProps) => {
	return (
		<AriaCheckboxField
			data-slot="checkbox"
			className={cn(
				[
					"flex flex-col gap-1",
					"data-disabled:cursor-not-allowed data-disabled:opacity-50",
					"group-has-disabled/field:opacity-50",
				],
				className,
			)}
			{...props}
		>
			<CheckboxControl>
				{({ isSelected, isIndeterminate }) => (
					<>
						<CheckboxIndicator>
							{isIndeterminate ? (
								<MinusIcon />
							) : isSelected ? (
								<CheckIcon />
							) : null}
						</CheckboxIndicator>
						{children}
					</>
				)}
			</CheckboxControl>
		</AriaCheckboxField>
	);
};
