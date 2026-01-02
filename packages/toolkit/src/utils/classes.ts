import { composeRenderProps } from "react-aria-components";
import { cn, tv } from "tailwind-variants";

export const focusRing = tv({
	base: ["outline outline-ring outline-offset-2", "focus-visible:outline-2"],
	variants: {
		isFocusVisible: {
			false: "outline-0",
			true: "outline-2",
		},
	},
});

export const composeTailwindRenderProps = <T>(
	className: string | ((v: T) => string) | undefined,
	tw: string,
): string | ((v: T) => string) => {
	return composeRenderProps(className, (className) => cn(tw, className) ?? "");
};
