import {
	Label as AriaLabel,
	type LabelProps as AriaLabelProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const labelVariants = tv({
	base: ["block select-none font-medium text-primary text-sm"],
});

/** Props for the {@link Label} component. */
export interface LabelProps extends AriaLabelProps {}

/** A label for a form field, automatically associated with its input via React Aria's labeling system. */
export const Label = (props: LabelProps) => (
	<AriaLabel
		data-slot="label"
		{...props}
		className={labelVariants({ className: props.className })}
	/>
);
