import { Bean, Cog, Gauge, Pencil, Plus, Scale, Search, Tags, Trash2 } from "lucide-react";
import {
	Badge,
	Button,
	Heading,
	IconButton,
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	Separator,
	Text,
} from "@9bar/toolkit/components";
import { FilterBar, type FilterBarDefinition } from "@9bar/toolkit/components/composed";
import { RecipeModalShell } from "./_local/recipe-modal-shell";

const LOG_FILTER_DEFINITIONS: ReadonlyArray<FilterBarDefinition> = [
	{
		id: "outcome",
		label: "Outcome",
		icon: <Tags />,
		pluralLabel: "outcomes",
		operators: [
			{ id: "is", label: "is" },
			{ id: "is-not", label: "is not" },
		],
		defaultOperatorId: "is",
		options: [
			{ id: "keeper", label: "Keeper" },
			{ id: "sweet", label: "Sweet" },
			{ id: "balanced", label: "Balanced" },
			{ id: "sour", label: "Sour" },
			{ id: "thin", label: "Thin" },
		],
	},
];

const LOGS = [
	{
		id: 1,
		shotAt: "Jun 3, 2024 @ 7:55 AM",
		dose: 18,
		yield: 36,
		time: "28s",
		outcome: "Keeper",
		note: "Sweet, balanced. Keeper.",
	},
	{
		id: 2,
		shotAt: "Jun 2, 2024 @ 7:40 AM",
		dose: 18,
		yield: 38,
		time: "27s",
		outcome: "Thin",
		note: "Slightly fast, thin body.",
	},
	{
		id: 3,
		shotAt: "Jun 1, 2024 @ 12:05 PM",
		dose: 17.5,
		yield: 35,
		time: "30s",
		outcome: "Sour",
		note: "First dial-in, sour edge.",
	},
];

const STATS = [
	{ id: "dose", label: "Dose", value: "18g" },
	{ id: "yield", label: "Yield", value: "36g" },
	{ id: "time", label: "Time", value: "28s" },
	{ id: "temp", label: "Temp", value: "93°C" },
];

export const RecipeModalA = () => {
	return (
		<RecipeModalShell labelledBy="recipe-modal-a-title">
			<div className="flex items-start justify-between gap-3 pr-8">
				<div>
					<div className="flex flex-wrap gap-1.5">
						<Badge variant="secondary">Recipe</Badge>
						<Badge variant="outline">Dialed in</Badge>
					</div>
					<Heading as="h2" variant="title" id="recipe-modal-a-title" className="mt-2">
						Morning Espresso
					</Heading>
					<Text variant="body-sm" color="secondary" className="mt-0.5">
						Sunset Roast Espresso Blend · Medium-Dark
					</Text>
				</div>
				<div className="flex shrink-0 gap-2">
					<Button variant="outline" size="sm">
						<Pencil aria-hidden="true" />
						Edit
					</Button>
					<Button variant="destructive" size="sm">
						<Trash2 aria-hidden="true" />
						Delete
					</Button>
				</div>
			</div>

			<dl className="mt-4 grid grid-cols-4 place-items-center rounded-lg bg-muted/60 py-2 text-center font-mono">
				{STATS.map((stat) => (
					<div key={stat.id} className="flex flex-col-reverse">
						<Text as="dt" variant="body-sm" color="muted">
							{stat.label}
						</Text>
						<Text as="dd" variant="body-sm" color="secondary" className="font-semibold">
							{stat.value}
						</Text>
					</div>
				))}
			</dl>

			<dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5">
				{[
					{ id: "machine", label: "Machine", value: "Rancilio Silvia" },
					{ id: "grinder", label: "Grinder", value: "Eureka Mignon · 6" },
					{ id: "ratio", label: "Ratio", value: "1:2" },
					{ id: "pressure", label: "Pressure", value: "9 bar" },
				].map((detail) => (
					<div key={detail.id} className="flex gap-1">
						<Text as="dt" variant="body-sm" color="primary" className="font-medium">
							{detail.label}:
						</Text>
						<Text as="dd" variant="body-sm" color="secondary">
							{detail.value}
						</Text>
					</div>
				))}
			</dl>
			<Text as="p" variant="body" color="secondary" className="mt-3">
				Sweet caramel aroma, balanced acidity.
			</Text>

			<Separator className="my-4" />

			<div className="flex items-center justify-between gap-3">
				<Heading as="h3" variant="section">
					Logs · 3 shots
				</Heading>
				<Button size="sm">
					<Plus aria-hidden="true" />
					New Log
				</Button>
			</div>
			<div className="mt-3 flex flex-col gap-2">
				<InputGroup>
					<InputGroupAddon>
						<Search aria-hidden="true" />
					</InputGroupAddon>
					<InputGroupInput placeholder="Search logs…" aria-label="Search logs" />
				</InputGroup>
				<FilterBar definitions={LOG_FILTER_DEFINITIONS} aria-label="Log filters" />
			</div>
			<ul className="mt-2 divide-y divide-border">
				{LOGS.map((log) => (
					<li key={log.id} className="flex items-center gap-3 py-2.5">
						<div className="min-w-0 flex-1">
							<Text variant="label" color="primary" className="truncate">
								{log.shotAt}
							</Text>
							<Text variant="caption" className="mt-0.5 flex min-w-0 items-center gap-1 font-mono">
								<Scale className="size-3 shrink-0" aria-hidden="true" />
								<span className="truncate">
									{log.dose}g → {log.yield}g · {log.time}
								</span>
							</Text>
							<div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-0.5">
								<Text variant="caption" className="flex items-center gap-1">
									<Bean className="size-3 shrink-0" aria-hidden="true" />
									<span className="truncate">Sunset Roast Blend</span>
								</Text>
								<Text variant="caption" className="flex items-center gap-1">
									<Gauge className="size-3 shrink-0" aria-hidden="true" />
									<span className="truncate">Rancilio Silvia</span>
								</Text>
								<Text variant="caption" className="flex items-center gap-1">
									<Cog className="size-3 shrink-0" aria-hidden="true" />
									<span className="truncate">Eureka Mignon</span>
								</Text>
							</div>
						</div>
						<div className="flex shrink-0 items-center gap-1">
							<Badge variant="outline">{log.outcome}</Badge>
							<IconButton aria-label={`Edit log from ${log.shotAt}`} size="sm" variant="ghost">
								<Pencil aria-hidden="true" />
							</IconButton>
							<IconButton aria-label={`Delete log from ${log.shotAt}`} size="sm" variant="ghost">
								<Trash2 aria-hidden="true" />
							</IconButton>
						</div>
					</li>
				))}
			</ul>
			<div className="flex items-center justify-center gap-1 border-t border-t-border pt-4">
				<Button size="sm" variant="outline" aria-current="page" aria-label="Page 1">
					1
				</Button>
				<Button size="sm" variant="ghost" aria-label="Page 2">
					2
				</Button>
				<Button size="sm" variant="ghost" aria-label="Next page">
					Next
				</Button>
			</div>
		</RecipeModalShell>
	);
};
