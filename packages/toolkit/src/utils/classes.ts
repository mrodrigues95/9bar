import { composeRenderProps } from "react-aria-components";
import { cn } from "tailwind-variants";

export const composeTailwindRenderProps = <T>(
	className: string | ((v: T) => string) | undefined,
	tw: string,
): string | ((v: T) => string) => {
	return composeRenderProps(className, (className) => cn(tw, className) ?? "");
};
