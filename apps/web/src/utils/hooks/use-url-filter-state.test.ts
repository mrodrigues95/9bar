import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
	applyChange,
	applyDraft,
	reconcileDraft,
	resolveView,
	settleDraft,
} from "./use-url-filter-state";
import type { QueryDraft, UrlFilterChange, UrlFilterIntent } from "./use-url-filter-state";

type UserEvent =
	| { type: "type"; q: string }
	| { type: "flush" }
	| { type: "back" }
	| { type: "forward" }
	| UrlFilterChange;

const keyOf = (intent: UrlFilterIntent) => JSON.stringify(intent);

const createSession = () => {
	const history: Array<UrlFilterIntent> = [{ q: "", filters: [], page: 1 }];
	let index = 0;
	let stored: QueryDraft | null = null;
	let pending: QueryDraft | null = null;

	const url = () => history[index] ?? { q: "", filters: [], page: 1 };
	const render = () => {
		stored = reconcileDraft(stored, keyOf(url()));
		return { url: url(), view: resolveView(url(), stored), draft: stored };
	};

	const dispatch = (event: UserEvent) => {
		const { view } = render();
		switch (event.type) {
			case "type": {
				const draft = { q: event.q, baseKey: keyOf(url()) };
				stored = draft;
				pending = draft;
				break;
			}
			case "flush": {
				if (pending === null) {
					break;
				}
				const next = applyDraft(pending, url(), keyOf(url()));
				if (next !== null) {
					history[index] = next;
				}
				stored = settleDraft(stored, pending);
				pending = null;
				break;
			}
			case "back":
				index = Math.max(0, index - 1);
				break;
			case "forward":
				index = Math.min(history.length - 1, index + 1);
				break;
			case "filters":
			case "page":
			case "clear":
				history.splice(index + 1, history.length, applyChange(view, event));
				index += 1;
		}
		return render();
	};

	return { dispatch, render };
};

const filterArb = fc.record({
	filterId: fc.constantFrom("method", "verdict"),
	operatorId: fc.constantFrom("is", "is-not"),
	values: fc.uniqueArray(fc.constantFrom("a", "b", "c"), { minLength: 1 }),
});

const eventArb: fc.Arbitrary<UserEvent> = fc.oneof(
	fc.record({ type: fc.constant("type"), q: fc.string({ maxLength: 3 }) }),
	fc.constant({ type: "flush" }),
	fc.constant({ type: "back" }),
	fc.constant({ type: "forward" }),
	fc.record({ type: fc.constant("filters"), filters: fc.array(filterArb, { maxLength: 2 }) }),
	fc.record({ type: fc.constant("page"), page: fc.integer({ min: 1, max: 5 }) }),
	fc.constant({ type: "clear" }),
);

describe("url filter draft", () => {
	it("shows typed text immediately and resets to the first page", () => {
		fc.assert(
			fc.property(fc.array(eventArb), fc.string(), (events, q) => {
				const session = createSession();
				events.forEach((event) => session.dispatch(event));
				const { view, url } = session.dispatch({ type: "type", q });
				expect(view).toEqual({ ...url, q, page: 1 });
			}),
		);
	});

	it("writes the last typed text to the URL once the debounce settles", () => {
		fc.assert(
			fc.property(fc.array(eventArb), fc.array(fc.string(), { minLength: 1 }), (events, typed) => {
				const session = createSession();
				events.forEach((event) => session.dispatch(event));
				const before = session.render().url;
				typed.forEach((q) => session.dispatch({ type: "type", q }));
				const { url } = session.dispatch({ type: "flush" });
				expect(url).toEqual({ ...before, q: typed.at(-1), page: 1 });
			}),
		);
	});

	it("leaves no draft behind once the debounce settles", () => {
		fc.assert(
			fc.property(fc.array(eventArb), (events) => {
				const session = createSession();
				events.forEach((event) => session.dispatch(event));
				const { view, url, draft } = session.dispatch({ type: "flush" });
				expect(draft).toBeNull();
				expect(view).toEqual(url);
			}),
		);
	});

	it("lets back and forward win over pending text", () => {
		fc.assert(
			fc.property(
				fc.array(eventArb),
				fc.string(),
				fc.constantFrom<UserEvent>({ type: "back" }, { type: "forward" }),
				(events, q, move) => {
					const session = createSession();
					events.forEach((event) => session.dispatch(event));
					const before = session.render().url;
					session.dispatch({ type: "type", q });
					const moved = session.dispatch(move).url;
					fc.pre(keyOf(moved) !== keyOf(before));
					const { url, view } = session.dispatch({ type: "flush" });
					expect(url).toEqual(moved);
					expect(view).toEqual(moved);
				},
			),
		);
	});

	it("carries pending text into a filter or page change", () => {
		fc.assert(
			fc.property(
				fc.array(eventArb),
				fc.string(),
				eventArb.filter((event) => event.type === "filters" || event.type === "page"),
				(events, q, change) => {
					const session = createSession();
					events.forEach((event) => session.dispatch(event));
					session.dispatch({ type: "type", q });
					const { url } = session.dispatch(change);
					expect(url.q).toBe(q);
				},
			),
		);
	});
});
