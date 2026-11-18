import { type FieldErrorItem, toErrorMessage } from "#components/field";

/** Converts raw form-library errors into field error items, a single message, or nothing. */
export type ErrorFormatter<TError = unknown> = (
	errors: Array<TError>,
) => Array<FieldErrorItem> | string | undefined;

/** The fallback {@link ErrorFormatter}: keeps each error's message and drops values with none. */
export const defaultErrorFormatter: ErrorFormatter = (errors) => {
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- SAFETY: raw form-library errors arrive untyped; toErrorMessage yields no message for values outside FieldErrorItem.
	const items = errors as Array<FieldErrorItem | null>;
	const messages = items
		.map((error) => toErrorMessage(error))
		.filter((message): message is string => message !== undefined);

	return messages.length > 0 ? messages : undefined;
};

/**
 * Resolves the error items displayed by a field: explicit validation `errors`
 * take precedence, otherwise a single `errorMessage` string is wrapped.
 */
export const resolveFieldErrors = (errors?: Array<FieldErrorItem>, errorMessage?: string) =>
	errors ??
	(errorMessage !== undefined && errorMessage !== "" ? [{ message: errorMessage }] : undefined);

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
		formatErrors?: ErrorFormatter<TError>;
	},
) =>
	errorMessage !== undefined
		? [{ message: errorMessage }]
		: normalizeFormErrors(errors, formatErrors);

/** Applies a custom formatter to raw form errors, falling back to the raw errors when no formatter is given. */
export const normalizeFormErrors = <TError = unknown>(
	errors: Array<TError>,
	formatErrors?: ErrorFormatter<TError>,
) => {
	if (!formatErrors) {
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- SAFETY: without a formatter the caller passes displayable errors; FieldError normalizes each entry via toErrorMessage.
		return errors as Array<FieldErrorItem> | undefined;
	}

	const formatted = formatErrors(errors);

	if (formatted === undefined) {
		return undefined;
	}

	return Array.isArray(formatted) ? formatted : [{ message: formatted }];
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
