import { Button, type ButtonProps } from "../button/button";
import { useFormContext } from "./utils/form-context";

/** Props for the {@link FormSubmitButton} component. */
export interface FormSubmitButtonProps extends Omit<ButtonProps, "type"> {
	/** The button label content. */
	children: React.ReactNode;
	/** Text displayed while the form is submitting. */
	loadingText?: string;
}

/** A submit button that automatically disables itself when the form cannot submit or is currently submitting. */
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
