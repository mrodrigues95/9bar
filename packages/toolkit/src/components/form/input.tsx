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
		"block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 text-sm placeholder-slate-400 shadow-sm transition-colors",
		"focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
		"invalid:border-red-500 invalid:ring-1 invalid:ring-red-500",
		"data-[disabled]:cursor-not-allowed data-[disabled]:bg-slate-50 data-[disabled]:text-slate-500",
	],
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
