import {
	Link as AriaLink,
	type LinkProps as AriaLinkProps,
	composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { buttonVariants } from "../button/button";

export const linkVariants = tv({
	extend: buttonVariants,
	defaultVariants: { variant: "link" },
});

export interface LinkProps
	extends AriaLinkProps,
		VariantProps<typeof linkVariants> {
	"aria-current"?: "page" | "step" | "location" | "date" | "time" | "true";
}

export const Link = ({ variant, size, ...props }: LinkProps) => {
	return (
		<AriaLink
			{...props}
			className={composeRenderProps(props.className, (className, renderProps) =>
				linkVariants({ ...renderProps, variant, size, className }),
			)}
		/>
	);
};
