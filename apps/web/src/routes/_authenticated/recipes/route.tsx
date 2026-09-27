import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import { cn } from "@9bar/toolkit/utils";
import { Link } from "../../../components";
import { Pagination } from "../../../components/pagination/pagination";
import { useDebouncedValue } from "../../../utils/hooks";
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
	type TFilterSearchParams,
} from "./-recipes-query";

const resolveIntent = (search: { q: string; page: number } & TFilterSearchParams) => ({
	version: 0,
	q: search.q,
	filters: decodeFilters(search),
	page: search.page,
	replace: true,
});

type RecipeSearchIntent = ReturnType<typeof resolveIntent>;

const encodeIntent = (intent: RecipeSearchIntent) => {
	return { q: intent.q, page: intent.page, ...encodeFilters(intent.filters) };
};

const intentKey = (intent: RecipeSearchIntent) => {
	return JSON.stringify(encodeIntent(intent));
};

const useRecipesSearch = () => {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const isFetching = Route.useMatch({ select: (match) => !!match.isFetching });
	const [intent, setIntent] = useState(() => resolveIntent(search));
	const debouncedIntent = useDebouncedValue(intent, 250);

	const urlIntent = resolveIntent(search);
	const urlKey = intentKey(urlIntent);

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
				intentKey(prev) === urlKey ? prev : { ...urlIntent, version: prev.version + 1 },
			);
			return;
		}

		const debouncedKey = intentKey(debouncedIntent);
		if (isFetching || debouncedKey === urlKey || debouncedIntent.version !== intent.version) {
			return;
		}

		navigate({
			search: (prev) => ({ ...prev, ...encodeIntent(debouncedIntent) }),
			replace: debouncedIntent.replace,
		});
		lastWrittenKeyRef.current = debouncedKey;
	}, [urlKey, urlIntent, debouncedIntent, intent.version, isFetching, navigate]);

	const updateIntent = (patch: Partial<Omit<RecipeSearchIntent, "version">>) => {
		setIntent((prev) => ({ ...prev, ...patch, version: prev.version + 1 }));
	};

	return {
		q: intent.q,
		filters: intent.filters,
		page: intent.page,
		isStale: isFetching || intentKey(intent) !== urlKey,
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

const Recipes = () => {
	const { total, pageSize } = Route.useLoaderData();
	const { q, filters, page, isStale, setQuery, setFilters, setPage, clear } = useRecipesSearch();
	const hasQuery = !!q.trim() || !!filters.length;

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
								value={q}
								onChange={(event) => {
									setQuery(event.target.value);
								}}
								placeholder="Search recipes…"
								aria-label="Search recipes"
							/>
						</InputGroup>
						<FilterBarAddTrigger
							definitions={FILTER_DEFINITIONS}
							filters={filters}
							onFiltersChange={setFilters}
							aria-label="Add recipe filter"
						/>
					</div>
					{filters.length > 0 && (
						<div className="rounded-md bg-muted/50 px-2.5 py-2">
							<FilterBar
								definitions={FILTER_DEFINITIONS}
								filters={filters}
								onFiltersChange={setFilters}
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
