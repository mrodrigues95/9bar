import { Text, type TextProps } from "react-aria-components";
import { tv } from "tailwind-variants";

const descriptionVariants = tv({
	base: ["block text-slate-500 text-sm", "data-[disabled]:opacity-50"],
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
