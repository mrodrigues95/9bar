import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import type { FilterBarFilterState } from "@9bar/toolkit/components/composed";
import {
	applyChange,
	applyDraft,
	type QueryDraft,
	reconcileDraft,
	resolveView,
	settleDraft,
	type UrlFilterChange,
	type UrlFilterIntent,
} from "./url-filter-draft";

interface DecodedUrlFilters {
	q?: string;
	filters: Array<FilterBarFilterState>;
	page: number;
}

interface UseUrlFilterStateOptions<TSearch> {
	search: TSearch;
	navigate: (options: { search: (prev: TSearch) => TSearch; replace?: boolean }) => Promise<void>;
	decode: (search: TSearch) => DecodedUrlFilters;
	encode: (intent: UrlFilterIntent) => Partial<TSearch>;
	debounceMs?: number;
}

export const useUrlFilterState = <TSearch>(options: UseUrlFilterStateOptions<TSearch>) => {
	const { search, navigate, decode, encode, debounceMs = 250 } = options;
	const isRouteLoading = useRouterState({ select: (state) => state.isLoading });

	const read = (value: TSearch) => {
		const decoded = decode(value);
		return { q: decoded.q ?? "", filters: decoded.filters, page: decoded.page };
	};
	const keyOf = (intent: UrlFilterIntent) => JSON.stringify(encode(intent));

	const url = read(search);
	const urlKey = keyOf(url);
	const [storedDraft, setDraft] = useState<QueryDraft | null>(null);
	const draft = reconcileDraft(storedDraft, urlKey);
	if (draft !== storedDraft) {
		setDraft(draft);
	}
	const view = resolveView(url, draft);

	const write = (change: UrlFilterChange) =>
		void navigate({ search: (prev) => ({ ...prev, ...encode(applyChange(view, change)) }) });

	const writeDraft = useDebouncedCallback(
		(pending: QueryDraft) =>
			void navigate({
				search: (prev) => {
					const current = read(prev);
					const next = applyDraft(pending, current, keyOf(current));
					return next === null ? prev : { ...prev, ...encode(next) };
				},
				replace: true,
			}).then(() => setDraft((current) => settleDraft(current, pending))),
		{ wait: debounceMs },
	);

	return {
		q: view.q,
		filters: view.filters,
		page: view.page,
		isStale: isRouteLoading || draft !== null,
		setQuery: (q: string) => {
			const next = { q, baseKey: urlKey };
			setDraft(next);
			writeDraft(next);
		},
		setFilters: (filters: Array<FilterBarFilterState>) => write({ type: "filters", filters }),
		setPage: (page: number) => write({ type: "page", page }),
		clear: () => write({ type: "clear" }),
	};
};
