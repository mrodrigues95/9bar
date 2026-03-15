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
			focused: [
				"data-[focused]:ring-4",
				"not-data-[invalid]:data-[focused]:border-ring-fg",
				"not-data-[invalid]:data-[focused]:ring-ring",
			],
			focusVisible: [
				"data-[focus-visible]:ring-4",
				"not-data-[invalid]:data-[focus-visible]:border-ring-fg",
				"not-data-[invalid]:data-[focus-visible]:ring-ring",
			],
			focusWithin: [
				"data-[focus-within]:ring-4",
				"not-data-[invalid]:data-[focus-within]:border-ring-fg",
				"not-data-[invalid]:data-[focus-within]:ring-ring",
			],
		},
	},
	defaultVariants: {
		variant: "focused",
	},
});

export const inputDisabled = tv({
	base: [
		"[&:disabled,&[data-disabled]]:bg-slate-50",
		"[&:disabled,&[data-disabled]]:opacity-50",
		"[&:disabled,&[data-disabled]]:shadow-none",
	],
});

export const inputText = tv({
	base: ["text-slate-900 text-sm placeholder-slate-400"],
});

export const inputContainer = tv({
	base: ["rounded-lg border border-border bg-white shadow-xs outline-none"],
});

export const inputDensity = tv({
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

export const inputVariants = tv({
	extend: inputFocusRing,
	base: [
		inputText(),
		inputDisabled(),
		inputContainer(),
		"relative block w-full",
	],
	variants: {
		density: {
			loose: inputDensity({ density: "loose" }),
			compact: inputDensity({ density: "compact" }),
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
