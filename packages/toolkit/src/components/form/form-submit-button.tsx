import { Button, type ButtonProps } from "../button/button";
import { useFormContext } from "./hooks/form-context";

export interface FormSubmitButtonProps extends Omit<ButtonProps, "type"> {
	children: React.ReactNode;
	loadingText?: string;
}

export function FormSubmitButton({
	children,
	loadingText = "Submitting...",
	...props
}: FormSubmitButtonProps) {
	const form = useFormContext();

	return (
		<form.Subscribe
			selector={(state) => ({
				canSubmit: state.canSubmit,
				isSubmitting: state.isSubmitting,
			})}
		>
			{({ canSubmit, isSubmitting }) => (
				<Button
					{...props}
					type="submit"
					isDisabled={!canSubmit || Boolean(props.isDisabled)}
				>
					{isSubmitting ? loadingText : children}
				</Button>
			)}
		</form.Subscribe>
	);
}
