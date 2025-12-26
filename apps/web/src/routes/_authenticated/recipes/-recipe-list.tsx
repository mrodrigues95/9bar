import {
	IconButton,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Text,
} from "@9bar/toolkit";
import {
	ArrowRightIcon,
	EllipsisVerticalIcon,
	FingerPrintIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";

const RecipeListItem = () => {
	return (
		<li className="flex items-center justify-between py-1.5">
			<div className="flex flex-col">
				<Text
					variant="body-sm"
					className="flex items-center gap-1 text-blue-900"
				>
					<FingerPrintIcon className="size-4" />
					La Marzocco Linea Mini · Eureka Atom
				</Text>
				<Text variant="body-sm" className="font-medium text-slate-950">
					Slow Bloom
				</Text>
				<Text variant="body-sm" className="text-xs">
					18g → 36g · 22s
				</Text>
			</div>
			<MenuTrigger>
				<IconButton aria-label="Actions" size="md" variant="ghost">
					<EllipsisVerticalIcon />
				</IconButton>
				<Menu>
					<MenuItem onAction={() => alert("open")}>
						<ArrowRightIcon className="size-3" />
						View
					</MenuItem>
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
		</li>
	);
};

export const RecipeList = () => {
	return (
		<ul className="divide-y divide-slate-950/10">
			<RecipeListItem />
			<RecipeListItem />
		</ul>
	);
};
