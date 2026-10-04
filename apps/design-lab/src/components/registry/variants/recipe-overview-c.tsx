import {
	Bean,
	Cog,
	EllipsisVertical,
	Gauge,
	Pencil,
	Plus,
	Scale,
	Trash2,
} from "lucide-react";
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
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
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

const PARAMETER_CARDS = [
	{
		id: "dose",
		label: "Dose / Yield",
		value: "18g → 36g",
		hint: "Ratio 1:2",
	},
	{
		id: "time",
		label: "Time / Temp",
		value: "28s · 93°C",
		hint: "9 bar",
	},
	{
		id: "grind",
		label: "Grind",
		value: "Eureka · 6",
		hint: "Rancilio Silvia",
	},
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

export const RecipeOverviewC = () => {
	return (
		<section aria-labelledby="recipe-overview-c-title" className="mx-auto w-full max-w-5xl">
			<div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
				<div>
					<Text variant="caption">Recipes / Morning Espresso</Text>
					<Heading as="h1" variant="title" id="recipe-overview-c-title" className="mt-1">
						Morning Espresso
					</Heading>
					<Text variant="body-sm" color="secondary" className="mt-0.5">
						Sunset Roast Espresso Blend · Medium-Dark
					</Text>
					<div className="mt-2 flex flex-wrap gap-1.5">
						<Badge variant="secondary">Recipe</Badge>
						<Badge variant="outline">Dialed in</Badge>
						<Badge variant="outline">3 shots</Badge>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm">
						<Pencil aria-hidden="true" />
						Edit
					</Button>
					<Button size="sm">
						<Plus aria-hidden="true" />
						New Log
					</Button>
					<MenuTrigger>
						<IconButton aria-label="More recipe actions" size="sm" variant="outline">
							<EllipsisVertical aria-hidden="true" />
						</IconButton>
						<Menu aria-label="More recipe actions" placement="bottom end" width="content">
							<MenuItem onAction={() => {}} textValue="Edit recipe">
								<Pencil className="size-3" aria-hidden="true" />
								Edit recipe
							</MenuItem>
							<MenuSeparator />
							<MenuItem onAction={() => {}} variant="destructive" textValue="Delete recipe">
								<Trash2 className="size-3" aria-hidden="true" />
								Delete recipe
							</MenuItem>
						</Menu>
					</MenuTrigger>
				</div>
			</div>

			<Tabs defaultSelectedKey="overview" className="mt-4">
				<TabsList variant="line" aria-label="Recipe sections" className="w-full">
					<TabsTrigger id="overview">Overview</TabsTrigger>
					<TabsTrigger id="logs">Logs · 3</TabsTrigger>
				</TabsList>
				<TabsContent id="overview" className="mt-4 flex flex-col gap-4">
					<div className="grid gap-4 sm:grid-cols-3">
						{PARAMETER_CARDS.map((card) => (
							<Card key={card.id} size="sm">
								<CardHeader>
									<Text variant="caption" color="muted">
										{card.label}
									</Text>
									<CardTitle>{card.value}</CardTitle>
									<Text variant="caption" color="secondary">
										{card.hint}
									</Text>
								</CardHeader>
							</Card>
						))}
					</div>
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
		</section>
	);
};
