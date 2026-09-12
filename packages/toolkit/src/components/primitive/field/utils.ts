/** A single validation error entry, compatible with TanStack Form's `field.state.meta.errors`. */
export type FieldErrorItem = { message?: string } | string | undefined;

/**
 * Extracts a human-readable message from a normalized error value (string,
 * `{ message }` object, null, or undefined). Values outside the
 * {@link FieldErrorItem} contract yield no message.
 */
export const toErrorMessage = (error: FieldErrorItem | null): string | undefined => {
	if (error === undefined || error === null) {
		return undefined;
	}

	// String primitives are never instanceof Object, so this discriminates the
	// FieldErrorItem union without a runtime typeof check.
	if (error instanceof Object) {
		const message = error.message;
		return message !== undefined && message.length > 0 ? message : undefined;
	}

	return error.length > 0 ? error : undefined;
};

/** Builds an `aria-describedby` value from the description and error element ids. */
export const getFieldDescribedBy = (
	hasDescription: boolean,
	descriptionId: string,
	showError: boolean,
	errorId: string,
) => {
	const ids = [hasDescription && descriptionId, showError && errorId].filter(Boolean);
	return ids.length ? ids.join(" ") : undefined;
};
