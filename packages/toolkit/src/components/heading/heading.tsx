import { cva, type VariantProps } from "class-variance-authority";
import { Text, type TextProps } from "react-aria-components";
import { cn } from "#lib/utils";

const headingVariants = cva("text-primary", {
	variants: {
		variant: {
			heading: "text-2xl leading-tight font-semibold tracking-tight sm:text-3xl",
			subheading: "text-base leading-snug font-semibold sm:text-lg",
			title: "text-xl leading-tight font-semibold sm:text-2xl",
			subtitle: "text-lg leading-normal font-medium sm:text-xl",
			section: "text-base leading-normal font-semibold",
			subsection: "text-sm leading-normal font-medium",
		},
	},
	defaultVariants: {
		variant: "heading",
	},
});

export interface HeadingProps
	extends Omit<TextProps, "elementType">, VariantProps<typeof headingVariants> {
	/** The HTML element type to render. Defaults to `"h1"`. */
	as?: string;
}

/** A typographic heading component that maps visual variants to semantic HTML heading levels. */
export const Heading = ({ as = "h1", variant, className, ...props }: HeadingProps) => {
	return (
		<Text
			data-slot="heading"
			{...props}
			elementType={as}
			className={cn(headingVariants({ variant, className }))}
		/>
	);
};
