import {
	Input as AriaInput,
	type InputProps as AriaInputProps,
	composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

export const inputFocusRing = tv({
	base: [
		"outline-none transition duration-150",
		"focus:border-ring-fg focus:ring-4 focus:ring-ring",
		"invalid:border-ring-destructive-fg invalid:focus:border-ring-destructive-fg invalid:focus:ring-4 invalid:focus:ring-ring-destructive",
		"group-invalid:border-ring-destructive-fg group-invalid:focus:border-ring-destructive-fg group-invalid:focus:ring-4 group-invalid:focus:ring-ring-destructive",
	],
});

export const inputVariants = tv({
	extend: inputFocusRing,
	base: [
		"relative block w-full rounded-md border border-border bg-white text-slate-900 text-sm placeholder-slate-400 shadow-xs outline-none",
		"disabled:bg-slate-50 disabled:text-slate-400 disabled:shadow-none",
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
