import {
	Cog,
	Droplets,
	Ellipsis,
	EllipsisVertical,
	Gauge,
	Pencil,
	Percent,
	Plus,
	Scale,
	Thermometer,
	Timer,
	Trash2,
	type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
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
import {
	FilterBar,
	FilterBarActions,
	type FilterBarDefinition,
	type FilterBarFilterState,
} from "@9bar/toolkit/components/composed";
import { FilterBarAddTrigger } from "./_local/filter-bar-add-trigger";
import { Pagination } from "./_local/pagination";

const LOGS = [
	{
		id: 1,
		shotAt: "Jun 3, 2024 @ 7:55 AM",
		dose: 18,
		yield: 36,
		time: "28s",
		note: "Sweet, balanced. Keeper.",
		machine: "rancilio-silvia",
		grinder: "eureka-mignon",
	},
	{
		id: 2,
		shotAt: "Jun 2, 2024 @ 7:40 AM",
		dose: 18,
		yield: 38,
		time: "27s",
		note: "Slightly fast, thin body.",
		machine: "rancilio-silvia",
		grinder: "eureka-mignon",
	},
	{
		id: 3,
		shotAt: "Jun 1, 2024 @ 12:05 PM",
		dose: 17.5,
		yield: 35,
		time: "30s",
		note: "First dial-in, sour edge.",
		machine: "gaggia-classic",
		grinder: "eureka-mignon",
	},
];

const MACHINE_OPTIONS = [
	{ id: "rancilio-silvia", label: "Rancilio Silvia" },
	{ id: "gaggia-classic", label: "Gaggia Classic" },
];

const GRINDER_OPTIONS = [
	{ id: "eureka-mignon", label: "Eureka Mignon" },
	{ id: "baratza-sette", label: "Baratza Sette" },
];

const optionLabel = (options: Array<{ id: string; label: string }>, id: string) => {
	return options.find((option) => option.id === id)?.label ?? id;
};

const LOG_FILTER_OPERATORS = [
	{ id: "is", label: "is" },
	{ id: "is-not", label: "is not" },
	{ id: "is-any-of", label: "is any of" },
	{ id: "is-none-of", label: "is none of" },
];

const LOG_FILTER_OPERATOR_PAIRS = [
	{ singular: "is", plural: "is-any-of" },
	{ singular: "is-not", plural: "is-none-of" },
];

const LOG_FILTER_DEFINITIONS = [
	{
		id: "machine",
		label: "Machine",
		icon: <Gauge />,
		pluralLabel: "machines",
		operators: LOG_FILTER_OPERATORS,
		defaultOperatorId: "is",
		operatorPairs: LOG_FILTER_OPERATOR_PAIRS,
		options: MACHINE_OPTIONS,
	},
	{
		id: "grinder",
		label: "Grinder",
		icon: <Cog />,
		pluralLabel: "grinders",
		operators: LOG_FILTER_OPERATORS,
		defaultOperatorId: "is",
		operatorPairs: LOG_FILTER_OPERATOR_PAIRS,
		options: GRINDER_OPTIONS,
	},
] as const satisfies ReadonlyArray<FilterBarDefinition>;

const LOGS_PAGE_SIZE = 2;

const BREW_PARAMS: Array<{ id: string; label: string; value: string; icon: LucideIcon }> = [
	{ id: "dose", label: "Dose", value: "18g", icon: Scale },
	{ id: "yield", label: "Yield", value: "36g", icon: Droplets },
	{ id: "ratio", label: "Ratio", value: "1:2", icon: Percent },
	{ id: "time", label: "Time", value: "28s", icon: Timer },
	{ id: "temp", label: "Temp", value: "93°C", icon: Thermometer },
	{ id: "pressure", label: "Pressure", value: "9 bar", icon: Gauge },
];

const DETAILS = [
	{
		id: "coffee",
		label: "Coffee",
		value: "Sunset Roast Espresso Blend · Medium-Dark",
	},
	{ id: "machine", label: "Machine", value: "Rancilio Silvia" },
	{ id: "grinder", label: "Grinder", value: "Eureka Mignon · 6" },
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
						<Gauge className="size-3 shrink-0" aria-hidden="true" />
						<span className="truncate">{optionLabel(MACHINE_OPTIONS, log.machine)}</span>
					</Text>
					<Text variant="caption" className="flex items-center gap-1">
						<Cog className="size-3 shrink-0" aria-hidden="true" />
						<span className="truncate">{optionLabel(GRINDER_OPTIONS, log.grinder)}</span>
					</Text>
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-1">
				<MenuTrigger>
					<IconButton aria-label={`Actions for log from ${log.shotAt}`} size="sm" variant="ghost">
						<EllipsisVertical aria-hidden="true" />
					</IconButton>
					<Menu
						aria-label={`Actions for log from ${log.shotAt}`}
						placement="bottom end"
						width="content"
					>
						<MenuItem onAction={() => {}} textValue="Edit log">
							<Pencil className="size-3" aria-hidden="true" />
							Edit log
						</MenuItem>
						<MenuSeparator />
						<MenuItem onAction={() => {}} variant="default" textValue="Delete log">
							<Trash2 className="size-3" aria-hidden="true" />
							Delete log
						</MenuItem>
					</Menu>
				</MenuTrigger>
			</div>
		</li>
	);
};

