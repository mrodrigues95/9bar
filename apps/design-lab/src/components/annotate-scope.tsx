import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	Heading,
	Text,
} from "@9bar/toolkit/components";
import {
	pinsToMarkdown,
	readStoredPins,
	writeStoredPins,
	type FeedbackPin,
} from "../utils/annotate";

type PinnedTarget = Omit<FeedbackPin, "id" | "variantId" | "comment">;

type AnnotateScopeProps = {
	variantId: string;
	enabled: boolean;
	children: ReactNode;
};

const HOVER_OUTLINE = "2px solid var(--color-ring, #6366f1)";
const SELECTED_OUTLINE = "2px dashed var(--color-ring, #6366f1)";

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

export const AnnotateScope = ({ variantId, enabled, children }: AnnotateScopeProps) => {
	const [pins, setPins] = useState<Array<FeedbackPin>>(() => readStoredPins(variantId));
	const [target, setTarget] = useState<PinnedTarget | null>(null);
	const [draft, setDraft] = useState("");
	const [copied, setCopied] = useState(false);
	const hintId = useId();
	const rootRef = useRef<HTMLDivElement>(null);
	const composerRef = useRef<HTMLTextAreaElement>(null);
	const hoveredRef = useRef<Element | null>(null);
	const selectedRef = useRef<Element | null>(null);

	useEffect(() => {
		writeStoredPins(variantId, pins);
	}, [pins, variantId]);

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

	const clearSelection = () => {
		if (selectedRef.current) {
			unpaint(selectedRef.current);
			selectedRef.current = null;
		}
		setTarget(null);
		setDraft("");
	};

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
	}, [enabled, target]);

	useEffect(() => {
		if (target) {
			composerRef.current?.focus();
		}
	}, [target]);

	useEffect(() => {
		if (!enabled) {
			if (hoveredRef.current) {
				unpaint(hoveredRef.current);
				hoveredRef.current = null;
			}
			// oxlint-disable-next-line react/set-state-in-effect
			clearSelection();
		}
	}, [enabled]);

	if (!enabled) {
		return <>{children}</>;
	}

	const isUi = (node: EventTarget | null): boolean => {
		return node instanceof Element && node.closest("[data-annotate-ui]") !== null;
	};

	const highlight = (event: React.MouseEvent | React.FocusEvent) => {
		const candidate = event.target;
		if (!(candidate instanceof Element) || isUi(candidate)) {
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

	const handleClick = (event: React.MouseEvent) => {
		if (isUi(event.target)) {
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
		setCopied(false);
	};

	const savePin = () => {
		const comment = draft.trim();
		if (!target || !comment) {
			return;
		}
		const pin: FeedbackPin = {
			...target,
			id: `pin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
			variantId,
			comment,
		};
		setPins((prev) => [...prev, pin]);
		clearSelection();
	};

	const deletePin = (id: string) => {
		setPins((prev) => prev.filter((pin) => pin.id !== id));
	};

	const locatePin = (pin: FeedbackPin) => {
		const root = rootRef.current;
		if (!root) {
			return;
		}
		let el: Element | null = null;
		try {
			el = root.querySelector(pin.selector);
		} catch {
			el = null;
		}
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "center" });
			paint(el, SELECTED_OUTLINE);
			window.setTimeout(() => {
				if (el && el !== selectedRef.current) {
					unpaint(el);
				}
			}, 1600);
		}
	};

	const copyMarkdown = () => {
		const text = pinsToMarkdown(variantId, pins);
		const done = () => {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		};
		if (navigator.clipboard?.writeText) {
			navigator.clipboard.writeText(text).then(done).catch(done);
		}
	};

	return (
		<div>
			<section aria-label="Annotatable preview" aria-describedby={hintId}>
				<div
					ref={rootRef}
					onMouseOver={highlight}
					onMouseOut={unhighlight}
					onFocus={highlight}
					onBlur={unhighlight}
					onClickCapture={handleClick}
					className="cursor-crosshair rounded-lg"
				>
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
					<Card>
						<CardHeader>
							<Heading as="h2" variant="subsection">
								New pin
							</Heading>
							<Text variant="body-sm">
								{target.tag}
								{target.dataSlot !== null && ` · data-slot=${target.dataSlot}`}
							</Text>
						</CardHeader>
						<CardContent className="space-y-3">
							<code className="block overflow-x-auto rounded-md bg-muted px-2 py-1.5 font-mono text-xs">
								{target.selector}
							</code>
							{target.textSnippet && <Text variant="body-sm">“{target.textSnippet}”</Text>}
							<label className="block space-y-1">
								<span className="text-sm font-medium">What should change here?</span>
								<textarea
									ref={composerRef}
									rows={3}
									value={draft}
									onChange={(event) => setDraft(event.target.value)}
									placeholder="e.g. Make this headline bigger and left-align it like variant B"
									className="w-full rounded-md border border-border bg-white px-2.5 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
								/>
							</label>
							<div className="flex flex-wrap gap-2">
								<Button size="sm" onPress={savePin} isDisabled={draft.trim().length === 0}>
									Save pin
								</Button>
								<Button size="sm" variant="ghost" onPress={clearSelection}>
									Cancel (Esc)
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{pins.length > 0 && (
					<Card>
						<CardHeader>
							<Heading as="h2" variant="subsection">
								Pins ({pins.length})
							</Heading>
							<Text variant="body-sm">
								Stored in this browser per variant. Copy them back to the agent to iterate.
							</Text>
						</CardHeader>
						<CardContent className="space-y-3">
							<ol className="space-y-2">
								{pins.map((pin) => {
									return (
										<li
											key={pin.id}
											className="flex flex-wrap items-start justify-between gap-2 rounded-md border border-border px-3 py-2"
										>
											<div className="min-w-0 flex-1">
												<Text variant="body-sm" className="font-medium">
													{pin.comment}
												</Text>
												<code className="mt-1 block truncate font-mono text-xs text-muted-foreground">
													{pin.selector}
												</code>
											</div>
											<div className="flex gap-1">
												<Button size="xs" variant="ghost" onPress={() => locatePin(pin)}>
													Locate
												</Button>
												<Button size="xs" variant="ghost" onPress={() => deletePin(pin.id)}>
													Delete
												</Button>
											</div>
										</li>
									);
								})}
							</ol>
							<div className="flex flex-wrap gap-2">
								<Button size="sm" variant="outline" onPress={copyMarkdown}>
									{copied ? "Copied!" : "Copy for agent"}
								</Button>
								<Button size="sm" variant="ghost" onPress={() => setPins([])}>
									Clear all
								</Button>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};
