import { Copy, Ellipsis, Fingerprint, Pencil, Trash2 } from "lucide-react";
import {
	Badge,
	Heading,
	IconButton,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Text,
} from "@9bar/toolkit/components";
import { MenuItemLink } from "../../../../components";
import { RECIPE_STATUS_LABELS, type RecipeGraph } from "../../../../utils/data";

const noop = () => {};

export const RecipeHeader = ({ recipe }: { recipe: RecipeGraph }) => {
	return (
		<div className="flex flex-wrap items-start justify-between gap-3">
			<div>
				<Heading as="h1" variant="title">
					{recipe.name}
				</Heading>
				<Text variant="body-sm" color="secondary" className="mt-0.5">
					{recipe.snapshot.beans}
				</Text>
				<div className="mt-2 flex flex-wrap items-center gap-2">
					<Badge variant="secondary">
						<Fingerprint className="size-3" />
						Recipe
					</Badge>
					<Badge variant="outline">{RECIPE_STATUS_LABELS[recipe.status]}</Badge>
				</div>
			</div>
			<MenuTrigger>
				<IconButton aria-label={`Actions for ${recipe.name}`} size="sm" variant="ghost">
					<Ellipsis />
				</IconButton>
				<Menu aria-label={`Actions for ${recipe.name}`} placement="bottom end" width="content">
					<MenuItemLink
						to="/recipes/$recipeId/edit"
						params={{ recipeId: String(recipe.id) }}
						textValue="Edit"
					>
						<Pencil className="size-3" />
						Edit
					</MenuItemLink>
					<MenuItem onAction={noop} textValue="Duplicate">
						<Copy className="size-3" />
						Duplicate
					</MenuItem>
					<MenuSeparator />
					<MenuItem onAction={noop} variant="destructive" textValue="Delete">
						<Trash2 className="size-3" />
						Delete
					</MenuItem>
				</Menu>
			</MenuTrigger>
		</div>
	);
};
