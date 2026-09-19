import {
	ArrowRight,
	ArrowRightLeft,
	Bean,
	Cog,
	EllipsisVertical,
	Gauge,
	Link2,
	ListFilter,
	Pencil,
	Plus,
	Search,
	Tags,
	Trash2,
} from "lucide-react";
import { type ComponentType, useState } from "react";
import {
	Badge,
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
	PaginationFirst,
	PaginationItem,
	PaginationLast,
	PaginationNext,
	PaginationPrevious,
	Text,
} from "@9bar/toolkit/components";
import { FilterBarActions, type FilterBarFilterState } from "@9bar/toolkit/components/composed";
import { LocalFilterBar, type LocalFilterBarDefinition } from "./_local/recipes-filter-bar";

const SAMPLE_RECIPES = [
	{
		name: "Ethiopia Guji",
		beans: "Washed · light roast",
		params: "18g → 36g · 28s",
		machine: "Linea Mini",
		grinder: "Niche Zero",
		type: "Recipe",
	},
	{
		name: "Colombia Huila",
		beans: "Honey processed · medium roast · Finca La Esperanza, Huila, Colombia",
		params: "17g → 34g · 30s",
		machine: "Linea Mini with flow-control mod",
		grinder: "Niche Zero · SSP high-uniformity burrs",
		type: "Recipe",
	},
	{
		name: "Morning quick shot",
		beans: "House Espresso · medium-dark",
		params: "18.5g → 37g · 27s",
		machine: "Linea Mini",
		grinder: "Niche Zero",
		type: "Log",
	},
	{
		name: "Kenya AA",
		beans: "Washed · light roast",
		params: "18g → 40g · 32s",
		machine: "Bambino",
		grinder: "Encore ESP",
		type: "Recipe",
	},
	{
		name: "Decaf evening",
		beans: "Swiss Water · medium",
		params: "17g → 34g · 29s",
		machine: "Bambino",
		grinder: "Encore ESP",
		type: "Log",
	},
	{
		name: "House Espresso",
		beans: "Natural blend · medium-dark",
		params: "18g → 36g · 28s",
		machine: "Linea Mini",
		grinder: "Niche Zero",
		type: "Recipe",
	},
];

