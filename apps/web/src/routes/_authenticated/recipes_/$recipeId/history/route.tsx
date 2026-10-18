import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";
import { Button, Card, CardContent, CardFooter } from "@9bar/toolkit/components";
import { FilterBar, FilterBarActions } from "@9bar/toolkit/components/composed";
import { cn } from "@9bar/toolkit/utils";
import { FilterBarAddTrigger, Pagination } from "../../../../../components";
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

type HistorySearch = { page: number } & HistoryFilterSearchParams;

const RecipeHistory = () => {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { total, pageSize } = Route.useLoaderData();
	const { filters, page, isStale, setFilters, setPage } = useUrlFilterState<HistorySearch>({
		search,
		navigate,
		decode: (current) => ({ q: "", filters: decodeHistoryFilters(current), page: current.page }),
		encode: (intent) => ({ page: intent.page, ...encodeHistoryFilters(intent.filters) }),
	});
	const hasFilters = filters.length > 0;

	return (
		<Card>
			<CardContent className="flex flex-col gap-2">
				<div className="flex flex-wrap items-center justify-end gap-2">
					<FilterBarAddTrigger
						definitions={HISTORY_FILTER_DEFINITIONS}
						filters={filters}
						onFiltersChange={setFilters}
						aria-label="Add history filter"
					/>
				</div>
				{filters.length > 0 && (
					<div className="rounded-md bg-muted/50 px-2.5 py-2">
						<FilterBar
							definitions={HISTORY_FILTER_DEFINITIONS}
							filters={filters}
							onFiltersChange={setFilters}
							aria-label="Active history filters"
						>
							{({ clearAll }) => (
								<FilterBarActions>
									<Button
										variant="ghost"
										size="xs"
										onPress={() => {
											clearAll();
											setPage(1);
										}}
									>
										Clear
									</Button>
								</FilterBarActions>
							)}
						</FilterBar>
					</div>
				)}
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
