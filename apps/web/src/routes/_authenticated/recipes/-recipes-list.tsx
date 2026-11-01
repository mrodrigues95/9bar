import { getRouteApi } from "@tanstack/react-router";
import { Bean, Cog, Fingerprint, Gauge, Scale } from "lucide-react";
import { useDeferredValue } from "react";
import { Badge, Text } from "@9bar/toolkit/components";
import { LogActionsMenu } from "../-recipe-actions/log-actions-menu";
import { RecipeActionsMenu } from "../-recipe-actions/recipe-actions-menu";
import {
	Link,
	List,
	ListLine,
	ListMeta,
	ListMetaItem,
	ListRow,
	ListRowActions,
	ListRowBody,
	ListRowHeading,
} from "../../../components";
import {
	RECIPE_STATUS_LABELS,
	VERDICT_LABELS,
	grinderName,
	machineName,
	type BrewSnapshot,
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
				<RecipeActionsMenu recipe={row.recipe} variant="row" />
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
				<LogActionsMenu
					log={row.log}
					kind={row.kind}
					label={
						row.kind === "attached-log"
							? `Actions for ${row.recipe.name}`
							: `Actions for ${UNTITLED_NAME}`
					}
				/>
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
