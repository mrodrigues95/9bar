import { createFileRoute, stripSearchParams, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { z } from "zod";
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
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
import { FilterBarAddTrigger } from "./-filter-bar-add-trigger";
import { NoRecipesFound } from "./-no-recipes-found";
import { RecipesList } from "./-recipes-list";
import {
	decodeFilters,
	encodeFilters,
	FILTER_DEFINITIONS,
	FILTER_PARAM_SCHEMA,
	listRecipes,
	PAGE_SIZE,
} from "./-recipes-query";

const Recipes = () => {
	const search = Route.useSearch();
	const { items, total, page, pageSize } = Route.useLoaderData();
	const navigate = useNavigate({ from: Route.fullPath });
	const filters = decodeFilters(search);
	const hasQuery = !!search.q.trim() || !!filters.length;

	const onFiltersChange = (nextFilters: Array<FilterBarFilterState>) => {
		navigate({ search: (prev) => ({ ...prev, ...encodeFilters(nextFilters), page: 1 }) });
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
							<Plus />
							New recipe
						</Link>
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					<div className="flex flex-wrap items-center justify-end gap-2">
						<InputGroup className="w-52 shrink-0">
							<InputGroupAddon>
								<Search className="size-4" />
							</InputGroupAddon>
							<InputGroupInput
								value={search.q}
								onChange={(event) => {
									navigate({
										search: (prev) => ({ ...prev, q: event.target.value, page: 1 }),
										replace: true,
									});
								}}
								placeholder="Search recipes…"
								aria-label="Search recipes"
							/>
						</InputGroup>
						<FilterBarAddTrigger
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
					{!total && (
						<NoRecipesFound
							hasQuery={hasQuery}
							onClearQuery={() => navigate({ search: { q: "", page: 1 } })}
						/>
					)}
					{!!total && <RecipesList recipes={items} />}
				</CardContent>
				<CardFooter className="flex flex-row items-center justify-between border-t border-t-border pt-6">
					<Pagination
						page={page}
						pageSize={pageSize}
						total={total}
						onPageChange={(nextPage) =>
							navigate({ search: (prev) => ({ ...prev, page: nextPage }) })
						}
					/>
				</CardFooter>
			</Card>
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
			search: deps.q,
			filters: decodeFilters(deps),
			page: deps.page,
			pageSize: PAGE_SIZE,
		}),
	component: Recipes,
});
