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
	TrashIcon,
} from "@heroicons/react/24/solid";
import { List, ListItem, MenuItemLink } from "../../../components";

const RecipesListItem = ({ recipe }: { recipe: (typeof recipes)[number] }) => {
	return (
		<ListItem className="justify-between">
			<div className="flex flex-col">
				<Text
					variant="body-sm"
					className="flex items-center gap-1 text-blue-950"
				>
					<FingerPrintIcon className="size-4" />
					{recipe.device} · {recipe.grinder}
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
						<MenuItemLink
							to="/recipes/$recipeId"
							params={{ recipeId: recipe.id }}
						>
							<ArrowRightIcon className="size-3" />
							View
						</MenuItemLink>
						{recipe.isQuickLog && (
							<MenuItem onAction={() => alert("rename")}>
								<ArrowsRightLeftIcon className="size-3" />
								Convert to Recipe
							</MenuItem>
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

const recipes = [
	{
		id: "1",
		name: "Ethiopian Yirgacheffe",
		device: "Gaggia Classic Pro",
		grinder: "Baratza Encore",
		brewTime: "22s",
		dose: "18g",
		yield: "36g",
		beans: 'Kicking Horse Coffee - "Three Sisters"',
		temperature: "205°F",
		pressure: "9 bar",
		notes: "Fruity and bright with floral notes.",
		isQuickLog: false,
		quickLogs: [],
	},
	{
		id: "2",
		name: "Colombian Supremo",
		device: "La Marzocco Linea Mini",
		grinder: "Hario Skerton",
		brewTime: "31s",
		dose: "20g",
		yield: "40g",
		beans: "Stumptown - Hair Bender",
		temperature: "200°F",
		pressure: "9 bar",
		notes: "Rich and chocolatey with a smooth finish.",
		isQuickLog: true,
		quickLogs: [],
	},
];

export const RecipesList = () => {
	return (
		<List>
			{recipes.map((recipe) => (
				<RecipesListItem key={recipe.id} recipe={recipe} />
			))}
		</List>
	);
};
