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
	type LucideIcon,
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
import { VERDICT_LABELS, grinderName, machineName } from "../../../../../utils/data";
import { formatBrewTime, formatGrams, formatShotAt } from "../../../../../utils/format";
import type { RecipeLogRow } from "./-recipe-logs-query";

const noop = () => {};

const LogRowMetaItem = ({ icon: Icon, label }: { icon: LucideIcon; label: string }) => {
	return (
		<Text variant="caption" className="flex max-w-full min-w-0 items-center gap-1">
			<Icon className="size-3 shrink-0" />
			<span className="truncate">{label}</span>
		</Text>
	);
};

const LogRow = ({ row }: { row: RecipeLogRow }) => {
	const { log, snapshot, pinned } = row;
	const shotAt = formatShotAt(log.shotAt);

	return (
		<li className="flex items-center gap-3 py-2.5">
			<div className="min-w-0 flex-1">
				<div className="flex min-w-0 items-center gap-2">
					<Text variant="label" color="primary" className="truncate">
						{shotAt}
					</Text>
					{pinned && (
						<Badge variant="secondary">
							<Pin />
							Pinned
						</Badge>
					)}
					{log.verdict && <Badge variant="outline">{VERDICT_LABELS[log.verdict]}</Badge>}
				</div>
				<Text variant="caption" className="mt-0.5 flex min-w-0 items-center gap-1 font-mono">
					<Scale className="size-3 shrink-0" />
					<span className="truncate">
						{formatGrams(snapshot.dose)} → {formatGrams(snapshot.yield)} ·{" "}
						{formatBrewTime(snapshot)}
					</span>
				</Text>
				<div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-0.5">
					<LogRowMetaItem icon={Bean} label={snapshot.beans} />
					<LogRowMetaItem icon={Gauge} label={machineName(snapshot.machine)} />
					<LogRowMetaItem icon={Cog} label={grinderName(snapshot.grinder)} />
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-1">
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
			</div>
		</li>
	);
};

const routeApi = getRouteApi("/_authenticated/recipes_/$recipeId/logs");

export const RecipeLogsList = () => {
	const { items } = routeApi.useLoaderData();
	const deferredItems = useDeferredValue(items);

	return (
		<ul className="divide-y divide-border">
			{deferredItems.map((row) => (
				<LogRow key={row.log.id} row={row} />
			))}
		</ul>
	);
};
