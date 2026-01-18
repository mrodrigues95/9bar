import {
	Label as AriaLabel,
	type LabelProps as AriaLabelProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const labelVariants = tv({
	base: ["block select-none font-medium text-primary text-sm"],
});

export interface LabelProps extends AriaLabelProps {}

export const Label = (props: LabelProps) => (
	<AriaLabel
		data-slot="label"
		{...props}
		className={labelVariants({ className: props.className })}
	/>
);