const FILTER_DEFINITIONS = [
	{
		id: "type",
		label: "Type",
		pluralLabel: "types",
		icon: Tags,
		operators: [
			{ id: "is", label: "is" },
			{ id: "is-not", label: "is not" },
		],
		defaultOperatorId: "is",
		options: [
			{ id: "recipes", label: "Recipes" },
			{ id: "logs", label: "Logs" },
		],
	},
	{
		id: "machine",
		label: "Machine",
		pluralLabel: "machines",
		icon: Gauge,
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
		icon: Cog,
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
] as const satisfies ReadonlyArray<LocalFilterBarDefinition>;

const DEFAULT_FILTERS = [{ filterId: "machine", operatorId: "is", values: ["linea-mini"] }];

const TOTAL_PAGES = 16;

interface MetaItemProps {
	/** Leading decorative icon for the field. */
	icon: ComponentType<{ className?: string }>;
	/** Field value shown after the icon. */
	label: string;
}

/** One piece of row metadata (beans, machine, grinder) with its leading icon. */
const MetaItem = ({ icon: Icon, label }: MetaItemProps) => {
	return (
		<Text variant="caption" className="flex max-w-full min-w-0 items-center gap-1">
			<Icon className="size-3 shrink-0" aria-hidden="true" />
			<span className="truncate">{label}</span>
		</Text>
	);
};

export const RecipesListA = () => {
	const [filters, setFilters] = useState<Array<FilterBarFilterState>>(DEFAULT_FILTERS);

	const [page, setPage] = useState(1);
	const pages = generatePagination({
		currentPage: page,
		totalPages: TOTAL_PAGES,
		siblingCount: 1,
		boundaryCount: 1,
	});

	return (
		<section aria-labelledby="recipes-a-title" className="mx-auto max-w-3xl">
			<div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
				<div>
					<Heading as="h1" variant="title" id="recipes-a-title">
						Recipes
					</Heading>
				</div>
				<Button variant="outline" size="sm">
					<Plus />
					New recipe
				</Button>
			</div>

			<div className="mt-5 flex flex-wrap items-center justify-end gap-2">
				<InputGroup className="w-52 shrink-0">
					<InputGroupAddon>
						<Search className="size-4" />
					</InputGroupAddon>
					<InputGroupInput placeholder="Search recipes…" aria-label="Search recipes" />
				</InputGroup>
				<LocalFilterBar
					definitions={FILTER_DEFINITIONS}
					filters={filters}
					onFiltersChange={setFilters}
					aria-label="Add recipe filter"
					className="[&_[data-slot='filter-bar-filter']]:hidden"
					addIcon={ListFilter}
				/>
			</div>
			{filters.length > 0 && (
				<div className="mt-2 rounded-md bg-muted/50 px-2.5 py-2">
					<LocalFilterBar
						definitions={FILTER_DEFINITIONS}
						filters={filters}
						onFiltersChange={setFilters}
						aria-label="Active recipe filters"
						className="w-full justify-end"
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
					</LocalFilterBar>
				</div>
			)}

			<ul className="mt-2 border-b border-border">
				{SAMPLE_RECIPES.map((recipe) => {
					const isRecipe = recipe.type === "Recipe";

					return (
						<li key={recipe.name} className="flex items-center gap-3 py-2.5">
							<div className="min-w-0 flex-1">
								<Text variant="label" color="primary" className="truncate">
									{recipe.name}
								</Text>
								<Text variant="caption" className="mt-0.5 truncate font-mono">
									{recipe.params}
								</Text>
								<div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-0.5">
									<MetaItem icon={Bean} label={recipe.beans} />
									<MetaItem icon={Gauge} label={recipe.machine} />
									<MetaItem icon={Cog} label={recipe.grinder} />
								</div>
							</div>
							<div className="flex shrink-0 items-center gap-1">
								<Badge variant={isRecipe ? "secondary" : "outline"}>{recipe.type}</Badge>
								<MenuTrigger>
									<IconButton aria-label={`Actions for ${recipe.name}`} size="sm" variant="ghost">
										<EllipsisVertical />
									</IconButton>
									{/*
										TODO: `w-max` is a workaround, not the intended API. The toolkit's Menu popover
										defaults to `w-(--trigger-width) min-w-32`, which pins the popover to the trigger —
										correct for a Select under a full-width button, but it clamps an icon-triggered
										kebab menu to 128px and wraps labels like "Convert to Recipe". `w-auto` does NOT
										fix this (`width: auto` still resolves to the trigger width on an absolutely
										positioned popover); only `w-max` escapes it.

										When porting this variant to a real implementation, replace this override with a
										toolkit `Menu` width variant — e.g. `width?: "trigger" | "content"` defaulting to
										"trigger", with icon-triggered menus opting into "content". That needs a Storybook
										story and its own commit, so it is deliberately not done here.
									*/}
									<Menu aria-label={`Actions for ${recipe.name}`} className="w-max min-w-40">
										{isRecipe ? (
											<MenuItem textValue="View">
												<ArrowRight className="size-3" />
												View
											</MenuItem>
										) : null}
										<MenuItem textValue="Edit">
											<Pencil className="size-3" />
											Edit
										</MenuItem>
										{isRecipe ? null : (
											<MenuItem textValue="Convert to Recipe">
												<ArrowRightLeft className="size-3" />
												Convert to Recipe
											</MenuItem>
										)}
										{isRecipe ? null : (
											<MenuItem textValue="Link to Recipe">
												<Link2 className="size-3" />
												Link to Recipe
											</MenuItem>
										)}
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
				<Pagination aria-label="Recipes pages" className="m-0 w-auto justify-end">
					<PaginationContent>
						<PaginationItem>
							<PaginationFirst onPress={() => setPage(1)} isDisabled={page === 1} />
						</PaginationItem>
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
						<PaginationItem>
							<PaginationLast
								onPress={() => setPage(TOTAL_PAGES)}
								isDisabled={page === TOTAL_PAGES}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</section>
	);
};
