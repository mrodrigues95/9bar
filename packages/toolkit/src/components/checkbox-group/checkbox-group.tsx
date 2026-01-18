import {
	CheckboxGroup as AriaCheckboxGroup,
	type CheckboxGroupProps as AriaCheckboxGroupProps,
} from "react-aria-components";
import { composeTailwindRenderProps } from "../../utils/classes";

export interface CheckboxGroupProps extends AriaCheckboxGroupProps {}

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
