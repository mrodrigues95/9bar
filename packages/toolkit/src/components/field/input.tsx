import {
	Input as AriaInput,
	type InputProps as AriaInputProps,
	composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const prefixClasses = (prefix: string, classes: string) =>
	classes
		.split(" ")
		.map((cls) => `${prefix}:${cls}`)
		.join(" ");

const inputStateClasses = {
	focusRing: {
		base: "ring-4",
		valid: "border-ring-fg ring-ring",
	},
	disabled: "bg-slate-50 opacity-50 shadow-none",
} as const;

export const inputFocusRing = tv({
	base: [
		"transition",
		"data-[invalid]:border-ring-destructive-fg data-[invalid]:ring-ring-destructive",
	],
	variants: {
		variant: {
			focusable: [
				prefixClasses("data-[focused]", inputStateClasses.focusRing.base),
				prefixClasses(
					"not-data-[invalid]:data-[focused]",
					inputStateClasses.focusRing.valid,
				),
			],
			indicator: [
				prefixClasses("data-[focus-visible]", inputStateClasses.focusRing.base),
				prefixClasses(
					"not-data-[invalid]:data-[focus-visible]",
					inputStateClasses.focusRing.valid,
				),
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
			focusable: [prefixClasses("disabled", inputStateClasses.disabled)],
			indicator: [prefixClasses("data-[disabled]", inputStateClasses.disabled)],
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
		density: "compact",
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
