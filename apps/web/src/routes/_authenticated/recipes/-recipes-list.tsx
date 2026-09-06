import { parseAbsolute } from "@internationalized/date";
import {
	ArrowRight,
	ArrowRightLeft,
	EllipsisVertical,
	FileText,
	Fingerprint,
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
import { List, ListItem, MenuItemLink } from "../../../components";
import { GRINDER_OPTIONS, MACHINE_OPTIONS, recipes, type TRecipeGraph } from "../../../utils/data";

const formatShotAt = (shotAt: string) => {
	const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const date = parseAbsolute(shotAt, tz).toDate();
	const datePart = new Intl.DateTimeFormat("en-US", {
		dateStyle: "long",
	}).format(date);
	const timePart = new Intl.DateTimeFormat("en-US", {
		timeStyle: "short",
	}).format(date);
	return `${datePart} @ ${timePart}`;
};

const RecipesListItem = ({ recipe }: { recipe: TRecipeGraph }) => {
	const machine = MACHINE_OPTIONS.find((m) => m.id === recipe.snapshot.machine);
	const grinder = GRINDER_OPTIONS.find((g) => g.id === recipe.snapshot.grinder);
	if (!machine || !grinder) {
		throw new Error(`Machine or grinder not found for recipe ${recipe.name}`);
	}

	return (
		<ListItem className="justify-between">
			<div className="flex flex-col">
				<Text variant="body-sm" className="flex items-center gap-1 text-blue-950">
					<Fingerprint className="size-4" />
					{machine.name} · {grinder.name}
				</Text>
				{!recipe.isQuickBrew && (
					<Text variant="body-sm" className="font-medium" color="primary">
						{recipe.name ?? "(Untitled)"}
					</Text>
				)}
				<Text variant="body-sm" className="text-xs">
					{recipe.snapshot.beans}
				</Text>
				<Text variant="body-sm" className="text-xs">
					{recipe.snapshot.dose}g → {recipe.snapshot.yield}g · {recipe.snapshot.brewTime}
					{recipe.snapshot.brewTimeUnit}
				</Text>
				{recipe.isQuickBrew && (
					<Text variant="body-sm" className="text-xs">
						{formatShotAt(recipe.log.shotAt)}
					</Text>
				)}
			</div>
			<div className="flex items-center gap-1">
				<Badge variant="outline">
					{recipe.isQuickBrew ? <FileText /> : <Fingerprint />}
					{recipe.isQuickBrew ? "Log" : "Recipe"}
				</Badge>
				<MenuTrigger>
					<IconButton aria-label="Actions" size="sm" variant="ghost">
						<EllipsisVertical />
					</IconButton>
					<Menu>
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
		</ListItem>
	);
};

export const RecipesList = () => {
	return (
		<List>
			{recipes.map((recipe) => (
				<RecipesListItem key={recipe.id} recipe={recipe} />
			))}
		</List>
	);
};
