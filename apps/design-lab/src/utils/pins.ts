import { z } from "zod";
const feedbackPinsSchema = z.array(
	z.object({
		id: z.string(),
		variantId: z.string(),
		selector: z.string(),
		tag: z.string(),
		dataSlot: z.string().nullable(),
		textSnippet: z.string(),
		comment: z.string(),
	}),
);

export type FeedbackPin = z.infer<typeof feedbackPinsSchema>[number];

export type PinnedTarget = Omit<FeedbackPin, "id" | "variantId" | "comment">;

const storageKey = (variantId: string): string => `9bar-design-feedback:${variantId}`;

export const readStoredPins = (variantId: string): Array<FeedbackPin> => {
	if (typeof window === "undefined") {
		return [];
	}
	try {
		const raw = window.localStorage.getItem(storageKey(variantId));
		if (raw === null) {
			return [];
		}
		const parsed = feedbackPinsSchema.safeParse(JSON.parse(raw));
		return parsed.success ? parsed.data : [];
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
	if (pins.length === 0) {
		return `## Design feedback — ${variantId}\n\nNo pins. Looks good.`;
	}
	const lines = pins.map((pin, index) => {
		const where = pin.dataSlot !== null ? `${pin.tag} (data-slot=${pin.dataSlot})` : pin.tag;
		const context = pin.textSnippet ? ` — context: "${pin.textSnippet}"` : "";
		return `${index + 1}. \`${pin.selector}\` (${where}): ${pin.comment}${context}`;
	});
	return `## Design feedback — ${variantId} (${pins.length} pin${pins.length === 1 ? "" : "s"})\n\n${lines.join("\n")}`;
};
