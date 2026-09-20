import { parseAbsolute } from "@internationalized/date";
import {
	ArrowRight,
	ArrowRightLeft,
	Bean,
	Clock,
	Cog,
	EllipsisVertical,
	FileText,
	Fingerprint,
	Gauge,
	type LucideIcon,
	Paperclip,
	Pencil,
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
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });
const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", { timeStyle: "short" });

/** Formats a log's shot time as `June 1, 2024 @ 2:30 PM` in the browser's time zone. */
const formatShotAt = (shotAt: string) => {
	const date = parseAbsolute(shotAt, TIME_ZONE).toDate();
	return `${DATE_FORMATTER.format(date)} @ ${TIME_FORMATTER.format(date)}`;
};

interface MetaItemProps {
	/** Leading decorative icon for the field. */
	icon: LucideIcon;
	/** Field value shown after the icon. */
	label: string;
}

/** One piece of row metadata (beans, machine, grinder, shot time) with its leading icon. */
const MetaItem = ({ icon: Icon, label }: MetaItemProps) => {
	return (
		<Text variant="caption" className="flex max-w-full min-w-0 items-center gap-1">
			<Icon className="size-3 shrink-0" />
			<span className="truncate">{label}</span>
		</Text>
	);
};

const RecipesListItem = ({ recipe }: { recipe: TRecipeGraph }) => {
	const name = recipe.name ?? "(Untitled)";

	return (
		<li className="flex items-center gap-3 py-2.5">
			<div className="min-w-0 flex-1">
				<Text variant="label" color="primary" className="truncate">
					{name}
				</Text>
				<Text variant="caption" className="mt-0.5 truncate font-mono">
					{recipe.snapshot.dose}g → {recipe.snapshot.yield}g · {recipe.snapshot.brewTime}
					{recipe.snapshot.brewTimeUnit}
				</Text>
				<div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-0.5">
					<MetaItem icon={Bean} label={recipe.snapshot.beans} />
					<MetaItem icon={Gauge} label={machineName(recipe.snapshot.machine)} />
					<MetaItem icon={Cog} label={grinderName(recipe.snapshot.grinder)} />
					{recipe.isQuickBrew ? (
						<MetaItem icon={Clock} label={formatShotAt(recipe.log.shotAt)} />
					) : null}
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-1">
				<Badge variant={recipe.isQuickBrew ? "outline" : "secondary"}>
					{recipe.isQuickBrew ? <FileText /> : <Fingerprint />}
					{recipe.isQuickBrew ? "Log" : "Recipe"}
				</Badge>
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
			</div>
		</li>
	);
};

/** The recipes index: quiet rows, one page of graphs at a time. */
export const RecipesList = ({ recipes }: { recipes: Array<TRecipeGraph> }) => {
	return (
		<ul>
			{recipes.map((recipe) => (
				<RecipesListItem key={recipe.id} recipe={recipe} />
			))}
		</ul>
	);
};
