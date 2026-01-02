import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { buttonVariants } from "../button/button";

export const iconButtonVariants = tv({
	extend: buttonVariants,
	base: [
		"relative",
		"[&_svg]:-translate-x-1/2 [&_svg]:-translate-y-1/2 [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:left-1/2",
	],
	variants: {
		size: {
			xs: "size-4 [&_svg]:size-2.5",
			sm: "size-6 [&_svg]:size-4",
			md: "size-8 [&_svg]:size-5",
			lg: "size-10 [&_svg]:size-6",
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
}: IconButtonProps) => {
	return (
		<AriaButton
			data-slot="icon-button"
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				iconButtonVariants({ ...renderProps, variant, size, className }),
			)}
		>
			{children}
		</AriaButton>
	);
};
