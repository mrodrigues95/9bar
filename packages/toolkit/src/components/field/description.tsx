import { Text, type TextProps } from "react-aria-components";
import { tv } from "tailwind-variants";

const descriptionVariants = tv({
	base: ["block text-muted text-xs"],
});

/** Props for the {@link Description} component. */
export interface DescriptionProps extends TextProps {}

/** Help text that describes a form field, displayed below the input. Automatically associated with the field via the `description` slot. */
export const Description = (props: DescriptionProps) => (
	<Text
		slot="description"
		data-slot="description"
		{...props}
		className={descriptionVariants({ className: props.className })}
	/>
);
