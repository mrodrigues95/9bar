import { createFormHookContexts } from "@tanstack/react-form";

/** React contexts and hooks that connect field and form components to the TanStack Form instance. */
export const { fieldContext, useFieldContext, formContext, useFormContext } =
	createFormHookContexts();
