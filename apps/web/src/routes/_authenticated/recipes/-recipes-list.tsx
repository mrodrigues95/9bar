import { getRouteApi } from "@tanstack/react-router";
import {
	Bean,
	BookmarkPlus,
	Cog,
	Copy,
	EllipsisVertical,
	Fingerprint,
	Gauge,
	Paperclip,
	Pencil,
	Pin,
	Repeat,
	RotateCcw,
	Scale,
	Trash2,
	Unlink,
} from "lucide-react";
import { useDeferredValue, useState } from "react";
import {
	Badge,
	IconButton,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Text,
} from "@9bar/toolkit/components";
import {
	ConfirmDialog,
	Link,
	List,
	ListLine,
	ListMeta,
	ListMetaItem,
	ListRow,
	ListRowActions,
	ListRowBody,
	ListRowHeading,
	MenuItemLink,
} from "../../../components";
import {
	RECIPE_STATUS_LABELS,
	VERDICT_LABELS,
	grinderName,
	machineName,
	type BrewSnapshot,
	type Log,
	type Recipe,
} from "../../../utils/data";
import { formatBrewTime, formatGrams, formatShotAt } from "../../../utils/format";
import { ROW_KIND_NAMES, type RecipesListRow } from "./-recipes-query";

const UNTITLED_NAME = "(Untitled)";

type LogListRow = Extract<RecipesListRow, { kind: "attached-log" | "quick-log" }>;

const RowMeta = ({ snapshot }: { snapshot: BrewSnapshot }) => {
	return (
		<ListMeta>
			<ListMetaItem icon={Bean} label={snapshot.beans} />
			<ListMetaItem icon={Gauge} label={machineName(snapshot.machine)} />
			<ListMetaItem icon={Cog} label={grinderName(snapshot.grinder)} />
		</ListMeta>
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

const RecipeRowActions = ({ recipe }: { recipe: Recipe }) => {
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	return (
		<>
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

const AttachedLogRowActions = ({ log, name }: { log: Log; name: string }) => {
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	return (
		<>
			<MenuTrigger>
				<IconButton aria-label={`Actions for ${name}`} size="sm" variant="ghost">
					<EllipsisVertical />
				</IconButton>
				<Menu aria-label={`Actions for ${name}`} width="content">
					<MenuItemLink
						to="/recipes/logs/$logId/edit"
						params={{ logId: String(log.id) }}
						search
						textValue="Edit"
					>
						<Pencil className="size-3" />
						Edit
					</MenuItemLink>
					<MenuItem textValue="Set as reference shot">
						<Pin className="size-3" />
						Set as reference shot
					</MenuItem>
					<MenuItem textValue="Detach from recipe">
						<Unlink className="size-3" />
						Detach from recipe
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
				title="Delete this log?"
				description="This permanently removes the shot from your brew log. It can't be undone."
				confirmLabel="Delete"
				onConfirm={() => {
					// TODO: delete this log once the API is wired up.
				}}
			/>
		</>
	);
};

const QuickLogRowActions = ({ log }: { log: Log }) => {
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	return (
		<>
			<MenuTrigger>
				<IconButton aria-label={`Actions for ${UNTITLED_NAME}`} size="sm" variant="ghost">
					<EllipsisVertical />
				</IconButton>
				<Menu aria-label={`Actions for ${UNTITLED_NAME}`} width="content">
					<MenuItemLink
						to="/recipes/logs/$logId/edit"
						params={{ logId: String(log.id) }}
						search
						textValue="Edit"
					>
						<Pencil className="size-3" />
						Edit
					</MenuItemLink>
					<MenuItemLink
						to="/recipes/logs/$logId/repeat"
						params={{ logId: String(log.id) }}
						search
						textValue="Repeat"
					>
						<Repeat className="size-3" />
						Repeat
					</MenuItemLink>
					<MenuItem textValue="Save as recipe">
						<BookmarkPlus className="size-3" />
						Save as recipe
					</MenuItem>
					<MenuItem textValue="Attach to recipe">
						<Paperclip className="size-3" />
						Attach to recipe
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
				title="Delete this log?"
				description="This permanently removes the shot from your brew log. It can't be undone."
				confirmLabel="Delete"
				onConfirm={() => {
					// TODO: delete this log once the API is wired up.
				}}
			/>
		</>
	);
};

const DoseLine = ({ row, shotAt }: { row: RecipesListRow; shotAt?: string }) => {
	return (
		<ListLine icon={Scale} mono>
			{formatGrams(row.snapshot.dose)} → {formatGrams(row.snapshot.yield)} ·{" "}
			{formatBrewTime(row.snapshot)}
			{!!shotAt && ` · Logged ${formatShotAt(shotAt)}`}
		</ListLine>
	);
};

const RecipeRow = ({ row }: { row: Extract<RecipesListRow, { kind: "recipe" }> }) => {
	return (
		<ListRow>
			<ListRowBody>
				<ListRowHeading>
					<RowTitleLink recipeId={row.recipe.id} name={row.recipe.name} />
					<Badge variant="default">
						<Fingerprint />
						{ROW_KIND_NAMES.recipe}
					</Badge>
					<Badge variant="outline">{RECIPE_STATUS_LABELS[row.recipe.status]}</Badge>
				</ListRowHeading>
				<DoseLine row={row} />
				<RowMeta snapshot={row.snapshot} />
			</ListRowBody>
			<ListRowActions>
				<RecipeRowActions recipe={row.recipe} />
			</ListRowActions>
		</ListRow>
	);
};

const LogRow = ({ row }: { row: LogListRow }) => {
	return (
		<ListRow>
			<ListRowBody>
				<ListRowHeading>
					{row.kind === "attached-log" ? (
						<RowTitleLink recipeId={row.recipe.id} name={row.recipe.name} />
					) : (
						<Text variant="label" color="primary" className="truncate">
							{UNTITLED_NAME}
						</Text>
					)}
					<Badge variant="outline">{ROW_KIND_NAMES[row.kind]}</Badge>
					{!!row.log.verdict && (
						<Badge variant="secondary">{VERDICT_LABELS[row.log.verdict]}</Badge>
					)}
				</ListRowHeading>
				<DoseLine row={row} shotAt={row.log.shotAt} />
				<RowMeta snapshot={row.snapshot} />
			</ListRowBody>
			<ListRowActions>
				{row.kind === "attached-log" ? (
					<AttachedLogRowActions log={row.log} name={row.recipe.name} />
				) : (
					<QuickLogRowActions log={row.log} />
				)}
			</ListRowActions>
		</ListRow>
	);
};

const routeApi = getRouteApi("/_authenticated/recipes");

export const RecipesList = () => {
	const { items } = routeApi.useLoaderData();
	const deferredItems = useDeferredValue(items);

	return (
		<List>
			{deferredItems.map((row) =>
				row.kind === "recipe" ? (
					<RecipeRow key={row.key} row={row} />
				) : (
					<LogRow key={row.key} row={row} />
				),
			)}
		</List>
	);
};
