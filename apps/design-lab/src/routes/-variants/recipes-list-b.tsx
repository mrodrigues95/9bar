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
	Select,
	SelectContent,
	SelectItem,
	SelectList,
	SelectTrigger,
	SelectValue,
	Text,
} from "@9bar/toolkit/components";

const SAMPLE_RECIPES = [
	{
		name: "Ethiopia Guji",
		beans: "Washed · light",
		params: "18g → 36g · 28s",
		setup: "Linea Mini · Niche Zero",
		type: "Recipe",
		dialedIn: true,
	},
	{
		name: "Colombia Huila",
		beans: "Honey · medium",
		params: "17g → 34g · 30s",
		setup: "Linea Mini · Niche Zero",
		type: "Recipe",
		dialedIn: false,
	},
	{
		name: "Morning quick shot",
		beans: "House Espresso",
		params: "18.5g → 37g · 27s",
		setup: "Linea Mini · Niche Zero",
		type: "Log",
		dialedIn: false,
	},
	{
		name: "Kenya AA",
		beans: "Washed · light",
		params: "18g → 40g · 32s",
		setup: "Bambino · Encore ESP",
		type: "Recipe",
		dialedIn: true,
	},
	{
		name: "Decaf evening",
		beans: "Swiss Water · medium",
		params: "17g → 34g · 29s",
		setup: "Bambino · Encore ESP",
		type: "Log",
		dialedIn: false,
	},
	{
		name: "House Espresso",
		beans: "Natural blend",
		params: "18g → 36g · 28s",
		setup: "Linea Mini · Niche Zero",
		type: "Recipe",
		dialedIn: true,
	},
];

const TOTAL_PAGES = 12;

/**
 * Ledger direction: dense column-aligned rows with tiny uppercase labels,
 * mono brew parameters, status dots instead of badges, and compact numbered
 * pagination. Most information per pixel of the three.
 */
export const RecipesListB = () => {
	const [page, setPage] = useState(1);
	const pages = generatePagination({
		currentPage: page,
		totalPages: TOTAL_PAGES,
		siblingCount: 1,
		boundaryCount: 1,
	});

	return (
		<section aria-labelledby="recipes-b-title" className="mx-auto max-w-4xl">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<Heading as="h1" variant="title" id="recipes-b-title">
						Recipes
					</Heading>
					<Text variant="caption" className="mt-1">
						128 entries · 96 recipes · 32 logs
					</Text>
				</div>
				<Button variant="outline" size="sm">
					<Plus />
					New recipe
				</Button>
			</div>

			<div className="mt-5 flex flex-wrap gap-2">
				<InputGroup className="min-w-44 flex-1">
					<InputGroupAddon>
						<Search className="size-4" />
					</InputGroupAddon>
					<InputGroupInput placeholder="Search recipes…" aria-label="Search recipes" />
				</InputGroup>
				<Select aria-label="Machine" placeholder="All machines">
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectList>
							<SelectItem id="linea-mini">Linea Mini</SelectItem>
							<SelectItem id="bambino">Bambino</SelectItem>
						</SelectList>
					</SelectContent>
				</Select>
				<Select aria-label="Grinder" placeholder="All grinders">
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectList>
							<SelectItem id="niche-zero">Niche Zero</SelectItem>
							<SelectItem id="encore-esp">Encore ESP</SelectItem>
						</SelectList>
					</SelectContent>
				</Select>
			</div>

			<div
				aria-hidden="true"
				className="mt-6 grid grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)_auto_auto] items-center gap-4 border-b border-border pb-2"
			>
				<Text variant="detail" className="tracking-widest uppercase">
					Recipe
				</Text>
				<Text variant="detail" className="tracking-widest uppercase">
					Setup
				</Text>
				<Text variant="detail" className="tracking-widest uppercase">
					Parameters
				</Text>
				<span className="w-8" />
			</div>
			<ul className="divide-y divide-border">
				{SAMPLE_RECIPES.map((recipe) => {
					return (
						<li
							key={recipe.name}
							className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)_auto_auto] items-center gap-4 py-3"
						>
							<div className="min-w-0">
								<Text variant="label" color="primary" className="truncate">
									{recipe.name}
								</Text>
								<Text variant="caption" className="truncate">
									{recipe.beans}
								</Text>
							</div>
							<Text variant="caption" className="truncate">
								{recipe.setup}
							</Text>
							<Text variant="caption" className="font-mono whitespace-nowrap">
								{recipe.params}
							</Text>
							<div className="flex w-8 items-center justify-end gap-2">
								<span
									title={recipe.dialedIn ? "Dialed in" : recipe.type}
									className={
										recipe.dialedIn
											? "size-1.5 rounded-full bg-emerald-500"
											: "size-1.5 rounded-full bg-border"
									}
								/>
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

			<div className="mt-4 flex flex-wrap items-center justify-between gap-2">
				<Text variant="caption">Showing 6 of 128</Text>
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
