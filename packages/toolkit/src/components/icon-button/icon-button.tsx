import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { buttonVariants } from "../button/button";

// TODO: Convert this to slots, switch the icon sizing method to use size prop properly (e.g. size-4, size-6, etc)
// TODO: Add ghost variant with no bg or ring on focus
export const iconButtonVariants = tv({
	extend: buttonVariants,
	variants: {
		size: {
			sm: "size-6",
			md: "size-8",
			lg: "size-10",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

export interface IconButtonProps
	extends Omit<AriaButtonProps, "children">,
		VariantProps<typeof iconButtonVariants> {
	children: React.ReactNode;
	"aria-label": string;
}

export const IconButton = ({
	variant,
	size,
	children,
	...props
}: IconButtonProps) => (
	<AriaButton
		{...props}
		className={composeRenderProps(props.className, (className, renderProps) =>
			iconButtonVariants({ ...renderProps, variant, size, className }),
		)}
	>
		<span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 [&>*:first-child]:h-full [&>*:first-child]:w-full">
			{children}
		</span>
	</AriaButton>
);