export const RecipeOverviewD = () => {
	const [filters, setFilters] = useState<Array<FilterBarFilterState>>([]);
	const [page, setPage] = useState(1);

	const filteredLogs = LOGS.filter((log) => {
		return filters.every((filter) => {
			if (filter.filterId !== "machine" && filter.filterId !== "grinder") {
				return true;
			}
			const value = filter.filterId === "machine" ? log.machine : log.grinder;
			const isSelected = filter.values.includes(value);
			if (filter.operatorId === "is-not" || filter.operatorId === "is-none-of") {
				return !isSelected;
			}
			return isSelected;
		});
	});
	const totalPages = Math.max(1, Math.ceil(filteredLogs.length / LOGS_PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const visibleLogs = filteredLogs.slice(
		(currentPage - 1) * LOGS_PAGE_SIZE,
		currentPage * LOGS_PAGE_SIZE,
	);

	const updateFilters = (next: Array<FilterBarFilterState>) => {
		setFilters(next);
		setPage(1);
	};

	return (
		<section
			aria-labelledby="recipe-overview-d-title"
			className="w-full rounded-lg bg-neutral-50/25 p-4 sm:p-6"
		>
			<div className="mx-auto w-full max-w-5xl">
				<Breadcrumb aria-label="Recipe navigation" className="mb-4">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href="#">Recipes</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbItem>
							<BreadcrumbPage>Morning Espresso</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>

				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<Heading as="h1" variant="title" id="recipe-overview-d-title">
							Morning Espresso
						</Heading>
						<Text variant="body-sm" color="secondary" className="mt-0.5">
							Sunset Roast Espresso Blend · Medium-Dark
						</Text>
					</div>
					<div className="flex items-center gap-2">
						<MenuTrigger>
							<IconButton aria-label="Recipe actions" size="sm" variant="ghost">
								<Ellipsis aria-hidden="true" />
							</IconButton>
							<Menu aria-label="More recipe actions" placement="bottom end" width="content">
								<MenuItem onAction={() => {}} textValue="Edit recipe">
									<Pencil className="size-3" aria-hidden="true" />
									Edit recipe
								</MenuItem>
								<MenuSeparator />
								<MenuItem onAction={() => {}} variant="default" textValue="Delete recipe">
									<Trash2 className="size-3" aria-hidden="true" />
									Delete recipe
								</MenuItem>
							</Menu>
						</MenuTrigger>
					</div>
				</div>

				<Tabs defaultSelectedKey="overview" className="mt-4">
					<TabsList variant="line" aria-label="Recipe sections" className="w-fit shrink-0">
						<TabsTrigger id="overview">Overview</TabsTrigger>
						<TabsTrigger id="logs">Logs · 3</TabsTrigger>
					</TabsList>
					<TabsContent id="overview" className="mt-4">
						<Card>
							<CardContent className="flex flex-col gap-5">
								<section aria-labelledby="recipe-overview-d-brew-params">
									<CardTitle id="recipe-overview-d-brew-params" className="sr-only">
										Brew parameters
									</CardTitle>
									<dl className="mt-3 grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
										{BREW_PARAMS.map((param) => (
											<div key={param.id}>
												<Text
													as="dt"
													variant="caption"
													color="muted"
													className="flex items-center justify-center gap-1"
												>
													<param.icon className="size-3" aria-hidden="true" />
													{param.label}
												</Text>
												<Text
													as="dd"
													variant="body-sm"
													color="primary"
													className="font-mono font-semibold"
												>
													{param.value}
												</Text>
											</div>
										))}
									</dl>
								</section>
								<section aria-labelledby="recipe-overview-d-details">
									<CardTitle id="recipe-overview-d-details" className="border-b border-border pb-2">
										Details
									</CardTitle>
									<dl className="mt-3 grid gap-3 sm:grid-cols-3">
										{DETAILS.map((detail) => (
											<div key={detail.id}>
												<Text as="dt" variant="caption" color="muted">
													{detail.label}
												</Text>
												<Text as="dd" variant="body-sm" color="primary">
													{detail.value}
												</Text>
											</div>
										))}
									</dl>
								</section>
								<section aria-labelledby="recipe-overview-d-notes">
									<CardTitle id="recipe-overview-d-notes" className="border-b border-border pb-2">
										Notes
									</CardTitle>
									<Text as="p" variant="body-sm" color="primary" className="mt-1.5">
										Sweet caramel aroma, balanced acidity. Grind 6 on the Mignon, 3s pre-infusion.
									</Text>
								</section>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent id="logs" className="mt-4">
						<Card>
							<CardHeader className="border-b border-b-border pb-6">
								<div className="flex flex-wrap items-center justify-end gap-2">
									<Button variant="outline" size="sm">
										<Plus aria-hidden="true" />
										New Log
									</Button>
								</div>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								<div className="flex flex-wrap items-center justify-end gap-2">
									<FilterBarAddTrigger
										definitions={LOG_FILTER_DEFINITIONS}
										filters={filters}
										onFiltersChange={updateFilters}
										aria-label="Add log filter"
									/>
								</div>
								{filters.length > 0 && (
									<div className="rounded-md bg-muted/50 px-2.5 py-2">
										<FilterBar
											definitions={LOG_FILTER_DEFINITIONS}
											filters={filters}
											onFiltersChange={updateFilters}
											aria-label="Active log filters"
										>
											{({ clearAll }) => (
												<FilterBarActions>
													<Button
														variant="ghost"
														size="xs"
														onPress={() => {
															clearAll();
															setPage(1);
														}}
													>
														Clear
													</Button>
												</FilterBarActions>
											)}
										</FilterBar>
									</div>
								)}
								{visibleLogs.length > 0 ? (
									<ul className="divide-y divide-border">
										{visibleLogs.map((log) => (
											<LogRow key={log.id} log={log} />
										))}
									</ul>
								) : (
									<Text variant="body-sm" color="secondary" className="py-6 text-center">
										No logs match your filters.
									</Text>
								)}
							</CardContent>
							<CardFooter className="flex flex-row items-center justify-between border-t border-t-border pt-6">
								<Pagination
									page={currentPage}
									pageSize={LOGS_PAGE_SIZE}
									total={filteredLogs.length}
									onPageChange={setPage}
								/>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</section>
	);
};
