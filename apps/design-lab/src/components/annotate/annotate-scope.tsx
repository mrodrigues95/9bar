import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Badge, Text } from "@9bar/toolkit/components";
import {
	readStoredPins,
	writeStoredPins,
	type FeedbackPin,
	type PinnedTarget,
} from "../../utils/pins";
import { PinComposer } from "./pin-composer";
import { PinList } from "./pin-list";

type AnnotateScopeProps = {
	variantId: string;
	enabled: boolean;
	children: ReactNode;
};

const HOVER_OUTLINE = "2px solid var(--color-ring, #6366f1)";
const SELECTED_OUTLINE = "2px dashed var(--color-ring, #6366f1)";

const paint = (el: Element, outline: string) => {
	if (el instanceof HTMLElement || el instanceof SVGElement) {
		el.style.outline = outline;
		el.style.outlineOffset = "2px";
	}
};

const unpaint = (el: Element) => {
	if (el instanceof HTMLElement || el instanceof SVGElement) {
		el.style.outline = "";
		el.style.outlineOffset = "";
	}
};

const buildSelector = (el: Element, root: Element): string => {
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

const getTargetInfo = (el: Element, root: Element): PinnedTarget => {
	const rawText = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
	const dataSlot = el.closest("[data-slot]")?.getAttribute("data-slot") ?? null;
	return {
		selector: buildSelector(el, root),
		tag: el.tagName.toLowerCase(),
		dataSlot,
		textSnippet: rawText.slice(0, 120),
	};
};

const inAnnotateUi = (node: EventTarget | null): boolean => {
	return node instanceof Element && node.closest("[data-annotate-ui]") !== null;
};

const findElement = (root: Element, selector: string): Element | null => {
	try {
		return root.querySelector(selector);
	} catch {
		return null;
	}
};

const usePins = (variantId: string) => {
	const [pins, setPins] = useState<Array<FeedbackPin>>(() => readStoredPins(variantId));

	useEffect(() => {
		writeStoredPins(variantId, pins);
	}, [pins, variantId]);

	const addPin = useCallback((pin: FeedbackPin) => {
		setPins((prev) => [...prev, pin]);
	}, []);

	const removePin = useCallback((id: string) => {
		setPins((prev) => prev.filter((pin) => pin.id !== id));
	}, []);

	const clearPins = useCallback(() => {
		setPins([]);
	}, []);

	return { pins, addPin, removePin, clearPins };
};

const useAnnotatePicker = (enabled: boolean) => {
	const [target, setTarget] = useState<PinnedTarget | null>(null);
	const [draft, setDraft] = useState("");
	const rootRef = useRef<HTMLDivElement>(null);
	const hoveredRef = useRef<Element | null>(null);
	const selectedRef = useRef<Element | null>(null);

	const clearSelection = useCallback(() => {
		if (selectedRef.current) {
			unpaint(selectedRef.current);
			selectedRef.current = null;
		}
		setTarget(null);
		setDraft("");
	}, []);

	useEffect(() => {
		if (enabled) {
			return;
		}
		if (hoveredRef.current) {
			unpaint(hoveredRef.current);
			hoveredRef.current = null;
		}
		// oxlint-disable-next-line react/set-state-in-effect
		clearSelection();
	}, [enabled, clearSelection]);

	useEffect(() => {
		if (!enabled || !target) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				clearSelection();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [enabled, target, clearSelection]);

	const highlight = (event: React.MouseEvent | React.FocusEvent) => {
		const candidate = event.target;
		if (!(candidate instanceof Element) || inAnnotateUi(candidate)) {
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
		const candidate = event.target;
		if (!(candidate instanceof Element)) {
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
		const el = event.target;
		if (!(el instanceof Element) || !rootRef.current) {
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
	const { rootRef, previewHandlers, target, draft, setDraft, clearSelection, locatePin } =
		useAnnotatePicker(enabled);
	const { pins, addPin, removePin, clearPins } = usePins(variantId);
	const hintId = useId();

	if (!enabled) {
		return <>{children}</>;
	}

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
