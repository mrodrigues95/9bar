import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { ChevronDown, Copy, Pencil, RotateCcw, Trash2 } from "lucide-react";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	Heading,
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
	Text,
} from "@9bar/toolkit/components";
import { MenuItemLink } from "../../../../../components";
import {
	METHOD_LABELS,
	RECIPE_STATUS_LABELS,
	VERDICT_LABELS,
	grinderName,
	machineName,
	type TBrewSnapshot,
	type TLog,
	type TRecipe,
	type TRecipeStatus,
} from "../../../../../utils/data";
import { formatShotAt } from "../../../../../utils/format";
import { objectKeys } from "../../../../../utils/utils";
import {
	formatChangeDate,
	formatRatio,
	getRecipeChangeLines,
	resolveReferenceShot,
	suggestRecipeStatus,
} from "./-recipe-overview";

const routeApi = getRouteApi("/_authenticated/recipes_/$recipeId");

const STATUS_OPTIONS = objectKeys(RECIPE_STATUS_LABELS).map((id) => ({
	id,
	label: RECIPE_STATUS_LABELS[id],
}));

const noop = () => {};

const Stat = ({ label, value }: { label: string; value: string }) => {
	return (
		<div className="flex flex-col-reverse">
			<Text as="dt" variant="body-sm" color="muted">
				{label}
			</Text>
			<Text as="dd" variant="body-sm" color="secondary" className="font-semibold">
				{value}
			</Text>
		</div>
	);
};

const StatsGrid = ({ snapshot }: { snapshot: TBrewSnapshot }) => {
	return (
		<dl className="grid grid-cols-2 place-items-center gap-3 text-center font-mono text-sm sm:grid-cols-5">
			<Stat label="Dose" value={`${snapshot.dose}g`} />
			<Stat label="Yield" value={`${snapshot.yield}g`} />
			<Stat label="Time" value={`${snapshot.brewTime}${snapshot.brewTimeUnit}`} />
			<Stat label="Temp" value={`${snapshot.temperature}°${snapshot.temperatureUnit}`} />
			<Stat label="Pressure" value={`${snapshot.pressure} bar`} />
		</dl>
	);
};

const DetailRow = ({ label, value }: { label: string; value: string }) => {
	return (
		<div className="flex w-full gap-0.5">
			<Text as="dt" variant="body-sm" className="font-medium" color="primary">
				{label}:
			</Text>
			<Text as="dd" variant="body-sm" color="secondary">
				{value}
			</Text>
		</div>
	);
};

const DetailsList = ({ snapshot }: { snapshot: TBrewSnapshot }) => {
	return (
		<dl className="flex flex-col gap-1">
			<DetailRow label="Beans" value={snapshot.beans} />
			<DetailRow label="Method" value={METHOD_LABELS[snapshot.method]} />
			<DetailRow label="Machine" value={machineName(snapshot.machine)} />
			<DetailRow label="Grinder" value={grinderName(snapshot.grinder)} />
			<DetailRow label="Grind" value={snapshot.grindSize} />
			<DetailRow label="Ratio" value={formatRatio(snapshot)} />
		</dl>
	);
};

const StatusSuggestion = ({
	recipe,
	logs,
}: {
	recipe: { status: TRecipeStatus | null };
	logs: Array<TLog>;
}) => {
	const suggestion = suggestRecipeStatus(recipe, logs);
	if (!suggestion) {
		return null;
	}

	return (
		<Alert variant="info">
			<AlertTitle>{suggestion.reason}</AlertTitle>
			<AlertDescription className="flex items-center gap-1.5 pt-1.5">
				<Button size="xs" onPress={noop}>
					Accept
				</Button>
				<Button size="xs" variant="ghost" onPress={noop}>
					Dismiss
				</Button>
			</AlertDescription>
		</Alert>
	);
};

