import { Copy, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { IconButton, Menu, MenuItem, MenuSeparator, MenuTrigger } from "@9bar/toolkit/components";
import { ConfirmDialog, MenuItemLink } from "../../../../components";
import type { RecipeGraph } from "../../../../utils/data";

const noop = () => {};

export const RecipeActions = ({ recipe }: { recipe: RecipeGraph }) => {
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	return (
		<>
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
					<MenuItem
						onAction={() => {
							setIsDeleteOpen(true);
						}}
						textValue="Delete"
					>
						<Trash2 className="size-3" />
						Delete
					</MenuItem>
				</Menu>
			</MenuTrigger>
			<ConfirmDialog
				isOpen={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				title={`Delete ${recipe.name}?`}
				description="This permanently deletes the recipe and its logs. It can't be undone."
				confirmLabel="Delete"
				onConfirm={() => {
					// TODO: delete this recipe once the API is wired up.
				}}
			/>
		</>
	);
};
