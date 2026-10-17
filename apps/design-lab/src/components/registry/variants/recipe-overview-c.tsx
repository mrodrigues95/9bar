import {
	Bean,
	Cog,
	Copy,
	Droplets,
	Ellipsis,
	EllipsisVertical,
	Fingerprint,
	Gauge,
	Info,
	Pencil,
	Pin,
	Plus,
	Scale,
	Tag,
	Thermometer,
	Timer,
	Trash2,
	Unlink,
	type LucideIcon,
} from "lucide-react";
import { Fragment, useState } from "react";
import {
	Alert,
	AlertAction,
	AlertTitle,
	Badge,
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
	Dialog,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Heading,
	IconButton,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectList,
	SelectTrigger,
	SelectValue,
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
		yield: 38,
		time: "27s",
		beans: "Sunset Roast Espresso Blend",
		machine: "Rancilio Silvia",
		grinder: "Eureka Mignon",
		method: "espresso",
		verdict: "under-extracted",
		pinned: false,
	},
	{
		id: 2,
		shotAt: "Jun 2, 2024 @ 7:40 AM",
		dose: 18,
		yield: 36,
		time: "28s",
		beans: "Sunset Roast Espresso Blend",
		machine: "Rancilio Silvia",
		grinder: "Eureka Mignon",
		method: "espresso",
		verdict: "balanced",
		pinned: true,
	},
	{
		id: 3,
		shotAt: "Jun 1, 2024 @ 12:05 PM",
		dose: 17.5,
		yield: 35,
		time: "30s",
		beans: "Sunset Roast Espresso Blend",
		machine: "Gaggia Classic",
		grinder: "Eureka Mignon",
		method: "espresso",
		verdict: "under-extracted",
		pinned: false,
	},
];

const METHOD_OPTIONS = [
	{ id: "espresso", label: "Espresso" },
	{ id: "pour-over", label: "Pour over" },
	{ id: "immersion", label: "Immersion" },
	{ id: "other", label: "Other" },
];

const VERDICT_OPTIONS = [
	{ id: "under-extracted", label: "Under-extracted" },
	{ id: "balanced", label: "Balanced" },
	{ id: "over-extracted", label: "Over-extracted" },
];

const STATUS_OPTIONS = [
	{ id: "dialing-in", label: "Dialing in" },
	{ id: "dialed-in", label: "Dialed in" },
	{ id: "needs-retune", label: "Needs retune" },
	{ id: "retired", label: "Retired" },
];

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
		id: "method",
		label: "Method",
		icon: <Timer />,
		pluralLabel: "methods",
		operators: LOG_FILTER_OPERATORS,
		defaultOperatorId: "is",
		operatorPairs: LOG_FILTER_OPERATOR_PAIRS,
		options: METHOD_OPTIONS,
	},
	{
		id: "verdict",
		label: "Verdict",
		icon: <Scale />,
		pluralLabel: "verdicts",
		operators: LOG_FILTER_OPERATORS,
		defaultOperatorId: "is",
		operatorPairs: LOG_FILTER_OPERATOR_PAIRS,
		options: VERDICT_OPTIONS,
	},
] as const satisfies ReadonlyArray<FilterBarDefinition>;

const LOGS_PAGE_SIZE = 2;

const BREW_PARAMS: Array<{ id: string; label: string; value: string; icon: LucideIcon }> = [
	{ id: "dose", label: "Dose", value: "18g", icon: Scale },
	{ id: "yield", label: "Yield", value: "36g", icon: Droplets },
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
	{
		id: "grind",
		label: "Grind",
		value: "6",
	},
	{
		id: "machine",
		label: "Machine",
		value: "Rancilio Silvia",
	},
	{
		id: "grinder",
		label: "Grinder",
		value: "Eureka Mignon",
	},
];

type HistoryField = "dose" | "grind" | "pressure" | "temp" | "time" | "yield";

interface HistoryChange {
	field: HistoryField;
	fieldLabel: string;
	previous: string;
	next: string;
}

interface HistoryEvent {
	id: number;
	date: string;
	dateTime: string;
	changes: Array<HistoryChange>;
}

