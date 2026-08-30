import { type FieldErrorItem, toErrorMessage } from "../../field/field";

export type TErrorFormatter<TError = unknown> = (
	errors: Array<TError>,
) => Array<FieldErrorItem> | string | undefined;

export const defaultErrorFormatter: TErrorFormatter = (errors) => {
	const messages = errors
		.map((error) => toErrorMessage(error))
		.filter((err): err is string => !!err);

	return messages.length ? messages : undefined;
};

/**
 * Resolves the error items displayed by a field: explicit validation `errors`
 * take precedence, otherwise a single `errorMessage` string is wrapped.
 */
export const resolveFieldErrors = (
	errors?: Array<FieldErrorItem>,
	errorMessage?: string,
): Array<FieldErrorItem> | undefined =>
	errors ?? (errorMessage ? [{ message: errorMessage }] : undefined);

/**
 * Resolves the error items displayed by a form-connected field: an explicit
 * `errorMessage` takes precedence over the field's normalized validation errors.
 */
export const resolveFormFieldErrors = <TError = unknown>(
	errors: Array<TError>,
	{
		errorMessage,
		formatErrors,
	}: {
		errorMessage?: string;
		formatErrors?: TErrorFormatter<TError>;
	},
): Array<FieldErrorItem> | undefined =>
	errorMessage !== undefined
		? [{ message: errorMessage }]
		: normalizeFormErrors(errors, formatErrors);

/** Applies a custom formatter to raw form errors, falling back to the raw errors when no formatter is given. */
export const normalizeFormErrors = <TError = unknown>(
	errors: Array<TError>,
	formatErrors?: TErrorFormatter<TError>,
): Array<FieldErrorItem> | undefined => {
	if (!formatErrors) {
		return errors as Array<FieldErrorItem> | undefined;
	}

	const formatted = formatErrors(errors);

	return typeof formatted === "string" ? [{ message: formatted }] : formatted;
};

/** The shadcn-style validity state derived from a field's meta: invalid only once the field has been touched. */
export const getFieldErrorState = <
	TMeta extends {
		isTouched: boolean;
		isValid: boolean;
		errors: Array<unknown>;
	},
>(
	meta: TMeta,
) => ({
	isInvalid: meta.isTouched && !meta.isValid,
	errors: meta.errors,
});
