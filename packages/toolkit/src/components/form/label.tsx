import {
	Label as AriaLabel,
	type LabelProps as AriaLabelProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const labelVariants = tv({
	base: [
		"block font-medium text-slate-900 text-sm",
		"data-[disabled]:opacity-50",
	],
});

export interface LabelProps extends AriaLabelProps {}

export const Label = (props: LabelProps) => (
	<AriaLabel
		{...props}
		className={labelVariants({ className: props.className })}
	/>
);
