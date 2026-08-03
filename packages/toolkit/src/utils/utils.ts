import { type ClassValue, clsx } from "clsx";
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
	return composeRenderProps(className, (className) => cn(tw, className) ?? "");
};
