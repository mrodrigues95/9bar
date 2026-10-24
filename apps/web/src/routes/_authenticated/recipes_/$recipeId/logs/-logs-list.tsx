import { getRouteApi } from "@tanstack/react-router";
import {
	Bean,
	Cog,
	EllipsisVertical,
	Gauge,
	Pencil,
	Pin,
	Scale,
	Trash2,
	Unlink,
} from "lucide-react";
import { useDeferredValue } from "react";
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
	List,
	ListLine,
	ListMeta,
	ListMetaItem,
	ListRow,
	ListRowActions,
	ListRowBody,
	ListRowHeading,
} from "../../../../../components";
import { VERDICT_LABELS, grinderName, machineName } from "../../../../../utils/data";
import { formatBrewTime, formatGrams, formatShotAt } from "../../../../../utils/format";
import type { RecipeLogRow } from "./-recipe-logs-query";

const noop = () => {};

const LogRow = ({ row }: { row: RecipeLogRow }) => {
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
					<ListMetaItem icon={Bean} label={snapshot.beans} />
					<ListMetaItem icon={Gauge} label={machineName(snapshot.machine)} />
					<ListMetaItem icon={Cog} label={grinderName(snapshot.grinder)} />
				</ListMeta>
			</ListRowBody>
			<ListRowActions>
				<MenuTrigger>
					<IconButton aria-label={`Actions for log from ${shotAt}`} size="sm" variant="ghost">
						<EllipsisVertical />
					</IconButton>
					<Menu
						aria-label={`Actions for log from ${shotAt}`}
						placement="bottom end"
						width="content"
					>
						<MenuItem onAction={noop} textValue="Edit log">
							<Pencil className="size-3" />
							Edit log
						</MenuItem>
						<MenuItem onAction={noop} textValue="Set as reference shot">
							<Pin className="size-3" />
							Set as reference shot
						</MenuItem>
						<MenuItem onAction={noop} textValue="Detach from recipe">
							<Unlink className="size-3" />
							Detach from recipe
						</MenuItem>
						<MenuSeparator />
						<MenuItem onAction={noop} variant="destructive" textValue="Delete log">
							<Trash2 className="size-3" />
							Delete log
						</MenuItem>
					</Menu>
				</MenuTrigger>
			</ListRowActions>
		</ListRow>
	);
};

const routeApi = getRouteApi("/_authenticated/recipes_/$recipeId/logs");

export const RecipeLogsList = () => {
	const { items } = routeApi.useLoaderData();
	const deferredItems = useDeferredValue(items);

	return (
		<List>
			{deferredItems.map((row) => (
				<LogRow key={row.log.id} row={row} />
			))}
		</List>
	);
};
