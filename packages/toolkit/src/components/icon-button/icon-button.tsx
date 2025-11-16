import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { buttonVariants } from "../button/button";

export const iconButtonVariants = tv({
	extend: buttonVariants,
	base: "relative",
	variants: {
		size: {
			xs: "size-4",
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

const iconButtonContainerVariants = tv({
	base: "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2",
	variants: {
		size: {
			xs: "[&>*:first-child]:size-2.5",
			sm: "[&>*:first-child]:size-4",
			md: "[&>*:first-child]:size-5",
			lg: "[&>*:first-child]:size-6",
		},
	},
	defaultVariants: {
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
}: IconButtonProps) => {
	return (
		<AriaButton
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				iconButtonVariants({ ...renderProps, variant, size, className }),
			)}
		>
			<span className={iconButtonContainerVariants({ size })}>{children}</span>
		</AriaButton>
	);
};
