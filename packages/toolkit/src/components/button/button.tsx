import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "../../utils/classes";

export const buttonVariants = tv({
	extend: focusRing,
	base: [
		"relative inline-flex cursor-pointer select-none items-center justify-center gap-x-2 rounded-md font-semibold text-sm transition duration-150",
		"disabled:pointer-events-none disabled:opacity-50",
	],
	variants: {
		variant: {
			default: [
				"bg-slate-100 text-slate-700",
				"hover:bg-slate-200 hover:text-slate-900",
				"pressed:bg-slate-300",
			],
			solid: [
				"bg-slate-900 text-white",
				"hover:bg-slate-700",
				"pressed:bg-slate-600",
			],
			solidBlue: [
				"bg-blue-700 text-white",
				"hover:bg-blue-900",
				"pressed:bg-blue-950",
			],
			danger: [
				"text-red-600 hover:bg-red-100",
				"focus-visible:bg-red-100 focus-visible:ring-red-600",
				"pressed:bg-red-200",
			],
			outline: [
				"border border-slate-200 bg-transparent text-slate-700 shadow-sm",
				"hover:bg-slate-100 hover:text-slate-900",
				"pressed:bg-slate-200",
			],
			ghost: [
				"bg-transparent text-slate-500",
				"hover:bg-slate-100 hover:text-slate-900",
				"pressed:bg-slate-200",
			],
			link: [
				"text-slate-900 underline-offset-4",
				"hover:underline",
				"focus-visible:underline focus-visible:ring-0 focus-visible:ring-offset-0",
			],
		},
		size: {
			xs: "px-2 py-1 text-xs",
			sm: "px-2.5 py-1 text-sm",
			md: "px-3 py-2 text-base",
			lg: "px-4 py-2 text-lg",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "sm",
	},
});

export interface ButtonProps
	extends AriaButtonProps,
		VariantProps<typeof buttonVariants> {}

export const Button = ({ variant, size, ...props }: ButtonProps) => (
	<AriaButton
		{...props}
		className={composeRenderProps(props.className, (className, renderProps) =>
			buttonVariants({ ...renderProps, variant, size, className }),
		)}
	/>
);
