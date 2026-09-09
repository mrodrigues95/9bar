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

type FilterKey = "Type" | "Machine" | "Grinder";

const FILTER_GROUPS: Array<{
	label: FilterKey;
	options: Array<{ id: string; label: string; count: number }>;
}> = [
	{
		label: "Type",
		options: [
			{ id: "all", label: "All", count: 128 },
			{ id: "recipes", label: "Recipes", count: 96 },
			{ id: "logs", label: "Logs", count: 32 },
		],
	},
	{
		label: "Machine",
		options: [
			{ id: "linea-mini", label: "Linea Mini", count: 84 },
			{ id: "bambino", label: "Bambino", count: 44 },
		],
	},
	{
		label: "Grinder",
		options: [
			{ id: "niche-zero", label: "Niche Zero", count: 90 },
			{ id: "encore-esp", label: "Encore ESP", count: 38 },
		],
	},
];

const SAMPLE_RECIPES = [
	{
		name: "Ethiopia Guji",
		meta: "Washed · light · 18g → 36g · 28s",
		setup: "Linea Mini · Niche Zero",
	},
	{
		name: "Colombia Huila",
		meta: "Honey · medium · 17g → 34g · 30s",
		setup: "Linea Mini · Niche Zero",
	},
	{
		name: "Morning quick shot",
		meta: "House Espresso · 18.5g → 37g · 27s",
		setup: "Linea Mini · Niche Zero",
	},
	{
		name: "Kenya AA",
		meta: "Washed · light · 18g → 40g · 32s",
		setup: "Bambino · Encore ESP",
	},
	{
		name: "Decaf evening",
		meta: "Swiss Water · medium · 17g → 34g · 29s",
		setup: "Bambino · Encore ESP",
	},
	{
		name: "House Espresso",
		meta: "Natural blend · 18g → 36g · 28s",
		setup: "Linea Mini · Niche Zero",
	},
];

const TOTAL_PAGES = 12;

/**
 * Sidebar direction: a slim filter rail with grouped options and counts,
 * compact rows, and centered numbered pagination. Closest in spirit to the
 * current page, with the chrome stripped back.
 */
export const RecipesListC = () => {
	const [activeFilters, setActiveFilters] = useState<Record<FilterKey, string>>({
		Type: "all",
		Machine: "linea-mini",
		Grinder: "all",
	});
	const [page, setPage] = useState(1);
	const pages = generatePagination({
		currentPage: page,
		totalPages: TOTAL_PAGES,
		siblingCount: 1,
		boundaryCount: 1,
	});
	const activeCount = Object.values(activeFilters).filter((value) => value !== "all").length;

	return (
		<section aria-labelledby="recipes-c-title" className="mx-auto max-w-4xl">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<Heading as="h1" variant="title" id="recipes-c-title">
						Recipes
					</Heading>
					<Text variant="body-sm" className="mt-1">
						Create, edit, and track your favorite brewing methods.
					</Text>
				</div>
				<Button variant="outline" size="sm">
					<Plus />
					New recipe
				</Button>
			</div>

			<div className="mt-5 flex flex-wrap items-center gap-3">
				<InputGroup className="min-w-44 flex-1">
					<InputGroupAddon>
						<Search className="size-4" />
					</InputGroupAddon>
					<InputGroupInput placeholder="Search recipes…" aria-label="Search recipes" />
				</InputGroup>
				<Text variant="caption">128 results</Text>
			</div>

			<div className="mt-6 grid gap-8 sm:grid-cols-[180px_minmax(0,1fr)]">
				<aside aria-label="Recipe filters">
					<div className="flex items-center justify-between">
						<Text variant="detail" className="tracking-widest uppercase">
							Filters{activeCount > 0 ? ` (${activeCount})` : ""}
						</Text>
						{activeCount > 0 && (
							<Button
								variant="link"
								size="sm"
								onPress={() => setActiveFilters({ Type: "all", Machine: "all", Grinder: "all" })}
							>
								Clear
							</Button>
						)}
					</div>
					{FILTER_GROUPS.map((group) => {
						return (
							<fieldset key={group.label} className="mt-4 border-0 p-0">
								<Text as="legend" variant="detail" className="p-0">
									{group.label}
								</Text>
								<div className="mt-1 flex flex-col gap-0.5">
									{group.options.map((option) => {
										const isActive = activeFilters[group.label] === option.id;
										return (
											<button
												key={option.id}
												type="button"
												aria-pressed={isActive}
												onClick={() => {
													setActiveFilters((previous) => ({
														...previous,
														[group.label]: option.id,
													}));
												}}
												className={
													isActive
														? "flex items-center justify-between rounded-md bg-muted px-2 py-1.5 text-sm font-medium text-primary"
														: "flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/60 hover:text-primary"
												}
											>
												{option.label}
												<Text variant="caption">{option.count}</Text>
											</button>
										);
									})}
								</div>
							</fieldset>
						);
					})}
				</aside>

				<div className="min-w-0">
					<ul className="divide-y divide-border border-y border-border">
						{SAMPLE_RECIPES.map((recipe) => {
							return (
								<li key={recipe.name} className="flex items-start justify-between gap-4 py-3">
									<div className="min-w-0">
										<Text variant="label" color="primary" className="truncate">
											{recipe.name}
										</Text>
										<Text variant="caption" className="mt-0.5 truncate">
											{recipe.meta}
										</Text>
										<Text variant="caption" className="truncate">
											{recipe.setup}
										</Text>
									</div>
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
								</li>
							);
						})}
					</ul>
					<div className="mt-4 flex justify-center">
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
				</div>
			</div>
		</section>
	);
};
