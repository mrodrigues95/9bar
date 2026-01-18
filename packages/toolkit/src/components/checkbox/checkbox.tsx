import { CheckIcon, MinusIcon } from "@heroicons/react/24/solid";
import type { ComponentProps, ReactNode } from "react";
import {
	Checkbox as AriaCheckbox,
	type CheckboxProps as AriaCheckboxProps,
	type CheckboxRenderProps as AriaCheckboxRenderProps,
	composeRenderProps,
} from "react-aria-components";
import { cn, tv } from "tailwind-variants";
import { focusRing } from "../../utils/classes";

export const checkboxVariants = tv({
	slots: {
		root: [
			"flex flex-col items-start gap-0.5",
			"has-[:disabled]:opacity-50",
			'[&>[data-slot$="description"]]:ml-6.5',
			'[&>[data-slot$="error"]]:ml-6.5',
		],
		label: [
			"group relative flex shrink-0 select-none items-center justify-center gap-2 font-normal text-sm",
			"disabled:pointer-events-none disabled:opacity-50",
		],
		indicator: [
			"inline-flex size-4.5 shrink-0 items-center justify-center rounded-[0.3125rem] border border-border bg-white text-primary shadow-xs transition",
			"data-[focus-visible=false]:data-[invalid=false]:hover:border-primary/25",
			"selected:bg-primary selected:text-white",
		],
	},
});

export interface CheckboxRootProps extends ComponentProps<"div"> {}

export const CheckboxRoot = ({ className, ...props }: CheckboxRootProps) => {
	const { root } = checkboxVariants();
	return (
		<div data-slot="checkbox-root" className={root({ className })} {...props} />
	);
};

export interface CheckboxProps extends AriaCheckboxProps {
	indicator?: (renderProps: AriaCheckboxRenderProps) => ReactNode;
}

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

export interface CheckboxIndicatorProps extends ComponentProps<"div"> {
	renderProps?: AriaCheckboxRenderProps;
	children: ReactNode;
}

export const CheckboxIndicator = ({
	renderProps,
	children,
	className,
	...props
}: CheckboxIndicatorProps) => {
	const { indicator } = checkboxVariants();
	const { isSelected, isIndeterminate, isInvalid, isFocusVisible } =
		renderProps ?? {};

	return (
		<div
			data-slot="checkbox-indicator"
			data-selected={isSelected || isIndeterminate || undefined}
			data-focus-visible={isFocusVisible ? "true" : "false"}
			data-invalid={isInvalid ? "true" : "false"}
			{...props}
			className={cn(focusRing({ isFocusVisible }), indicator({ className }))}
		>
			{children}
		</div>
	);
};

export interface CheckboxIconProps extends AriaCheckboxRenderProps {}

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
