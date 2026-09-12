import { EllipsisVertical, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	Button,
	generatePagination,
	Heading,
	IconButton,
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Pagination,
	PaginationButton,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
	Text,
} from "@9bar/toolkit/components";
import {
	FilterBar,
	FilterBarActions,
	type FilterBarDefinition,
} from "@9bar/toolkit/components/composed";

const TYPE_FILTERS = [
	{ id: "all", label: "All", count: 128 },
	{ id: "recipes", label: "Recipes", count: 96 },
	{ id: "logs", label: "Logs", count: 32 },
];

const SAMPLE_RECIPES = [
	{
		name: "Ethiopia Guji",
		beans: "Washed · light roast",
		params: "18g → 36g · 28s",
		setup: "Linea Mini · Niche Zero",
		type: "Recipe",
	},
	{
		name: "Colombia Huila",
		beans: "Honey · medium roast",
		params: "17g → 34g · 30s",
		setup: "Linea Mini · Niche Zero",
		type: "Recipe",
	},
	{
		name: "Morning quick shot",
		beans: "House Espresso · medium-dark",
		params: "18.5g → 37g · 27s",
		setup: "Linea Mini · Niche Zero",
		type: "Log",
	},
	{
		name: "Kenya AA",
		beans: "Washed · light roast",
		params: "18g → 40g · 32s",
		setup: "Bambino · Encore ESP",
		type: "Recipe",
	},
	{
		name: "Decaf evening",
		beans: "Swiss Water · medium",
		params: "17g → 34g · 29s",
		setup: "Bambino · Encore ESP",
		type: "Log",
	},
	{
		name: "House Espresso",
		beans: "Natural blend · medium-dark",
		params: "18g → 36g · 28s",
		setup: "Linea Mini · Niche Zero",
		type: "Recipe",
	},
];

const FILTER_DEFINITIONS = [
	{
		id: "machine",
		label: "Machine",
		pluralLabel: "machines",
		operators: [
			{ id: "is", label: "is" },
			{ id: "is-not", label: "is not" },
		],
		defaultOperatorId: "is",
		options: [
			{ id: "linea-mini", label: "Linea Mini" },
			{ id: "bambino", label: "Bambino" },
		],
	},
	{
		id: "grinder",
		label: "Grinder",
		pluralLabel: "grinders",
		operators: [
			{ id: "is", label: "is" },
			{ id: "is-not", label: "is not" },
		],
		defaultOperatorId: "is",
		options: [
			{ id: "niche-zero", label: "Niche Zero" },
			{ id: "encore-esp", label: "Encore ESP" },
		],
	},
] as const satisfies ReadonlyArray<FilterBarDefinition>;

const DEFAULT_FILTERS = [{ filterId: "machine", operatorId: "is", values: ["linea-mini"] }];

const TOTAL_PAGES = 16;

export const RecipesListA = () => {
	const [activeFilter, setActiveFilter] = useState("all");
	const [page, setPage] = useState(1);
	const pages = generatePagination({
		currentPage: page,
		totalPages: TOTAL_PAGES,
		siblingCount: 1,
		boundaryCount: 1,
	});

	return (
		<section aria-labelledby="recipes-a-title" className="mx-auto max-w-3xl">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<Text variant="detail" className="tracking-widest uppercase">
						Your library
					</Text>
					<Heading as="h1" variant="title" id="recipes-a-title" className="mt-1">
						Recipes
					</Heading>
				</div>
				<Button variant="outline" size="sm">
					<Plus />
					New recipe
				</Button>
			</div>

			<div className="mt-5">
				<InputGroup>
					<InputGroupAddon>
						<Search className="size-4" />
					</InputGroupAddon>
					<InputGroupInput placeholder="Search recipes…" aria-label="Search recipes" />
				</InputGroup>
			</div>
			<div className="mt-3 flex flex-wrap items-center justify-between gap-2">
				<fieldset className="flex gap-1 border-0 p-0">
					<legend className="sr-only">Filter by type</legend>
					{TYPE_FILTERS.map((filter) => {
						return (
							<Button
								key={filter.id}
								variant={activeFilter === filter.id ? "secondary" : "ghost"}
								size="sm"
								onPress={() => setActiveFilter(filter.id)}
							>
								{filter.label}
								<Text variant="caption">{filter.count}</Text>
							</Button>
						);
					})}
				</fieldset>
				<Text variant="caption">128 results</Text>
			</div>
			<div className="mt-2 rounded-md bg-muted/50 px-2.5 py-2">
				<FilterBar
					definitions={FILTER_DEFINITIONS}
					defaultFilters={DEFAULT_FILTERS}
					aria-label="Advanced recipe filters"
				>
					{(state) =>
						!!state.filters.length && (
							<FilterBarActions>
								<Button variant="ghost" size="xs" onPress={state.clearAll}>
									Clear
								</Button>
							</FilterBarActions>
						)
					}
				</FilterBar>
			</div>

			<ul className="mt-2 divide-y divide-border border-y border-border">
				{SAMPLE_RECIPES.map((recipe) => {
					return (
						<li key={recipe.name} className="flex items-start justify-between gap-4 py-4">
							<div className="min-w-0">
								<Text variant="label" color="primary" className="truncate">
									{recipe.name}
								</Text>
								<Text variant="caption" className="mt-0.5 truncate">
									{recipe.beans} · {recipe.params}
								</Text>
								<Text variant="caption" className="truncate">
									{recipe.setup}
								</Text>
							</div>
							<div className="flex shrink-0 items-center gap-1">
								<Text variant="caption">{recipe.type}</Text>
								<MenuTrigger>
									<IconButton aria-label={`Actions for ${recipe.name}`} size="sm" variant="ghost">
										<EllipsisVertical />
									</IconButton>
									<Menu aria-label={`Actions for ${recipe.name}`}>
										<MenuItem textValue="View">
											<Eye className="size-3" />
											View
										</MenuItem>
										<MenuItem textValue="Edit">
											<Pencil className="size-3" />
											Edit
										</MenuItem>
										<MenuSeparator />
										<MenuItem textValue="Delete" variant="destructive">
											<Trash2 className="size-3" />
											Delete
										</MenuItem>
									</Menu>
								</MenuTrigger>
							</div>
						</li>
					);
				})}
			</ul>

			<div className="mt-4 flex items-center justify-between gap-3">
				<Text variant="caption" className="shrink-0">
					Page {page} of {TOTAL_PAGES}
				</Text>
				<Pagination aria-label="Recipes pages">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onPress={() => setPage(Math.max(1, page - 1))}
								isDisabled={page === 1}
							/>
						</PaginationItem>
						{pages.map((item, index) => {
							if (item === "ellipsis") {
								return (
									<PaginationItem key={`ellipsis-${index}`}>
										<PaginationEllipsis />
									</PaginationItem>
								);
							}
							return (
								<PaginationItem key={item}>
									<PaginationButton
										isActive={page === item}
										onPress={() => setPage(item)}
										aria-label={`Go to page ${item}`}
									>
										{item}
									</PaginationButton>
								</PaginationItem>
							);
						})}
						<PaginationItem>
							<PaginationNext
								onPress={() => setPage(Math.min(TOTAL_PAGES, page + 1))}
								isDisabled={page === TOTAL_PAGES}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</section>
	);
};
