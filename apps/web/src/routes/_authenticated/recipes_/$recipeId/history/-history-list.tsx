import { getRouteApi } from "@tanstack/react-router";
import {
	ArrowRight,
	Bean,
	Coffee,
	Cog,
	Droplets,
	Factory,
	Gauge,
	Scale,
	Tag,
	Thermometer,
	Timer,
	Wrench,
	type LucideIcon,
} from "lucide-react";
import { Fragment, useDeferredValue } from "react";
import { Text } from "@9bar/toolkit/components";
import {
	HISTORY_FIELD_LABELS,
	type HistoryEvent,
	type HistoryField,
} from "../../-recipe-history/history-events";
import { formatShotAt } from "../../../../../utils/format";

const HISTORY_FIELD_ICONS: Record<HistoryField, LucideIcon> = {
	method: Coffee,
	beans: Bean,
	machine: Factory,
	grinder: Wrench,
	grindSize: Cog,
	dose: Scale,
	yield: Droplets,
	brewTime: Timer,
	temperature: Thermometer,
	pressure: Gauge,
};

const HistoryRow = ({ event }: { event: HistoryEvent }) => {
	return (
		<li className="py-3">
			<dl className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3">
				{event.changes.map((change) => {
					const FieldIcon = HISTORY_FIELD_ICONS[change.field] ?? Tag;
					return (
						<Fragment key={change.field}>
							<dt className="flex min-w-0 items-center gap-1.5">
								<FieldIcon className="size-3.5 shrink-0 text-muted-foreground" />
								<Text variant="caption" color="muted" className="truncate font-medium">
									{HISTORY_FIELD_LABELS[change.field]}
								</Text>
							</dt>
							<dd className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
								<span className="sr-only">changed from </span>
								<Text
									as="del"
									variant="body-sm"
									className="font-mono text-destructive line-through"
								>
									{change.previous}
								</Text>
								<ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
								<span className="sr-only">to </span>
								<Text
									as="ins"
									variant="body-sm"
									className="font-mono text-green-700 no-underline dark:text-green-400"
								>
									{change.next}
								</Text>
							</dd>
						</Fragment>
					);
				})}
			</dl>
			<time
				dateTime={event.dateTime}
				className="mt-1.5 block text-xs leading-normal text-muted-foreground italic"
			>
				Edited {formatShotAt(event.dateTime)}
			</time>
		</li>
	);
};

const routeApi = getRouteApi("/_authenticated/recipes_/$recipeId/history");

export const RecipeHistoryList = () => {
	const { items } = routeApi.useLoaderData();
	const deferredItems = useDeferredValue(items);

	return (
		<ul className="divide-y divide-border">
			{deferredItems.map((event) => (
				<HistoryRow key={event.id} event={event} />
			))}
		</ul>
	);
};
