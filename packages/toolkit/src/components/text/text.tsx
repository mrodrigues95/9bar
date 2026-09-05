import { cva, type VariantProps } from "class-variance-authority";
import { Text as AriaText, type TextProps as AriaTextProps } from "react-aria-components";
import { cn } from "#lib/utils";

const textVariants = cva("", {
	variants: {
		variant: {
			body: "text-base leading-normal",
			"body-sm": "text-sm leading-relaxed",
			"body-lg": "text-lg leading-relaxed",
			caption: "text-xs leading-normal text-slate-600",
			label: "text-sm leading-none font-medium",
			detail: "text-xs leading-none font-medium",
		},
		color: {
			muted: "text-muted-foreground",
			primary: "text-primary",
			secondary: "text-secondary-foreground",
		},
	},
	defaultVariants: {
		variant: "body",
		color: "muted",
	},
});

export interface TextProps
	extends Omit<AriaTextProps, "elementType" | "color">, VariantProps<typeof textVariants> {
	/** The HTML element type to render. Defaults to `"p"`. */
	as?: string;
}

/** A typographic primitive for body copy, labels, captions, and other running text. */
export const Text = ({ as = "p", variant, color, className, ...props }: TextProps) => {
	return (
		<AriaText
			data-slot="text"
			{...props}
			elementType={as}
			className={cn(textVariants({ variant, color, className }))}
		/>
	);
};