const HISTORY_EVENTS: Array<HistoryEvent> = [
	{
		id: 1,
		date: "Jun 3, 2024 @ 7:42 AM",
		dateTime: "2024-06-03T07:42",
		changes: [
			{ field: "grind", fieldLabel: "Grind", previous: "6", next: "5.5" },
			{ field: "dose", fieldLabel: "Dose", previous: "17.5g", next: "18g" },
		],
	},
	{
		id: 2,
		date: "Jun 1, 2024 @ 8:15 AM",
		dateTime: "2024-06-01T08:15",
		changes: [{ field: "temp", fieldLabel: "Temp", previous: "93°C", next: "94°C" }],
	},
	{
		id: 3,
		date: "May 28, 2024 @ 6:58 PM",
		dateTime: "2024-05-28T18:58",
		changes: [
			{ field: "yield", fieldLabel: "Yield", previous: "36g", next: "38g" },
			{ field: "time", fieldLabel: "Time", previous: "28s", next: "30s" },
		],
	},
	{
		id: 4,
		date: "May 25, 2024 @ 9:03 AM",
		dateTime: "2024-05-25T09:03",
		changes: [{ field: "yield", fieldLabel: "Yield", previous: "38g", next: "36g" }],
	},
	{
		id: 5,
		date: "May 21, 2024 @ 7:31 PM",
		dateTime: "2024-05-21T19:31",
		changes: [
			{ field: "pressure", fieldLabel: "Pressure", previous: "9 bar", next: "8.5 bar" },
			{ field: "dose", fieldLabel: "Dose", previous: "18g", next: "17.5g" },
		],
	},
	{
		id: 6,
		date: "May 18, 2024 @ 8:47 AM",
		dateTime: "2024-05-18T08:47",
		changes: [{ field: "temp", fieldLabel: "Temp", previous: "94°C", next: "93°C" }],
	},
	{
		id: 7,
		date: "May 15, 2024 @ 6:12 PM",
		dateTime: "2024-05-15T18:12",
		changes: [
			{ field: "grind", fieldLabel: "Grind", previous: "5", next: "6" },
			{ field: "dose", fieldLabel: "Dose", previous: "18g", next: "18.5g" },
			{ field: "yield", fieldLabel: "Yield", previous: "36g", next: "37g" },
			{ field: "temp", fieldLabel: "Temp", previous: "94°C", next: "93°C" },
			{ field: "pressure", fieldLabel: "Pressure", previous: "8.5 bar", next: "9 bar" },
			{ field: "time", fieldLabel: "Time", previous: "30s", next: "28s" },
		],
	},
];

const FIELD_OPTIONS = [
	{ id: "grind", label: "Grind" },
	{ id: "dose", label: "Dose" },
	{ id: "yield", label: "Yield" },
	{ id: "temp", label: "Temp" },
	{ id: "pressure", label: "Pressure" },
	{ id: "time", label: "Time" },
];

const FIELD_ICONS: Record<HistoryField, LucideIcon> = {
	grind: Cog,
	dose: Scale,
	yield: Droplets,
	temp: Thermometer,
	pressure: Gauge,
	time: Timer,
};

const HISTORY_PAGE_SIZE = 4;

const HISTORY_FILTER_DEFINITIONS = [
	{
		id: "field",
		label: "Field",
		icon: <Tag />,
		pluralLabel: "fields",
		operators: LOG_FILTER_OPERATORS,
		defaultOperatorId: "is",
		operatorPairs: LOG_FILTER_OPERATOR_PAIRS,
		options: FIELD_OPTIONS,
	},
] as const satisfies ReadonlyArray<FilterBarDefinition>;

const optionLabel = (options: Array<{ id: string; label: string }>, id: string) => {
	return options.find((option) => option.id === id)?.label ?? id;
};

const LogRowMetaItem = ({ icon: Icon, label }: { icon: LucideIcon; label: string }) => {
	return (
		<Text variant="caption" className="flex max-w-full min-w-0 items-center gap-1">
			<Icon className="size-3 shrink-0" />
			<span className="truncate">{label}</span>
		</Text>
	);
};

