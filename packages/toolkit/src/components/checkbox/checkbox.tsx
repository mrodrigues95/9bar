"use client";

import { CheckIcon, MinusIcon } from "lucide-react";
import {
	CheckboxButton as AriaCheckboxButton,
	CheckboxField as AriaCheckboxField,
	type CheckboxFieldProps as AriaCheckboxFieldProps,
	composeRenderProps,
} from "react-aria-components";
import { cn } from "#lib/utils";

/** Props for the {@link Checkbox} component. */
export type CheckboxProps = AriaCheckboxFieldProps;

/** A control that allows a user to toggle a single option on or off, supporting an indeterminate state. */
export const Checkbox = ({ className, children, ...props }: CheckboxProps) => {
	return (
		<AriaCheckboxField
			data-slot="checkbox"
			className={cn(
				[
					"flex flex-col gap-1",
					"data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
					"group-has-disabled/field:opacity-50",
				],
				className,
			)}
			{...props}
		>
			<AriaCheckboxButton className="group/checkbox flex shrink-0 select-none items-center gap-2 text-sm outline-none">
				{composeRenderProps(
					children,
					(children, { isSelected, isIndeterminate }) => (
						<>
							<span
								data-slot="checkbox-indicator"
								className={cn([
									"relative flex size-4 shrink-0 items-center justify-center rounded-[4px]",
									"border border-input transition-shadow",
									"after:absolute after:-inset-x-3 after:-inset-y-2",
									"group-data-[focus-visible]/checkbox:border-ring",
									"group-data-[focus-visible]/checkbox:ring-2",
									"group-data-[focus-visible]/checkbox:ring-ring/30",
									"group-aria-invalid/checkbox:border-destructive",
									"group-aria-invalid/checkbox:ring-2",
									"group-aria-invalid/checkbox:ring-destructive/20",
									"group-data-[invalid]/checkbox:border-destructive",
									"group-data-[invalid]/checkbox:ring-2",
									"group-data-[invalid]/checkbox:ring-destructive/20",
									"group-data-[invalid]/checkbox:group-data-[selected]/checkbox:border-primary",
									"group-data-[checked]/checkbox:border-primary",
									"group-data-[checked]/checkbox:bg-primary",
									"group-data-[selected]/checkbox:border-primary",
									"group-data-[selected]/checkbox:bg-primary",
									"group-data-[checked]/checkbox:text-primary-foreground",
									"group-data-[selected]/checkbox:text-primary-foreground",
									"dark:bg-input/30",
									"dark:group-data-[checked]/checkbox:bg-primary",
									"dark:group-data-[selected]/checkbox:bg-primary",
									"dark:group-data-[invalid]/checkbox:border-destructive/50",
									"dark:group-data-[invalid]/checkbox:ring-destructive/40",
									"dark:group-aria-invalid/checkbox:border-destructive/50",
									"dark:group-aria-invalid/checkbox:ring-destructive/40",
									"[&>svg]:size-3.5 [&>svg]:shrink-0",
								])}
							>
								{isIndeterminate ? (
									<MinusIcon />
								) : isSelected ? (
									<CheckIcon />
								) : null}
							</span>
							{children}
						</>
					),
				)}
			</AriaCheckboxButton>
		</AriaCheckboxField>
	);
};
