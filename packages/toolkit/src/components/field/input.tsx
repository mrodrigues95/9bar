import {
	Input as AriaInput,
	type InputProps as AriaInputProps,
	composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

export const inputFocusRing = tv({
	base: [
		"transition",
		"data-[invalid]:border-ring-destructive-fg data-[invalid]:ring-ring-destructive",
	],
	variants: {
		variant: {
			focusable: [
				"data-[focused]:ring-4",
				"not-data-[invalid]:data-[focused]:border-ring-fg",
				"not-data-[invalid]:data-[focused]:ring-ring",
			],
			indicator: [
				"data-[focus-visible]:ring-4",
				"not-data-[invalid]:data-[focus-visible]:border-ring-fg",
				"not-data-[invalid]:data-[focus-visible]:ring-ring",
			],
		},
	},
	defaultVariants: {
		variant: "focusable",
	},
});

export const inputDisabled = tv({
	variants: {
		variant: {
			focusable: [
				"disabled:bg-slate-50",
				"disabled:opacity-50",
				"disabled:shadow-none",
			],
			indicator: [
				"data-[disabled]:bg-slate-50",
				"data-[disabled]:opacity-50",
				"data-[disabled]:shadow-none",
			],
		},
	},
	defaultVariants: {
		variant: "focusable",
	},
});

export const inputVariants = tv({
	extend: inputFocusRing,
	base: [
		"relative block w-full rounded-lg border border-border bg-white text-slate-900 text-sm placeholder-slate-400 shadow-xs outline-none",
		inputDisabled(),
	],
	variants: {
		density: {
			loose: "px-2.5 py-1.5",
			compact: "px-1.5 py-1",
		},
	},
	defaultVariants: {
		density: "loose",
	},
});

export interface InputProps
	extends AriaInputProps,
		VariantProps<typeof inputVariants> {}

export const Input = ({ density, ...props }: InputProps) => (
	<AriaInput
		data-slot="input"
		{...props}
		className={composeRenderProps(props.className, (className, renderProps) =>
			inputVariants({ ...renderProps, density, className }),
		)}
	/>
);
