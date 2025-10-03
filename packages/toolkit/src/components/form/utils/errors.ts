import type { ZodError } from "zod";

export type TErrorFormatter<TError = unknown> = (
	errors: Array<TError>,
) => string | undefined;

export const zodErrorFormatter: TErrorFormatter<ZodError> = (errors) => {
	if (!errors.length) {
		return undefined;
	}

	const messages = errors.map((error) => error.message).filter((err) => !!err);
	return messages.length ? messages.join(", ") : undefined;
};

export const htmlErrorFormatter: TErrorFormatter<string> = (errors) => {
	if (!errors.length) {
		return undefined;
	}

	const messages = errors
		.map((error) => (typeof error === "string" ? error : String(error)))
		.filter((err) => !!err);

	return messages.length ? messages.join(", ") : undefined;
};

export const defaultErrorFormatter: TErrorFormatter = (errors) => {
	if (!errors.length) {
		return undefined;
	}

	const messages = errors
		.map((error) => {
			if (typeof error === "string") {
				return error;
			}

			if (error && typeof error === "object" && "message" in error) {
				return error.message;
			}

			if (error && typeof error === "object") {
				return error.toString();
			}

			return String(error);
		})
		.filter((err) => !!err);

	return messages.length ? messages.join(", ") : undefined;
};
