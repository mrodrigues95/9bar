import {
	CheckboxGroup as AriaCheckboxGroup,
	type CheckboxGroupProps as AriaCheckboxGroupProps,
} from "react-aria-components";
import { composeTailwindRenderProps } from "../../utils/classes";

/** Props for the {@link CheckboxGroup} component. */
export interface CheckboxGroupProps extends AriaCheckboxGroupProps {}

/**
 * A checkbox group allows a user to select one or more items from a list
 * of choices.
 */
export const CheckboxGroup = ({ className, ...props }: CheckboxGroupProps) => {
	return (
		<AriaCheckboxGroup
			data-slot="checkbox-group"
			{...props}
			className={composeTailwindRenderProps(
				className,
				"flex flex-col items-start gap-2",
			)}
		/>
	);
};
