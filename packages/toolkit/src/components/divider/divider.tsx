import {
	Separator as AriaSeparator,
	type SeparatorProps as AriaSeparatorProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const dividerVariants = tv({
	base: "shrink-0 border-slate-950/10 bg-slate-950/10",
	variants: {
		orientation: {
			horizontal: "h-px self-stretch",
			vertical: "w-px self-stretch",
		},
		variant: {
			default: "",
			middle: "",
		},
	},
	compoundVariants: [
		{
			orientation: "horizontal",
			variant: "default",
			className: "w-full",
		},
		{
			orientation: "vertical",
			variant: "default",
			className: "h-auto",
		},
		{
			orientation: "horizontal",
			variant: "middle",
			className: "mx-4 w-auto",
		},
		{
			orientation: "vertical",
			variant: "middle",
			className: "my-4 h-auto",
		},
	],
	defaultVariants: {
		orientation: "horizontal",
		variant: "default",
	},
});

export interface DividerProps
	extends Omit<AriaSeparatorProps, "orientation">,
		VariantProps<typeof dividerVariants> {}

export const Divider = ({
	orientation,
	variant,
	className,
	...props
}: DividerProps) => {
	return (
		<AriaSeparator
			data-slot="divider"
			{...props}
			orientation={orientation === "vertical" ? "vertical" : "horizontal"}
			className={dividerVariants({ orientation, variant, className })}
		/>
	);
};
