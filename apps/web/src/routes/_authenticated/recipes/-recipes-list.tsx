import { DateFormatter, parseAbsolute } from "@internationalized/date";
import { getRouteApi } from "@tanstack/react-router";
import {
	Bean,
	BookmarkPlus,
	Clock,
	Cog,
	Copy,
	EllipsisVertical,
	Gauge,
	type LucideIcon,
	Paperclip,
	Pencil,
	Pin,
	Repeat,
	RotateCcw,
	Scale,
	Trash2,
	Unlink,
} from "lucide-react";
import { useDeferredValue } from "react";
import {
	Badge,
	type BadgeProps,
	IconButton,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Text,
} from "@9bar/toolkit/components";
import { Link, MenuItemLink } from "../../../components";
import {
	RECIPE_STATUS_LABELS,
	VERDICT_LABELS,
	grinderName,
	machineName,
	type TLog,
	type TRecipe,
	type TVerdict,
} from "../../../utils/data";
import { type TRecipesListRow } from "./-recipes-query";

const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
const SHOT_FORMATTER = new DateFormatter("en-GB", {
	day: "numeric",
	month: "short",
	hour: "2-digit",
	minute: "2-digit",
	timeZone: TIME_ZONE,
});

const formatShotAt = (shotAt: string) => {
	return SHOT_FORMATTER.format(parseAbsolute(shotAt, TIME_ZONE).toDate());
};

const verdictVariant = (verdict: TVerdict): BadgeProps["variant"] => {
	return verdict === "balanced" ? "secondary" : "outline";
};

const RowMetaItem = ({ icon: Icon, label }: { icon: LucideIcon; label: string }) => {
	return (
		<Text variant="caption" className="flex max-w-full min-w-0 items-center gap-1">
			<Icon className="size-3 shrink-0" />
			<span className="truncate">{label}</span>
		</Text>
	);
};

const RowTitleLink = ({ recipeId, name }: { recipeId: number; name: string }) => {
	return (
		<Link
			to="/recipes/$recipeId"
			params={{ recipeId: String(recipeId) }}
			className="h-auto min-w-0 px-0 text-sm font-medium"
		>
			<span className="truncate">{name}</span>
		</Link>
	);
};

const RecipeRowActions = ({ recipe }: { recipe: TRecipe }) => {
	return (
		<MenuTrigger>
			<IconButton aria-label={`Actions for ${recipe.name}`} size="sm" variant="ghost">
				<EllipsisVertical />
			</IconButton>
			<Menu aria-label={`Actions for ${recipe.name}`} width="content">
				<MenuItemLink
					to="/recipes/$recipeId/edit"
					params={{ recipeId: String(recipe.id) }}
					textValue="Edit"
				>
					<Pencil className="size-3" />
					Edit
				</MenuItemLink>
				<MenuItem textValue="Duplicate">
					<Copy className="size-3" />
					Duplicate
				</MenuItem>
				<MenuItem textValue="Log again">
					<RotateCcw className="size-3" />
					Log again
				</MenuItem>
				<MenuSeparator />
				<MenuItem variant="destructive" textValue="Delete">
					<Trash2 className="size-3" />
					Delete
				</MenuItem>
			</Menu>
		</MenuTrigger>
	);
};

const AttachedLogActions = ({ name }: { name: string }) => {
	return (
		<MenuTrigger>
			<IconButton aria-label={`Actions for ${name}`} size="sm" variant="ghost">
				<EllipsisVertical />
			</IconButton>
			<Menu aria-label={`Actions for ${name}`} width="content">
				<MenuItem textValue="Edit">
					<Pencil className="size-3" />
					Edit
				</MenuItem>
				<MenuItem textValue="Set as reference shot">
					<Pin className="size-3" />
					Set as reference shot
				</MenuItem>
				<MenuItem textValue="Detach from recipe">
					<Unlink className="size-3" />
					Detach from recipe
				</MenuItem>
				<MenuSeparator />
				<MenuItem variant="destructive" textValue="Delete">
					<Trash2 className="size-3" />
					Delete
				</MenuItem>
			</Menu>
		</MenuTrigger>
	);
};

