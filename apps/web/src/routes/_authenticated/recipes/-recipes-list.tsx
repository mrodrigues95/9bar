import {
	Badge,
	IconButton,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Text,
} from "@9bar/toolkit";
import {
	ArrowRightIcon,
	ArrowsRightLeftIcon,
	EllipsisVerticalIcon,
	FingerPrintIcon,
	PaperClipIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import { List, ListItem, MenuItemLink } from "../../../components";
import {
	grinderOptions,
	machineOptions,
	recipes,
	type TRecipe,
} from "../../../utils/data";

const RecipesListItem = ({ recipe }: { recipe: TRecipe }) => {
	const machine = machineOptions.find((m) => m.id === recipe.machine);
	const grinder = grinderOptions.find((g) => g.id === recipe.grinder);
	if (!machine || !grinder) {
		throw new Error(`Machine or grinder not found for recipe ${recipe.name}`);
	}

	return (
		<ListItem className="justify-between">
			<div className="flex flex-col">
				<Text
					variant="body-sm"
					className="flex items-center gap-1 text-blue-950"
				>
					<FingerPrintIcon className="size-4" />
					{machine.name} · {grinder.name}
				</Text>
				<Text variant="body-sm" className="font-medium" color="primary">
					{recipe.name}
				</Text>
				<Text variant="body-sm" className="text-xs">
					{recipe.beans}
				</Text>
				<Text variant="body-sm" className="text-xs">
					{recipe.dose} → {recipe.yield} · {recipe.brewTime}
				</Text>
			</div>
			<div className="flex items-center gap-1">
				<Badge variant={recipe.isQuickLog ? "warning" : "success"} size="xs">
					{recipe.isQuickLog ? "Quick Log" : "Recipe"}
				</Badge>
				<MenuTrigger>
					<IconButton aria-label="Actions" size="sm" variant="ghost">
						<EllipsisVerticalIcon />
					</IconButton>
					<Menu>
						{!recipe.isQuickLog && (
							<MenuItemLink
								to="/recipes/$recipeId"
								params={{ recipeId: recipe.id }}
							>
								<ArrowRightIcon className="size-3" />
								View
							</MenuItemLink>
						)}
						{!recipe.isQuickLog && (
							<MenuItemLink
								to="/recipes/$recipeId/edit"
								params={{ recipeId: recipe.id }}
							>
								<PencilIcon className="size-3" />
								Edit
							</MenuItemLink>
						)}
						{recipe.isQuickLog && (
							<MenuItemLink
								to="/recipes/$recipeId/edit"
								params={{ recipeId: recipe.id }}
								search={{ convert: "log" }}
							>
								<ArrowsRightLeftIcon className="size-3" />
								Convert to Recipe
							</MenuItemLink>
						)}
						{recipe.isQuickLog && (
							<MenuItem onAction={() => alert("rename")}>
								<PaperClipIcon className="size-3" />
								Attach to Recipe
							</MenuItem>
						)}
						<MenuSeparator />
						<MenuItem onAction={() => alert("delete")} variant="danger">
							<TrashIcon className="size-3" />
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
