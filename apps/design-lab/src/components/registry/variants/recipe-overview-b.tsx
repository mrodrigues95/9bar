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

const SUMMARY_STATS = [
	{ id: "dose", label: "Dose", value: "18g" },
	{ id: "yield", label: "Yield", value: "36g" },
	{ id: "time", label: "Time", value: "28s" },
	{ id: "temp", label: "Temp", value: "93°C" },
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

export const RecipeOverviewB = () => {
	return (
		<section aria-labelledby="recipe-overview-b-title" className="mx-auto w-full max-w-5xl">
			<Text variant="caption">Recipes / Morning Espresso</Text>
			<Heading as="h1" variant="title" id="recipe-overview-b-title" className="mt-1">
				Morning Espresso
			</Heading>
			<Text variant="body-sm" color="secondary" className="mt-0.5">
				Sunset Roast Espresso Blend · Rancilio Silvia · Eureka Mignon
			</Text>

			<div className="mt-4 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
				<aside aria-label="Recipe summary">
					<Card className="lg:sticky lg:top-4">
						<CardHeader>
							<div className="flex flex-wrap gap-1.5">
								<Badge variant="secondary">Recipe</Badge>
								<Badge variant="outline">Dialed in</Badge>
							</div>
							<CardTitle>Morning Espresso</CardTitle>
							<Text variant="body-sm" color="secondary">
								Sunset Roast Espresso Blend · Medium-Dark
							</Text>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<dl className="grid grid-cols-3 gap-2 border-y border-border py-3 text-center font-mono">
								{SUMMARY_STATS.map((stat) => (
									<div key={stat.id} className="flex flex-col-reverse">
										<Text as="dt" variant="caption" color="muted">
											{stat.label}
										</Text>
										<Text as="dd" variant="body-sm" color="primary" className="font-semibold">
											{stat.value}
										</Text>
									</div>
								))}
							</dl>
							<div className="flex flex-col gap-1">
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
									<span className="truncate">Eureka Mignon · 6</span>
								</Text>
							</div>
							<div className="flex flex-col gap-2">
								<Button variant="outline" className="w-full">
									<Pencil aria-hidden="true" />
									Edit recipe
								</Button>
								<Button variant="destructive" className="w-full">
									<Trash2 aria-hidden="true" />
									Delete recipe
								</Button>
							</div>
						</CardContent>
					</Card>
				</aside>

				<Tabs defaultSelectedKey="overview">
					<TabsList aria-label="Recipe sections">
						<TabsTrigger id="overview">Overview</TabsTrigger>
						<TabsTrigger id="logs">Logs · 3</TabsTrigger>
					</TabsList>
					<TabsContent id="overview" className="mt-4 flex flex-col gap-4">
						<Card>
							<CardHeader>
								<CardTitle>Brew parameters</CardTitle>
							</CardHeader>
							<CardContent>
								<dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
									{SUMMARY_STATS.map((stat) => (
										<div key={stat.id}>
											<Text as="dt" variant="caption" color="muted">
												{stat.label}
											</Text>
											<Text as="dd" variant="body-sm" color="primary" className="font-mono font-semibold">
												{stat.value}
											</Text>
										</div>
									))}
								</dl>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Notes</CardTitle>
							</CardHeader>
							<CardContent>
								<Text as="p" variant="body" color="secondary">
									Sweet caramel aroma, balanced acidity. Grind 6 on the Mignon, 3s
									pre-infusion.
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
			</div>
		</section>
	);
};
