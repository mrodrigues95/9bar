import type { FilterBarFilterState } from "@9bar/toolkit/components/composed";

export interface UrlFilterIntent {
	q: string;
	filters: Array<FilterBarFilterState>;
	page: number;
}

export interface QueryDraft {
	q: string;
	baseKey: string;
}

export const reconcileDraft = (draft: QueryDraft | null, urlKey: string) =>
	draft !== null && draft.baseKey === urlKey ? draft : null;

export const resolveView = (url: UrlFilterIntent, draft: QueryDraft | null) =>
	draft === null ? url : { ...url, q: draft.q, page: 1 };

export const applyDraft = (draft: QueryDraft, current: UrlFilterIntent, currentKey: string) =>
	currentKey === draft.baseKey ? { ...current, q: draft.q, page: 1 } : null;