const ReferenceShotSection = ({
	recipe,
	logs,
}: {
	recipe: Pick<TRecipe, "pinnedLogId">;
	logs: Array<TLog>;
}) => {
	const shot = resolveReferenceShot(recipe, logs);

	return (
		<section className="flex flex-col gap-2">
			<div className="flex flex-wrap items-center gap-2">
				<Heading variant="subsection" as="h2">
					Reference shot
				</Heading>
				{shot && <Badge variant="outline">{shot.pinned ? "Pinned" : "Latest balanced"}</Badge>}
				{shot?.log.verdict && <Badge variant="secondary">{VERDICT_LABELS[shot.log.verdict]}</Badge>}
			</div>
			{shot ? (
				<>
					<Text variant="caption">{formatShotAt(shot.log.shotAt)}</Text>
					<dl className="grid grid-cols-2 place-items-center gap-3 text-center font-mono text-sm sm:grid-cols-4">
						<Stat label="Dose" value={`${shot.snapshot.dose}g`} />
						<Stat label="Yield" value={`${shot.snapshot.yield}g`} />
						<Stat label="Time" value={`${shot.snapshot.brewTime}${shot.snapshot.brewTimeUnit}`} />
						<Stat
							label="Temp"
							value={`${shot.snapshot.temperature}°${shot.snapshot.temperatureUnit}`}
						/>
					</dl>
				</>
			) : (
				<Text variant="body-sm" color="muted">
					No reference shot yet. Log a balanced shot to set one.
				</Text>
			)}
		</section>
	);
};

const ChangeHistorySection = ({ recipeId }: { recipeId: number }) => {
	const lines = getRecipeChangeLines(recipeId);

	return (
		<section className="flex flex-col gap-2">
			<Heading variant="subsection" as="h2">
				Change history
			</Heading>
			{lines.length > 0 ? (
				<ul className="flex flex-col gap-1">
					{lines.map((line, index) => (
						<li key={`${line.changedAt}-${line.label}-${index}`}>
							<Text variant="body-sm" color="secondary">
								{line.label} {line.previous} → {line.next} · {formatChangeDate(line.changedAt)}
							</Text>
						</li>
					))}
				</ul>
			) : (
				<Text variant="body-sm" color="muted">
					No changes recorded yet.
				</Text>
			)}
		</section>
	);
};

const RecipeOverview = () => {
	const { recipe } = routeApi.useLoaderData();
	if (recipe.isQuickBrew) {
		return null;
	}

	return (
		<Card>
			<CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
				<div className="flex min-w-0 items-center gap-2">
					<Heading variant="section" as="p" className="truncate">
						{recipe.name ?? "(Untitled)"}
					</Heading>
					{recipe.status && <Badge variant="outline">{RECIPE_STATUS_LABELS[recipe.status]}</Badge>}
					<Select
						aria-label="Recipe status"
						selectedKey={recipe.status}
						onSelectionChange={noop}
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
				<MenuTrigger>
					<Button variant="outline">
						Actions
						<ChevronDown />
					</Button>
					<Menu>
						<MenuItem textValue="Log again">
							<RotateCcw className="size-3" />
							Log again
						</MenuItem>
						<MenuItemLink
							to="/recipes/$recipeId/edit"
							params={{ recipeId: String(recipe.id) }}
							textValue="Edit"
						>
							<Pencil className="size-3" />
							Edit
						</MenuItemLink>
						<MenuItem textValue="Duplicate">
							<Copy className="size-3" />
							Duplicate
						</MenuItem>
						<MenuSeparator />
						<MenuItem variant="destructive" textValue="Delete">
							<Trash2 className="size-3" />
							Delete
						</MenuItem>
					</Menu>
				</MenuTrigger>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<StatusSuggestion recipe={recipe} logs={recipe.logs} />
				<StatsGrid snapshot={recipe.snapshot} />
				<DetailsList snapshot={recipe.snapshot} />
				{recipe.snapshot.notes ? (
					<Text as="p" variant="body" color="secondary">
						{recipe.snapshot.notes}
					</Text>
				) : (
					<Text as="p" variant="body-sm" color="muted">
						No notes yet.
					</Text>
				)}
				<ReferenceShotSection recipe={recipe} logs={recipe.logs} />
				<ChangeHistorySection recipeId={recipe.id} />
			</CardContent>
		</Card>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId/overview")({
	component: RecipeOverview,
});
