import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";
import { Card, CardContent, CardFooter } from "@9bar/toolkit/components";
import { cn } from "@9bar/toolkit/utils";
import { FilterBarPanel, Pagination } from "../../../../../components";
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
		<Card>
			<CardContent className="flex flex-col gap-2">
				<FilterBarPanel
					definitions={HISTORY_FILTER_DEFINITIONS}
					filters={filters}
					onFiltersChange={setFilters}
					label="history"
				/>
				<div
					aria-busy={isStale}
					className={cn("transition-opacity duration-200", isStale && "opacity-60")}
				>
					{!total && (
						<NoHistoryFound
							hasFilters={hasFilters}
							onClearFilters={() => {
								setFilters([]);
							}}
						/>
					)}
					{!!total && <RecipeHistoryList />}
				</div>
			</CardContent>
			<CardFooter className="flex flex-row items-center justify-between border-t border-t-border pt-6">
				<Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
			</CardFooter>
		</Card>
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
