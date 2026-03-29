import { CheckIcon, MinusIcon } from "@heroicons/react/24/solid";
import type { ComponentProps, ReactNode } from "react";
import {
	Checkbox as AriaCheckbox,
	type CheckboxProps as AriaCheckboxProps,
	type CheckboxRenderProps as AriaCheckboxRenderProps,
	composeRenderProps,
} from "react-aria-components";
import { cn, tv } from "tailwind-variants";
import { inputDisabled, inputFocusRing } from "../field/input";

export const checkboxVariants = tv({
	slots: {
		root: [
			"flex flex-col items-start gap-0.5",
			'[&>[data-slot$="description"]]:ml-6.5',
			'[&>[data-slot$="error"]]:ml-6.5',
		],
		label: [
			"group relative flex shrink-0 select-none items-center justify-center gap-2 font-normal text-sm",
			"disabled:pointer-events-none",
		],
		indicator: [
			"inline-flex size-4.5 shrink-0 items-center justify-center rounded-[0.3125rem] border border-border bg-white text-primary shadow-xs",
			"not-data-[invalid]:not-data-[focus-visible]:hover:border-primary/25",
			"selected:bg-primary selected:text-white",
		],
	},
});

/** Props for the {@link CheckboxRoot} component. */
export interface CheckboxRootProps extends ComponentProps<"div"> {}

/** A layout wrapper for a checkbox, its description, and its error message. */
export const CheckboxRoot = ({ className, ...props }: CheckboxRootProps) => {
	const { root } = checkboxVariants();
	return (
		<div data-slot="checkbox-root" className={root({ className })} {...props} />
	);
};

/** Props for the {@link Checkbox} component. */
export interface CheckboxProps extends AriaCheckboxProps {
	/** A custom render function for the checkbox indicator. Receives the current render props (selected, indeterminate, etc.). */
	indicator?: (renderProps: AriaCheckboxRenderProps) => ReactNode;
}

/**
 * A checkbox allows a user to select a boolean value. Supports
 * indeterminate state for partially selected groups.
 */
export const Checkbox = ({ indicator, ...props }: CheckboxProps) => {
	const { label } = checkboxVariants();

	return (
		<AriaCheckbox
			data-slot="checkbox"
			{...props}
			className={composeRenderProps(props.className, (className) =>
				label({ className }),
			)}
		>
			{composeRenderProps(props.children, (children, renderProps) => (
				<>
					{indicator?.(renderProps)}
					{!indicator && (
						<CheckboxIndicator renderProps={renderProps}>
							<CheckboxIcon {...renderProps} />
						</CheckboxIndicator>
					)}
					{children}
				</>
			))}
		</AriaCheckbox>
	);
};

/** Props for the {@link CheckboxIndicator} component. */
export interface CheckboxIndicatorProps extends ComponentProps<"div"> {
	/** The current checkbox render props, used to derive visual state (selected, invalid, etc.). */
	renderProps?: AriaCheckboxRenderProps;
	/** The icon or content to display inside the indicator box. */
	children: ReactNode;
}

/** The visual box of a checkbox that displays the check or indeterminate icon. */
export const CheckboxIndicator = ({
	renderProps,
	children,
	className,
	...props
}: CheckboxIndicatorProps) => {
	const { indicator } = checkboxVariants();
	const { isSelected, isIndeterminate, isInvalid, isFocusVisible, isDisabled } =
		renderProps ?? {};

	return (
		<div
			data-slot="checkbox-indicator"
			data-disabled={isDisabled ? "true" : undefined}
			data-selected={isSelected || isIndeterminate || undefined}
			data-focus-visible={isFocusVisible ? "true" : undefined}
			data-invalid={isInvalid ? "true" : undefined}
			{...props}
			className={cn(
				indicator({ className }),
				inputFocusRing({ variant: "focusVisible" }),
				inputDisabled(),
			)}
		>
			{children}
		</div>
	);
};

/** Props for the {@link CheckboxIcon} component. */
export interface CheckboxIconProps extends AriaCheckboxRenderProps {}

/** Renders a check or minus icon based on the checkbox's selected and indeterminate state. */
export const CheckboxIcon = ({
	isIndeterminate,
	isSelected,
}: CheckboxIconProps) => {
	return isIndeterminate ? (
		<MinusIcon className="size-3.5" />
	) : isSelected ? (
		<CheckIcon className="size-3.5" />
	) : null;
};
