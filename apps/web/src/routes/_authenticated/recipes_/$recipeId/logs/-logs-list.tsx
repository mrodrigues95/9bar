import { getRouteApi } from "@tanstack/react-router";
import { Pin, Scale } from "lucide-react";
import { useDeferredValue } from "react";
import { Badge, Text } from "@9bar/toolkit/components";
import { LogActionsMenu } from "../../../-recipe-actions/log-actions-menu";
import {
	List,
	ListLine,
	ListMeta,
	ListMetaItem,
	ListRow,
	ListRowActions,
	ListRowBody,
	ListRowHeading,
} from "../../../../../components";
import { BREW_FIELD_ICONS } from "../../../../../utils/brew-fields";
import { VERDICT_LABELS, grinderName, machineName } from "../../../../../utils/data";
import type { Recipe } from "../../../../../utils/data";
import { formatBrewTime, formatGrams, formatShotAt } from "../../../../../utils/format";
import type { RecipeLogRow } from "./-recipe-logs-query";

const LogRow = ({ row, recipe }: { row: RecipeLogRow; recipe: Recipe }) => {
	const { log, snapshot, pinned } = row;
	const shotAt = formatShotAt(log.shotAt);

	return (
		<ListRow>
			<ListRowBody>
				<ListRowHeading>
					<Text variant="label" color="primary" className="truncate">
						{shotAt}
					</Text>
					{!!pinned && (
						<Badge variant="secondary">
							<Pin />
							Pinned
						</Badge>
					)}
					{!!log.verdict && <Badge variant="outline">{VERDICT_LABELS[log.verdict]}</Badge>}
				</ListRowHeading>
				<ListLine icon={Scale} mono>
					{formatGrams(snapshot.dose)} → {formatGrams(snapshot.yield)} · {formatBrewTime(snapshot)}
				</ListLine>
				<ListMeta>
					<ListMetaItem icon={BREW_FIELD_ICONS.beans} label={snapshot.beans} />
					<ListMetaItem icon={BREW_FIELD_ICONS.machine} label={machineName(snapshot.machine)} />
					<ListMetaItem icon={BREW_FIELD_ICONS.grinder} label={grinderName(snapshot.grinder)} />
				</ListMeta>
			</ListRowBody>
			<ListRowActions>
				<LogActionsMenu
					kind="attached-log"
					log={log}
					recipe={recipe}
					label={`Actions for log from ${shotAt}`}
				/>
			</ListRowActions>
		</ListRow>
	);
};

const routeApi = getRouteApi("/_authenticated/recipes_/$recipeId/logs");
const recipeRouteApi = getRouteApi("/_authenticated/recipes_/$recipeId");

export const RecipeLogsList = () => {
	const { items } = routeApi.useLoaderData();
	const { recipe } = recipeRouteApi.useLoaderData();
	const deferredItems = useDeferredValue(items);

	return (
		<List>
			{deferredItems.map((row) => (
				<LogRow key={row.log.id} row={row} recipe={recipe} />
			))}
		</List>
	);
};
