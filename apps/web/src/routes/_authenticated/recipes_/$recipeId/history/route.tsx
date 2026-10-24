import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";
import { FilterBarPanel, ListCard, ListResults } from "../../../../../components";
import { useUrlFilterState } from "../../../../../utils/hooks";
import { RecipeHistoryList } from "./-history-list";
import { NoHistoryFound } from "./-no-history-found";
import {
	HISTORY_FILTER_DEFINITIONS,
	HISTORY_FILTER_PARAM_SCHEMA,
	HISTORY_PAGE_SIZE,
	decodeHistoryFilters,
	encodeHistoryFilters,
	listRecipeHistory,
	type HistoryFilterSearchParams,
} from "./-recipe-history-query";

interface HistorySearch extends HistoryFilterSearchParams {
	page: number;
}

const RecipeHistory = () => {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { total, pageSize } = Route.useLoaderData();
	const { filters, page, isStale, setFilters, setPage } = useUrlFilterState<HistorySearch>({
		search,
		navigate,
		decode: (current) => ({ filters: decodeHistoryFilters(current), page: current.page }),
		encode: (intent) => ({ page: intent.page, ...encodeHistoryFilters(intent.filters) }),
	});
	const hasFilters = filters.length > 0;

	return (
		<ListCard
			paginationProps={{
				page,
				pageSize,
				total,
				onPageChange: setPage,
			}}
		>
			<FilterBarPanel
				definitions={HISTORY_FILTER_DEFINITIONS}
				filters={filters}
				onFiltersChange={setFilters}
				label="history"
			/>
			<ListResults
				isBusy={isStale}
				isEmpty={!total}
				emptyState={
					<NoHistoryFound
						hasFilters={hasFilters}
						onClearFilters={() => {
							setFilters([]);
						}}
					/>
				}
			>
				<RecipeHistoryList />
			</ListResults>
		</ListCard>
	);
};

const SEARCH_DEFAULTS = { page: 1 };

const searchSchema = z.object({
	page: z.coerce.number().int().min(1).catch(1).default(1),
	...HISTORY_FILTER_PARAM_SCHEMA,
});

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId/history")({
	validateSearch: searchSchema,
	search: { middlewares: [stripSearchParams(SEARCH_DEFAULTS)] },
	loaderDeps: ({ search }) => search,
	loader: ({ deps, params }) =>
		listRecipeHistory({
			data: {
				recipeId: Number(params.recipeId),
				filters: decodeHistoryFilters(deps),
				page: deps.page,
				pageSize: HISTORY_PAGE_SIZE,
			},
		}),
	component: RecipeHistory,
});
