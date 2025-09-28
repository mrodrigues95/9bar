import { createFormHook } from "@tanstack/react-form";
import { FormSubmitButton } from "../form-submit-button";
import { FormTextField } from "../form-text-field";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		TextField: FormTextField,
	},
	formComponents: {
		SubmitButton: FormSubmitButton,
	},
});
