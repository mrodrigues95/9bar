import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Badge, Text } from "@9bar/toolkit/components";
import { readStoredPins, writeStoredPins } from "../../utils/pins";
import type { FeedbackPin, PinnedTarget } from "../../utils/pins";
import { PinComposer } from "./pin-composer";
import { PinList } from "./pin-list";

type AnnotateScopeProps = {
	variantId: string;
	enabled: boolean;
	children: ReactNode;
};

const HOVER_OUTLINE = "2px solid var(--color-ring, #6366f1)";
const SELECTED_OUTLINE = "2px dashed var(--color-ring, #6366f1)";

const toElement = (node: EventTarget | null) =>
	// oxlint-disable-next-line @nkzw/no-instanceof -- DOM event targets are typed EventTarget, and instanceof is the narrowing the DOM provides.
	node instanceof Element ? node : null;

const toStyledElement = (el: Element) =>
	// oxlint-disable-next-line @nkzw/no-instanceof -- only HTML and SVG elements carry an inline style declaration.
	el instanceof HTMLElement || el instanceof SVGElement ? el : null;

const paint = (el: Element, outline: string) => {
	const styled = toStyledElement(el);
	if (styled) {
		styled.style.outline = outline;
		styled.style.outlineOffset = "2px";
	}
};

const unpaint = (el: Element) => {
	const styled = toStyledElement(el);
	if (styled) {
		styled.style.outline = "";
		styled.style.outlineOffset = "";
	}
};

