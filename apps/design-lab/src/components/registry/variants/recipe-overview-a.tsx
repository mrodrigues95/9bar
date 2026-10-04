import { Bean, Cog, Gauge, Pencil, Plus, Scale, Trash2 } from "lucide-react";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	Heading,
	IconButton,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Text,
} from "@9bar/toolkit/components";

const LOGS = [
	{
		id: 1,
		shotAt: "Jun 3, 2024 @ 7:55 AM",
		dose: 18,
		yield: 36,
		time: "28s",
		note: "Sweet, balanced. Keeper.",
	},
	{
		id: 2,
		shotAt: "Jun 2, 2024 @ 7:40 AM",
		dose: 18,
		yield: 38,
		time: "27s",
		note: "Slightly fast, thin body.",
	},
	{
		id: 3,
		shotAt: "Jun 1, 2024 @ 12:05 PM",
		dose: 17.5,
		yield: 35,
		time: "30s",
		note: "First dial-in, sour edge.",
	},
];

const STATS = [
	{ id: "dose", label: "Dose", value: "18g" },
	{ id: "yield", label: "Yield", value: "36g" },
	{ id: "time", label: "Time", value: "28s" },
	{ id: "temp", label: "Temp", value: "93°C" },
];

const DETAILS = [
	{ id: "beans", label: "Beans", value: "Sunset Roast Espresso Blend" },
	{ id: "roast", label: "Roast", value: "Medium-Dark" },
	{ id: "machine", label: "Machine", value: "Rancilio Silvia" },
	{ id: "grinder", label: "Grinder", value: "Eureka Mignon · 6" },
	{ id: "ratio", label: "Ratio", value: "1:2" },
	{ id: "pressure", label: "Pressure", value: "9 bar" },
];

const LogRow = ({ log }: { log: (typeof LOGS)[number] }) => {
	return (
		<li className="flex items-center gap-3 py-2.5">
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
						<span className="truncate">Sunset Roast Espresso Blend</span>
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
				<Text variant="caption" className="mt-0.5 truncate">
					{log.note}
				</Text>
			</div>
			<div className="flex shrink-0 items-center gap-1">
				<Badge variant="outline">Log</Badge>
				<IconButton aria-label={`Edit log from ${log.shotAt}`} size="sm" variant="ghost">
					<Pencil aria-hidden="true" />
				</IconButton>
				<IconButton aria-label={`Delete log from ${log.shotAt}`} size="sm" variant="ghost">
					<Trash2 aria-hidden="true" />
				</IconButton>
			</div>
		</li>
	);
};

export const RecipeOverviewA = () => {
	return (
		<section aria-labelledby="recipe-overview-a-title" className="mx-auto w-full max-w-5xl">
			<Text variant="caption">Recipes / Morning Espresso</Text>
			<div className="mt-1 flex flex-wrap items-start justify-between gap-3">
				<div>
					<Heading as="h1" variant="title" id="recipe-overview-a-title">
						Morning Espresso
					</Heading>
					<Text variant="body-sm" color="secondary" className="mt-0.5">
						Sunset Roast Espresso Blend
					</Text>
					<div className="mt-2 flex flex-wrap gap-1.5">
						<Badge variant="secondary">Recipe</Badge>
						<Badge variant="outline">Dialed in</Badge>
					</div>
				</div>
				<div className="flex gap-2">
					<Button variant="outline">
						<Pencil aria-hidden="true" />
						Edit
					</Button>
					<Button variant="destructive">
						<Trash2 aria-hidden="true" />
						Delete
					</Button>
				</div>
			</div>

			<Tabs defaultSelectedKey="overview" className="mt-4">
				<TabsList aria-label="Recipe sections">
					<TabsTrigger id="overview">Overview</TabsTrigger>
					<TabsTrigger id="logs">Logs · 3</TabsTrigger>
				</TabsList>
				<TabsContent id="overview" className="mt-4 flex flex-col gap-4">
					<Card>
						<CardContent>
							<dl className="grid grid-cols-4 place-items-center py-2 text-center font-mono">
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
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Details</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-1.5">
							<dl className="flex flex-col gap-1.5">
								{DETAILS.map((detail) => (
									<div key={detail.id} className="flex w-full gap-1">
										<Text as="dt" variant="body-sm" color="primary" className="font-medium">
											{detail.label}:
										</Text>
										<Text as="dd" variant="body-sm" color="secondary">
											{detail.value}
										</Text>
									</div>
								))}
							</dl>
							<Text as="p" variant="body" color="secondary" className="border-t border-border pt-3">
								Sweet caramel aroma, balanced acidity.
							</Text>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent id="logs" className="mt-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between gap-4">
							<CardTitle>Logs · 3 shots</CardTitle>
							<Button size="sm">
								<Plus aria-hidden="true" />
								New Log
							</Button>
						</CardHeader>
						<CardContent>
							<ul className="divide-y divide-border">
								{LOGS.map((log) => (
									<LogRow key={log.id} log={log} />
								))}
							</ul>
						</CardContent>
						<CardFooter className="flex items-center justify-center gap-1 border-t border-t-border pt-4">
							<Button size="sm" variant="outline" aria-current="page" aria-label="Page 1">
								1
							</Button>
							<Button size="sm" variant="ghost" aria-label="Page 2">
								2
							</Button>
							<Button size="sm" variant="ghost" aria-label="Next page">
								Next
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</section>
	);
};