const LogRow = ({ log }: { log: (typeof LOGS)[number] }) => {
	return (
		<li className="flex items-center gap-3 py-2.5">
			<div className="min-w-0 flex-1">
				<div className="flex min-w-0 items-center gap-2">
					<Text variant="label" color="primary" className="truncate">
						{log.shotAt}
					</Text>
					{log.pinned && (
						<Badge variant="secondary">
							<Pin />
							Pinned
						</Badge>
					)}
					<Badge variant="outline">{optionLabel(VERDICT_OPTIONS, log.verdict)}</Badge>
				</div>
				<Text variant="caption" className="mt-0.5 flex min-w-0 items-center gap-1 font-mono">
					<Scale className="size-3 shrink-0" />
					<span className="truncate">
						{log.dose}g → {log.yield}g · {log.time}
					</span>
				</Text>
				<div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-0.5">
					<LogRowMetaItem icon={Bean} label={log.beans} />
					<LogRowMetaItem icon={Gauge} label={log.machine} />
					<LogRowMetaItem icon={Cog} label={log.grinder} />
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-1">
				<MenuTrigger>
					<IconButton aria-label={`Actions for log from ${log.shotAt}`} size="sm" variant="ghost">
						<EllipsisVertical />
					</IconButton>
					<Menu
						aria-label={`Actions for log from ${log.shotAt}`}
						placement="bottom end"
						width="content"
					>
						<MenuItem onAction={() => {}} textValue="Edit log">
							<Pencil className="size-3" />
							Edit log
						</MenuItem>
						<MenuItem onAction={() => {}} textValue="Set as reference shot">
							<Pin className="size-3" />
							Set as reference shot
						</MenuItem>
						<MenuItem onAction={() => {}} textValue="Detach from recipe">
							<Unlink className="size-3" />
							Detach from recipe
						</MenuItem>
						<MenuSeparator />
						<MenuItem onAction={() => {}} variant="default" textValue="Delete log">
							<Trash2 className="size-3" />
							Delete log
						</MenuItem>
					</Menu>
				</MenuTrigger>
			</div>
		</li>
	);
};