const QuickLogActions = ({ log }: { log: TLog }) => {
	return (
		<MenuTrigger>
			<IconButton aria-label="Actions for (Untitled)" size="sm" variant="ghost">
				<EllipsisVertical />
			</IconButton>
			<Menu aria-label="Actions for (Untitled)" width="content">
				<MenuItemLink
					to="/recipes/$recipeId/logs/$logId/edit"
					params={{ recipeId: String(log.id), logId: String(log.id) }}
					textValue="Edit"
				>
					<Pencil className="size-3" />
					Edit
				</MenuItemLink>
				<MenuItem textValue="Repeat">
					<Repeat className="size-3" />
					Repeat
				</MenuItem>
				<MenuItem textValue="Save as recipe">
					<BookmarkPlus className="size-3" />
					Save as recipe
				</MenuItem>
				<MenuItem textValue="Attach to recipe">
					<Paperclip className="size-3" />
					Attach to recipe
				</MenuItem>
				<MenuSeparator />
				<MenuItem variant="destructive" textValue="Delete">
					<Trash2 className="size-3" />
					Delete
				</MenuItem>
			</Menu>
		</MenuTrigger>
	);
};

const DoseLine = ({ row }: { row: TRecipesListRow }) => {
	return (
		<Text variant="caption" className="mt-0.5 flex min-w-0 items-center gap-1 font-mono">
			<Scale className="size-3 shrink-0" />
			<span className="truncate">
				{row.snapshot.dose}g → {row.snapshot.yield}g · {row.snapshot.brewTime}
				{row.snapshot.brewTimeUnit}
			</span>
		</Text>
	);
};

const RecipeRow = ({ row }: { row: Extract<TRecipesListRow, { kind: "recipe" }> }) => {
	return (
		<li className="flex items-center gap-3 py-2.5">
			<div className="min-w-0 flex-1">
				<div className="flex min-w-0 items-center gap-2">
					<RowTitleLink recipeId={row.recipe.id} name={row.recipe.name} />
					<Badge variant="secondary">Recipe</Badge>
					<Badge variant="outline">{RECIPE_STATUS_LABELS[row.recipe.status]}</Badge>
				</div>
				<DoseLine row={row} />
				<div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-0.5">
					<RowMetaItem icon={Bean} label={row.snapshot.beans} />
					<RowMetaItem icon={Gauge} label={machineName(row.snapshot.machine)} />
					<RowMetaItem icon={Cog} label={grinderName(row.snapshot.grinder)} />
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-1">
				<RecipeRowActions recipe={row.recipe} />
			</div>
		</li>
	);
};

const LogRow = ({ row }: { row: Extract<TRecipesListRow, { kind: "log" }> }) => {
	const name = row.recipe?.name ?? "(Untitled)";

	return (
		<li className="flex items-center gap-3 py-2.5">
			<div className="min-w-0 flex-1">
				<div className="flex min-w-0 items-center gap-2">
					{row.recipe ? (
						<RowTitleLink recipeId={row.recipe.id} name={row.recipe.name} />
					) : (
						<Text variant="label" color="primary" className="truncate">
							{name}
						</Text>
					)}
					<Badge variant="outline">{row.recipe ? "Attached log" : "Quick log"}</Badge>
					{row.log.verdict && (
						<Badge variant={verdictVariant(row.log.verdict)}>
							{VERDICT_LABELS[row.log.verdict]}
						</Badge>
					)}
				</div>
				<DoseLine row={row} />
				<div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-0.5">
					<RowMetaItem icon={Clock} label={formatShotAt(row.log.shotAt)} />
					{row.recipe ? (
						<RowMetaItem icon={Bean} label={row.snapshot.beans} />
					) : (
						<>
							<RowMetaItem icon={Gauge} label={machineName(row.snapshot.machine)} />
							<RowMetaItem icon={Cog} label={grinderName(row.snapshot.grinder)} />
						</>
					)}
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-1">
				{row.recipe ? <AttachedLogActions name={name} /> : <QuickLogActions log={row.log} />}
			</div>
		</li>
	);
};

const routeApi = getRouteApi("/_authenticated/recipes");

export const RecipesList = () => {
	const { items } = routeApi.useLoaderData();
	const deferredItems = useDeferredValue(items);

	return (
		<ul>
			{deferredItems.map((row) =>
				row.kind === "recipe" ? (
					<RecipeRow key={row.key} row={row} />
				) : (
					<LogRow key={row.key} row={row} />
				),
			)}
		</ul>
	);
};
