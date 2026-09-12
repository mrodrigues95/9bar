export type FeedbackPin = {
	id: string;
	variantId: string;
	selector: string;
	tag: string;
	dataSlot: string | null;
	textSnippet: string;
	comment: string;
};

const storageKey = (variantId: string): string => {
	return `9bar-design-feedback:${variantId}`;
};

export const readStoredPins = (variantId: string): Array<FeedbackPin> => {
	if (typeof window === "undefined") {
		return [];
	}
	try {
		const raw = window.localStorage.getItem(storageKey(variantId));
		if (!raw) {
			return [];
		}
		const parsed: unknown = JSON.parse(raw);
		// SAFETY: pins are only ever written by this same module via JSON.stringify,
		// so an array parsed from our own storage key already has the FeedbackPin shape.
		return Array.isArray(parsed) ? (parsed as Array<FeedbackPin>) : [];
	} catch {
		return [];
	}
};

export const writeStoredPins = (variantId: string, pins: Array<FeedbackPin>): void => {
	try {
		window.localStorage.setItem(storageKey(variantId), JSON.stringify(pins));
	} catch {
		return;
	}
};

export const pinsToMarkdown = (variantId: string, pins: Array<FeedbackPin>): string => {
	if (!pins.length) {
		return `## Design feedback — ${variantId}\n\nNo pins. Looks good.`;
	}
	const lines = pins.map((pin, index) => {
		const where = pin.dataSlot !== null ? `${pin.tag} (data-slot=${pin.dataSlot})` : pin.tag;
		const context = pin.textSnippet ? ` — context: "${pin.textSnippet}"` : "";
		return `${index + 1}. \`${pin.selector}\` (${where}): ${pin.comment}${context}`;
	});
	return `## Design feedback — ${variantId} (${pins.length} pin${pins.length === 1 ? "" : "s"})\n\n${lines.join("\n")}`;
};