export const RecipeOverviewC = () => {
	const [filters, setFilters] = useState<Array<FilterBarFilterState>>([]);
	const [page, setPage] = useState(1);
	const [historyFilters, setHistoryFilters] = useState<Array<FilterBarFilterState>>([]);
	const [historyPage, setHistoryPage] = useState(1);
	const [status, setStatus] = useState<string>("dialing-in");
	const [deleteOpen, setDeleteOpen] = useState(false);

	const sortedLogs = [...LOGS].sort((a, b) => {
		return Number(b.pinned) - Number(a.pinned);
	});
	const filteredLogs = sortedLogs.filter((log) => {
		return filters.every((filter) => {
			if (filter.filterId !== "method" && filter.filterId !== "verdict") {
				return true;
			}
			const value = filter.filterId === "method" ? log.method : log.verdict;
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

	const filteredHistory = HISTORY_EVENTS.filter((event) => {
		return historyFilters.every((filter) => {
			if (filter.filterId !== "field") {
				return true;
			}
			const isSelected = event.changes.some((change) => filter.values.includes(change.field));
			if (filter.operatorId === "is-not" || filter.operatorId === "is-none-of") {
				return !isSelected;
			}
			return isSelected;
		});
	});
	const historyTotalPages = Math.max(1, Math.ceil(filteredHistory.length / HISTORY_PAGE_SIZE));
	const historyCurrentPage = Math.min(historyPage, historyTotalPages);
	const visibleHistory = filteredHistory.slice(
		(historyCurrentPage - 1) * HISTORY_PAGE_SIZE,
		historyCurrentPage * HISTORY_PAGE_SIZE,
	);

	const updateHistoryFilters = (next: Array<FilterBarFilterState>) => {
		setHistoryFilters(next);
		setHistoryPage(1);
	};

	return (
		<section
			aria-labelledby="recipe-overview-c-title"
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
						<Heading as="h1" variant="title" id="recipe-overview-c-title">
							Morning Espresso
						</Heading>
						<Text variant="body-sm" color="secondary" className="mt-0.5">
							Sunset Roast Espresso Blend · Medium-Dark
						</Text>
						<div className="mt-2 flex flex-wrap items-center gap-2">
							<Badge variant="secondary">
								<Fingerprint className="size-3" />
								Recipe
							</Badge>
							<Badge variant="outline">{optionLabel(STATUS_OPTIONS, status)}</Badge>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<MenuTrigger>
							<IconButton aria-label="Recipe actions" size="sm" variant="ghost">
								<Ellipsis />
							</IconButton>
							<Menu aria-label="More recipe actions" placement="bottom end" width="content">
								<MenuItem onAction={() => {}} textValue="Edit recipe">
									<Pencil className="size-3" />
									Edit recipe
								</MenuItem>
								<MenuItem onAction={() => {}} textValue="Duplicate recipe">
									<Copy className="size-3" />
									Duplicate recipe
								</MenuItem>
								<MenuSeparator />
								<MenuItem
									onAction={() => {
										setDeleteOpen(true);
									}}
									variant="default"
									textValue="Delete recipe"
								>
									<Trash2 className="size-3" />
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
						<TabsTrigger id="history">History · 7</TabsTrigger>
					</TabsList>
					<TabsContent id="overview" className="mt-4">
						<Alert variant="default" className="mb-4">
							<Info />
							<AlertTitle>Three balanced logs in a row suggest Dialed in.</AlertTitle>
							<AlertAction>
								<Button size="xs" variant="ghost" onPress={() => {}}>
									Dismiss
								</Button>
								<Button size="xs" variant="ghost" onPress={() => {}}>
									Accept
								</Button>
							</AlertAction>
						</Alert>
						<Card>
							<CardContent className="flex flex-col gap-5">
								<div className="flex justify-end">
									<Select
										aria-label="Recipe status"
										selectedKey={status}
										onSelectionChange={(key) => {
											setStatus(String(key));
										}}
										className="w-36"
									>
										<SelectTrigger size="sm">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectList>
												{STATUS_OPTIONS.map((option) => (
													<SelectItem key={option.id} id={option.id} textValue={option.label}>
														{option.label}
													</SelectItem>
												))}
											</SelectList>
										</SelectContent>
									</Select>
								</div>
								<section aria-labelledby="recipe-overview-c-brew-params">
									<CardTitle id="recipe-overview-c-brew-params" className="sr-only">
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
													<param.icon className="size-3" />
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
								<section aria-labelledby="recipe-overview-c-details">
									<CardTitle id="recipe-overview-c-details" className="border-b border-border pb-2">
										Details
									</CardTitle>
									<dl className="mt-3 grid gap-3 sm:grid-cols-2">
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
								<section aria-labelledby="recipe-overview-c-notes">
									<CardTitle id="recipe-overview-c-notes" className="border-b border-border pb-2">
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
										<Plus />
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
					<TabsContent id="history" className="mt-4">
						<Card>
							<CardContent className="flex flex-col gap-2">
								<div className="flex flex-wrap items-center justify-end gap-2">
									<FilterBarAddTrigger
										definitions={HISTORY_FILTER_DEFINITIONS}
										filters={historyFilters}
										onFiltersChange={updateHistoryFilters}
										aria-label="Add history filter"
									/>
								</div>
								{historyFilters.length > 0 && (
									<div className="rounded-md bg-muted/50 px-2.5 py-2">
										<FilterBar
											definitions={HISTORY_FILTER_DEFINITIONS}
											filters={historyFilters}
											onFiltersChange={updateHistoryFilters}
											aria-label="Active history filters"
										>
											{({ clearAll }) => (
												<FilterBarActions>
													<Button
														variant="ghost"
														size="xs"
														onPress={() => {
															clearAll();
															setHistoryPage(1);
														}}
													>
														Clear
													</Button>
												</FilterBarActions>
											)}
										</FilterBar>
									</div>
								)}
								{visibleHistory.length > 0 ? (
									<ul className="divide-y divide-border">
										{visibleHistory.map((event) => (
											<li key={event.id} className="py-2.5">
												<Text variant="body-sm" color="secondary">
													{event.changes.map((change, index) => {
														const FieldIcon = FIELD_ICONS[change.field] ?? Tag;
														return (
															<Fragment key={change.field}>
																{index > 0 ? " · " : null}
																<FieldIcon className="mr-1 inline size-3.5 text-muted-foreground" />
																{change.fieldLabel} {change.previous} → {change.next}
															</Fragment>
														);
													})}{" "}· Edited <time dateTime={event.dateTime}>{event.date}</time>
												</Text>
											</li>
										))}
									</ul>
								) : (
									<Text variant="body-sm" color="secondary" className="py-6 text-center">
										No changes match your filters.
									</Text>
								)}
							</CardContent>
							<CardFooter className="flex flex-row items-center justify-between border-t border-t-border pt-6">
								<Pagination
									page={historyCurrentPage}
									pageSize={HISTORY_PAGE_SIZE}
									total={filteredHistory.length}
									onPageChange={setHistoryPage}
								/>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>
			</div>

			<Dialog
				isOpen={deleteOpen}
				onOpenChange={setDeleteOpen}
				aria-label="Delete Morning Espresso"
			>
				<DialogHeader>
					<DialogTitle>Delete “Morning Espresso”?</DialogTitle>
					<DialogDescription>
						This recipe has 3 logs. Keep them as quick logs, or delete them too.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="ghost"
						onPress={() => {
							setDeleteOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button
						variant="outline"
						onPress={() => {
							setDeleteOpen(false);
						}}
					>
						Keep logs
					</Button>
					<Button
						variant="destructive"
						onPress={() => {
							setDeleteOpen(false);
						}}
					>
						Delete logs too
					</Button>
				</DialogFooter>
			</Dialog>
		</section>
	);
};
