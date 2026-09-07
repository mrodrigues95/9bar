"use client";

import { cva } from "class-variance-authority";
import { Separator as AriaSeparator } from "react-aria-components";
import { cn } from "#lib/utils";

const separatorVariants = cva("block shrink-0 border-0 bg-border", {
	variants: {
		orientation: {
			horizontal: "h-px w-full",
			vertical: "w-px self-stretch",
		},
	},
	defaultVariants: {
		orientation: "horizontal",
	},
});

/** Props for the {@link Separator} component. */
export type SeparatorProps = React.ComponentProps<typeof AriaSeparator>;

/** A visual divider between content, rendered as a horizontal or vertical line. */
export const Separator = ({ className, orientation = "horizontal", ...props }: SeparatorProps) => {
	return (
		<AriaSeparator
			data-slot="separator"
			orientation={orientation}
			className={cn(separatorVariants({ orientation }), className)}
			{...props}
		/>
	);
};
