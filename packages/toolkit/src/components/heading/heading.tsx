import { Text, type TextProps } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const headingVariants = tv({
	base: "text-slate-950",
	variants: {
		variant: {
			heading:
				"font-semibold text-2xl leading-tight tracking-tight sm:text-3xl",
			subheading: "font-semibold text-base leading-snug sm:text-lg",
			title: "font-semibold text-xl leading-tight sm:text-2xl",
			subtitle: "font-medium text-lg leading-normal sm:text-xl",
			section: "font-semibold text-base leading-normal",
			label: "font-medium text-sm leading-normal",
		},
	},
	defaultVariants: {
		variant: "heading",
	},
});

export interface HeadingProps
	extends Omit<TextProps, "elementType">,
		VariantProps<typeof headingVariants> {
	as?: string;
}

export const Heading = ({
	as = "h1",
	variant,
	className,
	...props
}: HeadingProps) => {
	return (
		<Text
			{...props}
			elementType={as}
			className={headingVariants({ variant, className })}
		/>
	);
};
