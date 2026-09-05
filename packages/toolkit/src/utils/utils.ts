import { type ClassValue, clsx } from "clsx";
import type { ReactNode } from "react";
import { composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind class names, resolving conflicts in favor of the later ones. */
export const cn = (...inputs: Array<ClassValue>) => {
	return twMerge(clsx(inputs));
};

/**
 * Composes a React Aria `className` render prop with a base set of Tailwind
 * classes, merging the two with `cn`.
 */
export const composeTailwindRenderProps = <T>(
	className: string | ((v: T) => string) | undefined,
	tw: string,
): string | ((v: T) => string) => {
	return composeRenderProps(className, (className) => cn(tw, className));
};

/**
 * `children`/`textValue` contract for item components (listbox options, menu
 * items, select options) whose accessible label RAC can infer from a plain-string
 * child. Items with any other children must provide an explicit `textValue`.
 *
 * @template TChildren the item's full original `children` prop type.
 */
export type ItemLabelProps<TChildren> =
	| { children: string; textValue?: string }
	| { children?: TChildren; textValue: string };

/**
 * Resolves the accessible label for an item component typed with {@link ItemLabelProps}:
 * an explicit `textValue` wins, otherwise the plain-string child is the label.
 */
export const resolveItemTextValue = (
	children: ReactNode | ((values: never) => ReactNode),
	textValue: string | undefined,
): string | undefined =>
	// SAFETY: ItemLabelProps requires textValue unless children is a plain string, so the fallback only ever receives the string label.
	textValue ?? (children as string);
