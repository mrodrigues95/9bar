import {
	IconButton,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Text,
} from "@9bar/toolkit";
import {
	EllipsisVerticalIcon,
	FingerPrintIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import { Link } from "../../../components";

const RecipeListItem = ({ recipe }: { recipe: (typeof recipes)[number] }) => {
	return (
		<li className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
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
			<div className="flex items-center gap-0.5">
				<Link to="/recipes/$recipeId" params={{ recipeId: recipe.id }}>
					View recipe
				</Link>
				<MenuTrigger>
					<IconButton aria-label="Actions" size="sm" variant="ghost">
						<EllipsisVerticalIcon />
					</IconButton>
					<Menu>
						<MenuItem onAction={() => alert("rename")}>
							<PencilIcon className="size-3" />
							Edit
						</MenuItem>
						<MenuSeparator />
						<MenuItem onAction={() => alert("delete")} variant="danger">
							<TrashIcon className="size-3" />
							Delete
						</MenuItem>
					</Menu>
				</MenuTrigger>
			</div>
		</li>
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
	},
];

export const RecipeList = () => {
	return (
		<ul className="divide-y divide-slate-950/10">
			{recipes.map((recipe) => (
				<RecipeListItem key={recipe.id} recipe={recipe} />
			))}
		</ul>
	);
};
