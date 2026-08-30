import type { VariantProps } from "class-variance-authority";
import {
	Link as AriaLink,
	type LinkProps as AriaLinkProps,
	composeRenderProps,
} from "react-aria-components";
import { buttonVariants } from "../button/button";

/** Props for the {@link Link} component. */
export interface LinkProps
	extends AriaLinkProps,
		VariantProps<typeof buttonVariants> {
	"aria-current"?: "page" | "step" | "location" | "date" | "time" | "true";
}

/** A navigation element that allows a user to navigate to another page or resource. */
export const Link = ({ variant = "link", size, ...props }: LinkProps) => {
	return (
		<AriaLink
			data-slot="link"
			{...props}
			className={composeRenderProps(
				props.className,
				(className) => buttonVariants({ variant, size, className }) as string,
			)}
		/>
	);
};
