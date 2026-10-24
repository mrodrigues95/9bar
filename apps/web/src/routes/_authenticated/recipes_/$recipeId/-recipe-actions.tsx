import { Copy, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { IconButton, Menu, MenuItem, MenuSeparator, MenuTrigger } from "@9bar/toolkit/components";
import { MenuItemLink } from "../../../../components";
import type { RecipeGraph } from "../../../../utils/data";

const noop = () => {};

export const RecipeActions = ({ recipe }: { recipe: RecipeGraph }) => {
	return (
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
	);
};
