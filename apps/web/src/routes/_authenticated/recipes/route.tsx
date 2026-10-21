import { createFileRoute, Outlet, stripSearchParams } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { z } from "zod";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	Heading,
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@9bar/toolkit/components";
import { cn } from "@9bar/toolkit/utils";
import { FilterBarPanel, Link } from "../../../components";
import { Pagination } from "../../../components/pagination/pagination";
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

type RecipesSearch = { q: string; page: number } & FilterSearchParams;

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
		<div className="space-y-4">
			<Heading as="h1" variant="title">
				Recipes
			</Heading>
			<Card>
				<CardHeader className="border-b border-b-border pb-6">
					<div className="flex flex-wrap items-center justify-end gap-2">
						<Link variant="ghost" size="sm" to="/recipes/logs/new" search>
							Log a shot
						</Link>
						<Link variant="outline" size="sm" to="/recipes/new">
							<Plus />
							New recipe
						</Link>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
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
					<div
						aria-busy={isStale}
						className={cn("transition-opacity duration-200", isStale && "opacity-60")}
					>
						{!total && <NoRecipesFound hasQuery={hasQuery} onClearQuery={clear} />}
						{!!total && <RecipesList />}
					</div>
				</CardContent>
				<CardFooter className="flex flex-row items-center justify-between border-t border-t-border pt-6">
					<Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
				</CardFooter>
			</Card>
			<Outlet />
		</div>
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
