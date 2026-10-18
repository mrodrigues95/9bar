import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { FilterBarFilterState } from "@9bar/toolkit/components/composed";
import { useDebouncedValue } from "./use-debounced-value";

export interface UrlFilterIntent {
	q: string;
	filters: Array<FilterBarFilterState>;
	page: number;
}

interface VersionedIntent extends UrlFilterIntent {
	version: number;
	replace: boolean;
}

interface UseUrlFilterStateOptions<TSearch> {
	search: TSearch;
	navigate: (options: { search: (prev: TSearch) => TSearch; replace?: boolean }) => void;
	decode: (search: TSearch) => UrlFilterIntent;
	encode: (intent: UrlFilterIntent) => Partial<TSearch>;
	debounceMs?: number;
}

const withVersion = (intent: UrlFilterIntent, version: number, replace: boolean) => {
	return { ...intent, version, replace };
};

const intentKey = <TSearch>(
	encode: (intent: UrlFilterIntent) => Partial<TSearch>,
	value: UrlFilterIntent,
) => {
	return JSON.stringify(encode(value));
};

/**
 * Syncs debounced query/filter/page state with the route's URL search params.
 * Typing/search input updates replace the URL; filter and page updates push entries.
 * Back/forward navigation and hand-edited URLs are adopted over pending intents.
 */
export const useUrlFilterState = <TSearch>(options: UseUrlFilterStateOptions<TSearch>) => {
	const { search, navigate, decode, encode, debounceMs = 250 } = options;
	const isRouteLoading = useRouterState({ select: (state) => state.isLoading });
	const [intent, setIntent] = useState(() => withVersion(decode(search), 0, true));
	const debouncedIntent = useDebouncedValue(intent, debounceMs);

	const urlIntent = decode(search);
	const urlKey = intentKey(encode, urlIntent);

	const lastWrittenKeyRef = useRef(urlKey);
	const lastUrlKeyRef = useRef(urlKey);

	useEffect(() => {
		const isNewUrl = urlKey !== lastUrlKeyRef.current;
		lastUrlKeyRef.current = urlKey;

		// Back/forward, a link, or a hand-edited URL: adopt it and drop a pending intent instead of
		// writing back over the user's navigation. The version bump makes the drop stick.
		if (isNewUrl && urlKey !== lastWrittenKeyRef.current) {
			lastWrittenKeyRef.current = urlKey;
			setIntent((prev) =>
				intentKey(encode, prev) === urlKey
					? prev
					: { ...urlIntent, version: prev.version + 1, replace: true },
			);
			return;
		}

		const debouncedKey = intentKey(encode, debouncedIntent);
		if (debouncedKey === urlKey || debouncedIntent.version !== intent.version) {
			return;
		}

		navigate({
			search: (prev) => ({ ...prev, ...encode(debouncedIntent) }),
			replace: debouncedIntent.replace,
		});
		lastWrittenKeyRef.current = debouncedKey;
	}, [urlKey, urlIntent, debouncedIntent, intent.version, navigate, decode, encode]);

	const updateIntent = (patch: Partial<Omit<VersionedIntent, "version">>) => {
		setIntent((prev) => ({ ...prev, ...patch, version: prev.version + 1 }));
	};

	return {
		q: intent.q,
		filters: intent.filters,
		page: intent.page,
		isStale: isRouteLoading || intentKey(encode, intent) !== urlKey,
		setQuery: (q: string) => {
			updateIntent({ q, page: 1, replace: true });
		},
		setFilters: (filters: Array<FilterBarFilterState>) => {
			updateIntent({ filters, page: 1, replace: false });
		},
		setPage: (page: number) => {
			updateIntent({ page, replace: false });
		},
		clear: () => {
			updateIntent({ q: "", filters: [], page: 1, replace: false });
		},
	};
};