const buildSelector = (el: Element, root: Element) => {
	const parts: Array<string> = [];
	let node: Element | null = el;
	while (node && node !== root && parts.length < 6) {
		const id = node.getAttribute("id");
		if (id !== null && id !== "") {
			parts.unshift(`#${CSS.escape(id)}`);
			break;
		}
		const tag = node.tagName.toLowerCase();
		const slot = node.getAttribute("data-slot");
		if (slot !== null && slot !== "") {
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

const getTargetInfo = (el: Element, root: Element) => {
	const rawText = el.textContent.replaceAll(/\s+/g, " ").trim();
	const dataSlot = el.closest("[data-slot]")?.getAttribute("data-slot") ?? null;
	return {
		selector: buildSelector(el, root),
		tag: el.tagName.toLowerCase(),
		dataSlot,
		textSnippet: rawText.slice(0, 120),
	};
};

const inAnnotateUi = (node: EventTarget | null) =>
	(toElement(node)?.closest("[data-annotate-ui]") ?? null) !== null;

const findElement = (root: Element, selector: string) => {
	try {
		return root.querySelector(selector);
	} catch {
		return null;
	}
};

const usePins = (variantId: string) => {
	const [pins, setPins] = useState<Array<FeedbackPin>>(() => readStoredPins(variantId));

	const save = (next: Array<FeedbackPin>) => {
		setPins(next);
		writeStoredPins(variantId, next);
	};

	return {
		pins,
		addPin: (pin: FeedbackPin) => save([...pins, pin]),
		removePin: (id: string) => save(pins.filter((pin) => pin.id !== id)),
		clearPins: () => save([]),
	};
};

const useAnnotatePicker = () => {
	const [target, setTarget] = useState<PinnedTarget | null>(null);
	const [draft, setDraft] = useState("");
	const rootRef = useRef<HTMLDivElement>(null);
	const hoveredRef = useRef<Element | null>(null);
	const selectedRef = useRef<Element | null>(null);

	const clearSelection = () => {
		if (selectedRef.current) {
			unpaint(selectedRef.current);
			selectedRef.current = null;
		}
		setTarget(null);
		setDraft("");
	};

	const highlight = (event: React.MouseEvent | React.FocusEvent) => {
		const candidate = toElement(event.target);
		if (!candidate || inAnnotateUi(candidate)) {
			return;
		}
		if (candidate === hoveredRef.current || candidate === selectedRef.current) {
			return;
		}
		if (hoveredRef.current && hoveredRef.current !== selectedRef.current) {
			unpaint(hoveredRef.current);
		}
		hoveredRef.current = candidate;
		paint(candidate, HOVER_OUTLINE);
	};

	const unhighlight = (event: React.MouseEvent | React.FocusEvent) => {
		const candidate = toElement(event.target);
		if (!candidate) {
			return;
		}
		if (candidate === hoveredRef.current && candidate !== selectedRef.current) {
			unpaint(candidate);
			hoveredRef.current = null;
		}
	};

	const select = (event: React.MouseEvent) => {
		if (inAnnotateUi(event.target)) {
			return;
		}
		event.preventDefault();
		event.stopPropagation();
		const el = toElement(event.target);
		if (!el || !rootRef.current) {
			return;
		}
		if (selectedRef.current) {
			unpaint(selectedRef.current);
		}
		if (hoveredRef.current && hoveredRef.current !== el) {
			unpaint(hoveredRef.current);
			hoveredRef.current = null;
		}
		selectedRef.current = el;
		paint(el, SELECTED_OUTLINE);
		setTarget(getTargetInfo(el, rootRef.current));
		setDraft("");
	};

	const locatePin = (pin: FeedbackPin) => {
		const root = rootRef.current;
		if (!root) {
			return;
		}
		const el = findElement(root, pin.selector);
		if (!el) {
			return;
		}
		el.scrollIntoView({ behavior: "smooth", block: "center" });
		paint(el, SELECTED_OUTLINE);
		window.setTimeout(() => {
			if (el !== selectedRef.current) {
				unpaint(el);
			}
		}, 1600);
	};

	const previewHandlers = {
		onMouseOver: highlight,
		onMouseOut: unhighlight,
		onFocus: highlight,
		onBlur: unhighlight,
		onClickCapture: select,
	};

	return { rootRef, previewHandlers, target, draft, setDraft, clearSelection, locatePin };
};

export const AnnotateScope = ({ variantId, enabled, children }: AnnotateScopeProps) => {
	if (!enabled) {
		return <>{children}</>;
	}
	return <AnnotateSession variantId={variantId}>{children}</AnnotateSession>;
};

const AnnotateSession = ({ variantId, children }: Omit<AnnotateScopeProps, "enabled">) => {
	const { rootRef, previewHandlers, target, draft, setDraft, clearSelection, locatePin } =
		useAnnotatePicker();
	const { pins, addPin, removePin, clearPins } = usePins(variantId);
	const hintId = useId();

	const savePin = () => {
		const comment = draft.trim();
		if (!target || !comment) {
			return;
		}
		addPin({
			...target,
			id: `pin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
			variantId,
			comment,
		});
		clearSelection();
	};

	return (
		<div>
			<section aria-label="Annotatable preview" aria-describedby={hintId}>
				<div ref={rootRef} {...previewHandlers} className="cursor-crosshair rounded-lg">
					{children}
				</div>
			</section>

			<div data-annotate-ui className="mt-4 space-y-3">
				<div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-border bg-muted/50 px-3 py-2">
					<Badge variant="secondary">Annotate on</Badge>
					<Text as="span" variant="body-sm" id={hintId}>
						Click any element in the preview to pin feedback. Links are paused while annotating.
					</Text>
				</div>

				<output className="block">
					{pins.length > 0 && (
						<Text as="span" variant="body-sm">
							{pins.length} pin{pins.length === 1 ? "" : "s"} on this variant.
						</Text>
					)}
				</output>

				{target && (
					<PinComposer
						target={target}
						draft={draft}
						onDraftChange={setDraft}
						onSave={savePin}
						onCancel={clearSelection}
					/>
				)}

				{pins.length > 0 && (
					<PinList
						variantId={variantId}
						pins={pins}
						onLocate={locatePin}
						onDelete={removePin}
						onClear={clearPins}
					/>
				)}
			</div>
		</div>
	);
};
