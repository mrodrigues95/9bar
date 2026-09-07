import { type FieldErrorItem, toErrorMessage } from "#components/field";

export type TErrorFormatter<TError = unknown> = (
	errors: Array<TError>,
) => Array<FieldErrorItem> | string | undefined;

export const defaultErrorFormatter: TErrorFormatter = (errors) => {
	// SAFETY: this is the documented generic-fallback boundary: raw form-library errors
	// arrive as unknown and are normalized into messages here. Values outside the
	// FieldErrorItem contract yield no message instead of crashing.
	const messages = errors
		.map((error) => toErrorMessage(error as FieldErrorItem | null))
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
		// SAFETY: without a formatter the caller passes already-displayable errors (strings or
		// `{ message }` objects). FieldError normalizes each entry again via toErrorMessage, so
		// non-conforming values yield no message instead of crashing.
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
