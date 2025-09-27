import {
	Input as AriaInput,
	type InputProps as AriaInputProps,
	composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "../../utils/classes";

const inputVariants = tv({
	extend: focusRing,
	base: [
		"relative block w-full rounded-md border border-slate-950/10 bg-white text-slate-900 text-sm shadow-xs placeholder-slate-400 transition duration-150 outline-none",
		"focus:border-blue-500 focus:ring-4 focus:ring-blue-200",
		"invalid:border-red-500 invalid:focus:ring-4 invalid:focus:ring-red-200 invalid:focus:border-red-400 invalid:focus:ring-red-200",
		"disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 disabled:shadow-none",
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

export interface InputProps extends AriaInputProps {}

export const Input = (props: InputProps) => (
	<AriaInput
		{...props}
		className={composeRenderProps(props.className, (className, renderProps) =>
			inputVariants({ ...renderProps, className }),
		)}
	/>
);
