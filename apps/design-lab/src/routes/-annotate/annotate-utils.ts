/** A single piece of pinned feedback on a design variant. */
export type FeedbackPin = {
	/** Stable id (`pin-<timestamp>-<random>`). */
	id: string;
	/** Id of the variant this pin belongs to. */
	variantId: string;
	/** CSS selector locating the element, relative to the variant root. */
	selector: string;
	/** Lowercase tag name of the pinned element. */
	tag: string;
	/** Nearest `data-slot` value, when the element (or an ancestor) has one. */
	dataSlot: string | null;
	/** First ~120 chars of the element's text, for context. */
	textSnippet: string;
	/** First ~300 chars of the element's HTML, for context. */
	htmlSnippet: string;
	/** The reviewer's comment. */
	comment: string;
	/** Page URL where the pin was created. */
	url: string;
	/** Viewport (`<width>x<height>`) where the pin was created. */
	viewport: string;
	/** ISO timestamp of creation. */
	createdAt: string;
};

/** Element info captured at click time, before the reviewer writes a comment. */
export type PinnedTarget = {
	selector: string;
	tag: string;
	dataSlot: string | null;
	textSnippet: string;
	htmlSnippet: string;
};

/** localStorage key holding a variant's pins. */
export const storageKey = (variantId: string): string => {
	return `9bar-design-feedback:${variantId}`;
};

/**
 * Read a variant's pins from localStorage. Keys are byte-identical with the
 * old in-web Design Lab, so pins captured before the move survive it.
 */
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

/**
 * Build a readable CSS selector for `el`, scoped to `root`.
 * Prefers `#id` and `data-slot` anchors, falls back to `nth-of-type`.
 */
export const buildSelector = (el: Element, root: Element): string => {
	const parts: Array<string> = [];
	let node: Element | null = el;
	while (node && node !== root && parts.length < 6) {
		const id = node.getAttribute("id");
		if (id) {
			parts.unshift(`#${CSS.escape(id)}`);
			break;
		}
		const tag = node.tagName.toLowerCase();
		const slot = node.getAttribute("data-slot");
		if (slot) {
			parts.unshift(`${tag}[data-slot="${slot}"]`);
		} else {
			const parent = node.parentElement;
			if (!parent) {
				parts.unshift(tag);
				break;
			}
			const sameTag = Array.from(parent.children).filter(
				(sibling) => sibling.tagName === node?.tagName,
			);
			if (sameTag.length > 1) {
				parts.unshift(`${tag}:nth-of-type(${sameTag.indexOf(node) + 1})`);
			} else {
				parts.unshift(tag);
			}
		}
		node = node.parentElement;
	}
	return parts.length > 0 ? parts.join(" > ") : el.tagName.toLowerCase();
};

/** Capture the identifying info for a clicked element. */
export const getTargetInfo = (el: Element, root: Element): PinnedTarget => {
	const rawText = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
	const dataSlot = el.closest("[data-slot]")?.getAttribute("data-slot") ?? null;
	return {
		selector: buildSelector(el, root),
		tag: el.tagName.toLowerCase(),
		dataSlot,
		textSnippet: rawText.slice(0, 120),
		htmlSnippet: el.outerHTML.slice(0, 300),
	};
};

/** Serialize pins as pretty JSON for export. */
export const pinsToJson = (pins: Array<FeedbackPin>): string => {
	return JSON.stringify(pins, null, 2);
};

/**
 * Serialize pins as Markdown, ready to paste back to the agent:
 * each pin carries its selector plus the comment, so the agent can
 * locate the exact element without a screenshot.
 */
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

/**
 * Serialize two variants' pins as one Markdown block for the compare view,
 * so a single paste carries the whole A-vs-B comparison back to the agent.
 * Reads from localStorage — the annotate scopes persist every saved pin,
 * so stored pins are always fresh at copy time.
 */
export const pinsToCombinedMarkdown = (variantIds: Array<string>): string => {
	const blocks = variantIds.map((variantId) => {
		return pinsToMarkdown(variantId, readStoredPins(variantId));
	});
	return blocks.join("\n\n---\n\n");
};
