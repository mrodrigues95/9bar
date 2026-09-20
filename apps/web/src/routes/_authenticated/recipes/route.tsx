import { createFileRoute, stripSearchParams, useNavigate } from "@tanstack/react-router";
import { Plus, Search, SearchX } from "lucide-react";
import { z } from "zod";
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	Heading,
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@9bar/toolkit/components";
import {
	FilterBar,
	FilterBarActions,
	type FilterBarFilterState,
} from "@9bar/toolkit/components/composed";
import { Link } from "../../../components";
import { Pagination } from "../../../components/pagination/pagination";
import { FilterAddTrigger } from "./-filter-add-trigger";
import { RecipesList } from "./-recipes-list";
import {
	decodeFilters,
	encodeFilters,
	FILTER_DEFINITIONS,
	FILTER_PARAM_SCHEMA,
	listRecipes,
	PAGE_SIZE,
} from "./-recipes-query";

/** Search params stripped back out of the URL when they still hold their default. */
const SEARCH_DEFAULTS = { q: "", page: 1 };

const searchSchema = z.object({
	q: z.string().catch("").default(""),
	page: z.coerce.number().int().min(1).catch(1).default(1),
	...FILTER_PARAM_SCHEMA,
});

const Recipes = () => {
	const search = Route.useSearch();
	const { items, total, page, pageSize } = Route.useLoaderData();
	const navigate = useNavigate({ from: Route.fullPath });
	const filters = decodeFilters(search);
	const hasQuery = !!search.q.trim() || filters.length > 0;

	const onSearchChange = (nextQuery: string) => {
		navigate({ search: (prev) => ({ ...prev, q: nextQuery, page: 1 }), replace: true });
	};

	const onFiltersChange = (nextFilters: Array<FilterBarFilterState>) => {
		navigate({ search: (prev) => ({ ...prev, ...encodeFilters(nextFilters), page: 1 }) });
	};

	const onClearQuery = () => {
		navigate({ search: { q: "", page: 1 } });
	};

	const onPageChange = (nextPage: number) => {
		navigate({ search: (prev) => ({ ...prev, page: nextPage }) });
	};

	return (
		<div className="space-y-4">
			<Heading as="h1" variant="title">
				Recipes
			</Heading>
			<Card>
				<CardHeader className="border-b border-b-border pb-6">
					<div className="flex flex-wrap items-center justify-end gap-2">
						<Link variant="outline" size="sm" to="/recipes/new">
							<Plus aria-hidden="true" />
							New recipe
						</Link>
					</div>
					<div className="flex flex-wrap items-center justify-end gap-2">
						<InputGroup className="w-52 shrink-0">
							<InputGroupAddon>
								<Search className="size-4" aria-hidden="true" />
							</InputGroupAddon>
							<InputGroupInput
								value={search.q}
								onChange={(event) => onSearchChange(event.target.value)}
								placeholder="Search recipes…"
								aria-label="Search recipes"
							/>
						</InputGroup>
						<FilterAddTrigger
							definitions={FILTER_DEFINITIONS}
							filters={filters}
							onFiltersChange={onFiltersChange}
							aria-label="Add recipe filter"
						/>
					</div>
					{filters.length > 0 && (
						<div className="rounded-md bg-muted/50 px-2.5 py-2">
							<FilterBar
								definitions={FILTER_DEFINITIONS}
								filters={filters}
								onFiltersChange={onFiltersChange}
								aria-label="Active recipe filters"
							>
								{({ clearAll }) => (
									<FilterBarActions>
										<Button variant="ghost" size="xs" onPress={clearAll}>
											Clear
										</Button>
									</FilterBarActions>
								)}
							</FilterBar>
						</div>
					)}
				</CardHeader>
				<CardContent>
					{total === 0 ? (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<SearchX aria-hidden="true" />
								</EmptyMedia>
								<EmptyTitle>{hasQuery ? "No recipes match" : "No recipes yet"}</EmptyTitle>
								<EmptyDescription>
									{hasQuery
										? "Try a different search, or clear the active filters."
										: "Create your first recipe to start dialling in shots."}
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								{hasQuery ? (
									<Button variant="outline" size="sm" onPress={onClearQuery}>
										Clear filters
									</Button>
								) : (
									<Link variant="default" size="sm" to="/recipes/new">
										<Plus aria-hidden="true" />
										New recipe
									</Link>
								)}
							</EmptyContent>
						</Empty>
					) : (
						<RecipesList recipes={items} />
					)}
				</CardContent>
				<CardFooter className="flex flex-row items-center justify-between border-t border-t-border pt-6">
					<Pagination
						page={page}
						pageSize={pageSize}
						total={total}
						itemLabel="recipes"
						onPageChange={onPageChange}
					/>
				</CardFooter>
			</Card>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/recipes")({
	staticData: { breadcrumb: { label: "Recipes" } },
	validateSearch: searchSchema,
	search: { middlewares: [stripSearchParams(SEARCH_DEFAULTS)] },
	loaderDeps: ({ search }) => search,
	loader: ({ deps }) =>
		listRecipes({
			search: deps.q,
			filters: decodeFilters(deps),
			page: deps.page,
			pageSize: PAGE_SIZE,
		}),
	component: Recipes,
});
