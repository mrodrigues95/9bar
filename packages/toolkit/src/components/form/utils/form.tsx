import { createFormHook } from "@tanstack/react-form";
import { FormCheckboxField } from "../fields/checkbox-field";
import { FormCheckboxGroupField } from "../fields/checkbox-group-field";
import { FormSelectField } from "../fields/select-field";
import { FormTextField } from "../fields/text-field";
import { FormTextareaField } from "../fields/textarea-field";
import { FormSubmitButton } from "../form-submit-button";
import { fieldContext, formContext } from "./form-context";

export const { useAppForm, withForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		Input: FormTextField,
		Textarea: FormTextareaField,
		Select: FormSelectField,
		Checkbox: FormCheckboxField,
		CheckboxGroup: FormCheckboxGroupField,
	},
	formComponents: {
		SubmitButton: FormSubmitButton,
	},
});
