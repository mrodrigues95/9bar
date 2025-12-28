import {
	Text as AriaText,
	type TextProps as AriaTextProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const textVariants = tv({
	base: "",
	variants: {
		variant: {
			body: "text-base leading-normal",
			"body-sm": "text-sm leading-relaxed",
			"body-lg": "text-lg leading-relaxed",
			caption: "text-slate-600 text-xs leading-normal",
			label: "font-medium text-sm leading-none",
			detail: "font-medium text-xs leading-none",
		},
		color: {
			muted: "text-slate-500",
			primary: "text-slate-950",
			secondary: "text-slate-700",
		},
	},
	defaultVariants: {
		variant: "body",
		color: "muted",
	},
});

export interface TextProps
	extends Omit<AriaTextProps, "elementType" | "color">,
		VariantProps<typeof textVariants> {
	as?: string;
}

export const Text = ({
	as = "p",
	variant,
	color,
	className,
	...props
}: TextProps) => {
	return (
		<AriaText
			{...props}
			elementType={as}
			className={textVariants({ variant, color, className })}
		/>
	);
};
