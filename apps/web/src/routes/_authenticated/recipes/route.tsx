import { createFileRoute, Outlet, stripSearchParams } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { z } from "zod";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@9bar/toolkit/components";
import { FilterBarPanel, Link, ListCard, ListResults, Page, PageHeader } from "../../../components";
import { useUrlFilterState } from "../../../utils/hooks";
import { NoRecipesFound } from "./-no-recipes-found";
import { RecipesList } from "./-recipes-list";
import {
	decodeFilters,
	encodeFilters,
	FILTER_DEFINITIONS,
	FILTER_PARAM_SCHEMA,
	listRecipes,
	PAGE_SIZE,
	type FilterSearchParams,
} from "./-recipes-query";

interface RecipesSearch extends FilterSearchParams {
	q: string;
	page: number;
}

const Recipes = () => {
	const { total, pageSize } = Route.useLoaderData();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { q, filters, page, isStale, setQuery, setFilters, setPage, clear } =
		useUrlFilterState<RecipesSearch>({
			search,
			navigate,
			decode: (current) => ({
				q: current.q,
				filters: decodeFilters(current),
				page: current.page,
			}),
			encode: (intent) => ({ q: intent.q, page: intent.page, ...encodeFilters(intent.filters) }),
		});
	const hasQuery = !!q.trim() || !!filters.length;

	return (
		<Page>
			<PageHeader
				title="Recipes"
				description="Browse and dial in your espresso recipes, one shot at a time."
			/>
			<ListCard
				actions={
					<>
						<Link variant="ghost" size="sm" to="/recipes/logs/new" search>
							Log a shot
						</Link>
						<Link variant="outline" size="sm" to="/recipes/new">
							<Plus />
							New recipe
						</Link>
					</>
				}
				paginationProps={{
					page,
					pageSize,
					total,
					onPageChange: setPage,
				}}
			>
				<FilterBarPanel
					definitions={FILTER_DEFINITIONS}
					filters={filters}
					onFiltersChange={setFilters}
					label="recipe"
					leading={
						<InputGroup className="w-52 shrink-0">
							<InputGroupAddon>
								<Search className="size-4" />
							</InputGroupAddon>
							<InputGroupInput
								value={q}
								onChange={(event) => {
									setQuery(event.target.value);
								}}
								placeholder="Search name or beans…"
								aria-label="Search recipes by name or beans"
							/>
						</InputGroup>
					}
				/>
				<ListResults
					isBusy={isStale}
					isEmpty={!total}
					emptyState={<NoRecipesFound hasQuery={hasQuery} onClearQuery={clear} />}
				>
					<RecipesList />
				</ListResults>
			</ListCard>
			<Outlet />
		</Page>
	);
};

const SEARCH_DEFAULTS = { q: "", page: 1 };

const searchSchema = z.object({
	q: z.string().catch("").default(""),
	page: z.coerce.number().int().min(1).catch(1).default(1),
	...FILTER_PARAM_SCHEMA,
});

export const Route = createFileRoute("/_authenticated/recipes")({
	staticData: { breadcrumb: { label: "Recipes" } },
	validateSearch: searchSchema,
	search: { middlewares: [stripSearchParams(SEARCH_DEFAULTS)] },
	loaderDeps: ({ search }) => search,
	loader: ({ deps }) =>
		listRecipes({
			data: {
				search: deps.q,
				filters: decodeFilters(deps),
				page: deps.page,
				pageSize: PAGE_SIZE,
			},
		}),
	component: Recipes,
});
