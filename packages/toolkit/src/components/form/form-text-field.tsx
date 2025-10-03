import { useStore } from "@tanstack/react-form";
import type { InputProps } from "../field/input";
import { TextField as BaseTextField } from "../text-field/text-field";
import { defaultErrorFormatter, type TErrorFormatter } from "./utils/errors";
import { useFieldContext } from "./utils/form-context";

export interface FormTextFieldProps {
	label: string;
	description?: string;
	isRequired?: boolean;
	inputProps?: Omit<InputProps, "name" | "value" | "onChange" | "onBlur">;
	formatErrors?: TErrorFormatter;
}

export function FormTextField({
	label,
	description,
	isRequired,
	inputProps,
	formatErrors = defaultErrorFormatter,
	...props
}: FormTextFieldProps) {
	const field = useFieldContext<string>();
	const errors = useStore(field.store, (state) => state.meta.errors);
	const errorMessage = formatErrors(errors);

	return (
		<BaseTextField
			{...props}
			label={label}
			{...(description && { description })}
			{...(isRequired && { isRequired })}
			{...(errorMessage && { errorMessage })}
			inputProps={{
				...inputProps,
				name: field.name,
				value: field.state.value,
				onBlur: field.handleBlur,
				onChange: (e) => field.handleChange(e.target.value),
			}}
		/>
	);
}
