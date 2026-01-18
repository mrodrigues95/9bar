import { Text, type TextProps } from "react-aria-components";
import { tv } from "tailwind-variants";

const descriptionVariants = tv({
	base: ["block text-muted text-xs"],
});

export interface DescriptionProps extends TextProps {}

export const Description = (props: DescriptionProps) => (
	<Text
		slot="description"
		data-slot="description"
		{...props}
		className={descriptionVariants({ className: props.className })}
	/>
);
