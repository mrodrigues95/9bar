import { createFormHook } from "@tanstack/react-form";
import { FormSelectField } from "../fields/select-field";
import { FormTextField } from "../fields/text-field";
import { FormSubmitButton } from "../form-submit-button";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		Input: FormTextField,
		Select: FormSelectField,
	},
	formComponents: {
		SubmitButton: FormSubmitButton,
	},
});
