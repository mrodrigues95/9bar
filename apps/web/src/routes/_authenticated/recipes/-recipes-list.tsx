import { DateFormatter, parseAbsolute } from "@internationalized/date";
import { getRouteApi } from "@tanstack/react-router";
import {
	ArrowRight,
	ArrowRightLeft,
	Bean,
	Clock,
	Cog,
	EllipsisVertical,
	Gauge,
	type LucideIcon,
	Paperclip,
	Pencil,
	Scale,
	Trash2,
} from "lucide-react";
import {
	Badge,
	IconButton,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Text,
} from "@9bar/toolkit/components";
import { MenuItemLink } from "../../../components";
import type { TRecipeGraph } from "../../../utils/data";
import { grinderName, machineName } from "./-recipes-query";

const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const DATE_FORMATTER = new DateFormatter("en-US", { dateStyle: "long", timeZone: TIME_ZONE });
const TIME_FORMATTER = new DateFormatter("en-US", { timeStyle: "short", timeZone: TIME_ZONE });

const formatShotAt = (shotAt: string) => {
	const date = parseAbsolute(shotAt, TIME_ZONE).toDate();
	return `${DATE_FORMATTER.format(date)} @ ${TIME_FORMATTER.format(date)}`;
};

const recipeName = (recipe: TRecipeGraph) => {
	return recipe.name ?? "(Untitled)";
};

const RecipeMetaItem = ({ icon: Icon, label }: { icon: LucideIcon; label: string }) => {
	return (
		<Text variant="caption" className="flex max-w-full min-w-0 items-center gap-1">
			<Icon className="size-3 shrink-0" />
			<span className="truncate">{label}</span>
		</Text>
	);
};

const RecipeActions = ({ recipe }: { recipe: TRecipeGraph }) => {
	const name = recipeName(recipe);

	return (
		<MenuTrigger>
			<IconButton aria-label={`Actions for ${name}`} size="sm" variant="ghost">
				<EllipsisVertical />
			</IconButton>
			<Menu aria-label={`Actions for ${name}`} width="content">
				{!recipe.isQuickBrew && (
					<MenuItemLink
						to="/recipes/$recipeId"
						params={{ recipeId: String(recipe.id) }}
						textValue="View"
					>
						<ArrowRight className="size-3" />
						View
					</MenuItemLink>
				)}
				<MenuItemLink
					{...(recipe.isQuickBrew
						? {
								to: "/recipes/$recipeId/logs/$logId/edit",
								params: {
									recipeId: String(recipe.id),
									logId: String(recipe.log.id),
								},
							}
						: {
								to: "/recipes/$recipeId/edit",
								params: { recipeId: String(recipe.id) },
							})}
					textValue="Edit"
				>
					<Pencil className="size-3" />
					Edit
				</MenuItemLink>
				{recipe.isQuickBrew && (
					<MenuItemLink
						to="/recipes/$recipeId/edit"
						params={{ recipeId: String(recipe.id) }}
						search={{ convert: "log" }}
						textValue="Convert to Recipe"
					>
						<ArrowRightLeft className="size-3" />
						Convert to Recipe
					</MenuItemLink>
				)}
				{recipe.isQuickBrew && (
					<MenuItem onAction={() => alert("rename")} textValue="Attach to Recipe">
						<Paperclip className="size-3" />
						Attach to Recipe
					</MenuItem>
				)}
				<MenuSeparator />
				<MenuItem onAction={() => alert("delete")} variant="destructive" textValue="Delete">
					<Trash2 className="size-3" />
					Delete
				</MenuItem>
			</Menu>
		</MenuTrigger>
	);
};

const RecipesListItem = ({ recipe }: { recipe: TRecipeGraph }) => {
	const name = recipeName(recipe);

	return (
		<li className="flex items-center gap-3 py-2.5">
			<div className="min-w-0 flex-1">
				<Text variant="label" color="primary" className="truncate">
					{name}
				</Text>
				<Text variant="caption" className="mt-0.5 flex min-w-0 items-center gap-1 font-mono">
					<Scale className="size-3 shrink-0" />
					<span className="truncate">
						{recipe.snapshot.dose}g → {recipe.snapshot.yield}g · {recipe.snapshot.brewTime}
						{recipe.snapshot.brewTimeUnit}
					</span>
				</Text>
				<div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-0.5">
					<RecipeMetaItem icon={Bean} label={recipe.snapshot.beans} />
					<RecipeMetaItem icon={Gauge} label={machineName(recipe.snapshot.machine)} />
					<RecipeMetaItem icon={Cog} label={grinderName(recipe.snapshot.grinder)} />
					{recipe.isQuickBrew && (
						<RecipeMetaItem icon={Clock} label={formatShotAt(recipe.log.shotAt)} />
					)}
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-1">
				<Badge variant={recipe.isQuickBrew ? "outline" : "secondary"}>
					{recipe.isQuickBrew ? "Log" : "Recipe"}
				</Badge>
				<RecipeActions recipe={recipe} />
			</div>
		</li>
	);
};

const routeApi = getRouteApi("/_authenticated/recipes");

export const RecipesList = () => {
	const { items } = routeApi.useLoaderData();

	return (
		<ul>
			{items.map((recipe) => (
				<RecipesListItem key={recipe.id} recipe={recipe} />
			))}
		</ul>
	);
};
