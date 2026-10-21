import { createFileRoute, Outlet, stripSearchParams } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { z } from "zod";
import { Card, CardContent, CardFooter, CardHeader } from "@9bar/toolkit/components";
import { cn } from "@9bar/toolkit/utils";
import { FilterBarPanel, Link, Pagination } from "../../../../../components";
import { useUrlFilterState } from "../../../../../utils/hooks";
import { RecipeLogsList } from "./-logs-list";
import { NoLogsFound } from "./-no-logs-found";
import {
	LOG_FILTER_DEFINITIONS,
	LOG_FILTER_PARAM_SCHEMA,
	LOGS_PAGE_SIZE,
	decodeLogFilters,
	encodeLogFilters,
	listRecipeLogs,
	type LogFilterSearchParams,
} from "./-recipe-logs-query";

type LogsSearch = { page: number } & LogFilterSearchParams;

const RecipeLogs = () => {
	const { recipeId } = Route.useParams();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { total, pageSize } = Route.useLoaderData();
	const { filters, page, isStale, setFilters, setPage } = useUrlFilterState<LogsSearch>({
		search,
		navigate,
		decode: (current) => ({ filters: decodeLogFilters(current), page: current.page }),
		encode: (intent) => ({ page: intent.page, ...encodeLogFilters(intent.filters) }),
	});
	const hasFilters = filters.length > 0;

	return (
		<>
			<Card>
				<CardHeader className="border-b border-b-border pb-6">
					<div className="flex flex-wrap items-center justify-end gap-2">
						<Link
							to="/recipes/$recipeId/logs/new"
							params={{ recipeId }}
							variant="outline"
							size="sm"
						>
							<Plus />
							New Log
						</Link>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					<FilterBarPanel
						definitions={LOG_FILTER_DEFINITIONS}
						filters={filters}
						onFiltersChange={setFilters}
						label="log"
					/>
					<div
						aria-busy={isStale}
						className={cn("transition-opacity duration-200", isStale && "opacity-60")}
					>
						{!total && (
							<NoLogsFound
								hasFilters={hasFilters}
								onClearFilters={() => {
									setFilters([]);
								}}
								recipeId={recipeId}
							/>
						)}
						{!!total && <RecipeLogsList />}
					</div>
				</CardContent>
				<CardFooter className="flex flex-row items-center justify-between border-t border-t-border pt-6">
					<Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
				</CardFooter>
			</Card>
			<Outlet />
		</>
	);
};

const SEARCH_DEFAULTS = { page: 1 };

const searchSchema = z.object({
	page: z.coerce.number().int().min(1).catch(1).default(1),
	...LOG_FILTER_PARAM_SCHEMA,
});

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId/logs")({
	validateSearch: searchSchema,
	search: { middlewares: [stripSearchParams(SEARCH_DEFAULTS)] },
	loaderDeps: ({ search }) => search,
	loader: ({ deps, params }) =>
		listRecipeLogs({
			data: {
				recipeId: Number(params.recipeId),
				filters: decodeLogFilters(deps),
				page: deps.page,
				pageSize: LOGS_PAGE_SIZE,
			},
		}),
	component: RecipeLogs,
});
