import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Droplets, Gauge, Info, Scale, Thermometer, Timer, type LucideIcon } from "lucide-react";
import {
	Alert,
	AlertAction,
	AlertTitle,
	Button,
	Card,
	CardContent,
	CardTitle,
	Select,
	SelectContent,
	SelectItem,
	SelectList,
	SelectTrigger,
	SelectValue,
	Text,
} from "@9bar/toolkit/components";
import {
	RECIPE_STATUS_OPTIONS,
	grinderName,
	machineName,
	type BrewSnapshot,
} from "../../../../../utils/data";
import {
	formatBrewTime,
	formatGrams,
	formatPressure,
	formatTemperature,
} from "../../../../../utils/format";

const DIALED_IN_REASON = "Three balanced logs in a row suggest Dialed in.";
const NEEDS_RETUNE_REASON = "The last 2 shots pulled under or over. Retune this recipe?";

/**
 * Deterministic mock suggestion variety: only some recipes surface a banner, split
 * between dialed-in and needs-retune. Stable per recipe so the banner never flickers.
 */
const resolveStatusSuggestion = (recipeId: number) => {
	if (recipeId % 3 === 1) {
		return DIALED_IN_REASON;
	}
	if (recipeId % 3 === 2) {
		return NEEDS_RETUNE_REASON;
	}
	return null;
};

const routeApi = getRouteApi("/_authenticated/recipes_/$recipeId");

const STATUS_OPTIONS = RECIPE_STATUS_OPTIONS.map(({ id, name }) => ({ id, label: name }));

const noop = () => {};

const StatusSuggestionBanner = ({ recipeId }: { recipeId: number }) => {
	const reason = resolveStatusSuggestion(recipeId);
	if (!reason) {
		return null;
	}

	return (
		<Alert variant="default">
			<Info />
			<AlertTitle>{reason}</AlertTitle>
			<AlertAction>
				<Button size="xs" variant="ghost" onPress={noop}>
					Dismiss
				</Button>
				<Button size="xs" variant="ghost" onPress={noop}>
					Accept
				</Button>
			</AlertAction>
		</Alert>
	);
};

const BrewParamsGrid = ({ snapshot }: { snapshot: BrewSnapshot }) => {
	const params: Array<{ id: string; label: string; icon: LucideIcon; value: string }> = [
		{ id: "dose", label: "Dose", icon: Scale, value: formatGrams(snapshot.dose) },
		{ id: "yield", label: "Yield", icon: Droplets, value: formatGrams(snapshot.yield) },
		{ id: "time", label: "Time", icon: Timer, value: formatBrewTime(snapshot) },
		{ id: "temp", label: "Temp", icon: Thermometer, value: formatTemperature(snapshot) },
		{ id: "pressure", label: "Pressure", icon: Gauge, value: formatPressure(snapshot.pressure) },
	];

	return (
		<section aria-labelledby="recipe-brew-params">
			<CardTitle id="recipe-brew-params" className="sr-only">
				Brew parameters
			</CardTitle>
			<dl className="mt-3 grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
				{params.map((param) => (
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
						<Text as="dd" variant="body-sm" color="primary" className="font-mono font-semibold">
							{param.value}
						</Text>
					</div>
				))}
			</dl>
		</section>
	);
};

const DetailsGrid = ({ snapshot }: { snapshot: BrewSnapshot }) => {
	const details = [
		{ id: "coffee", label: "Coffee", value: snapshot.beans },
		{ id: "grind", label: "Grind", value: snapshot.grindSize },
		{ id: "machine", label: "Machine", value: machineName(snapshot.machine) },
		{ id: "grinder", label: "Grinder", value: grinderName(snapshot.grinder) },
	];

	return (
		<section aria-labelledby="recipe-details">
			<CardTitle id="recipe-details" className="border-b border-border pb-2">
				Details
			</CardTitle>
			<dl className="mt-3 grid gap-3 sm:grid-cols-2">
				{details.map((detail) => (
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
	);
};

const NotesSection = ({ snapshot }: { snapshot: BrewSnapshot }) => {
	return (
		<section aria-labelledby="recipe-notes">
			<CardTitle id="recipe-notes" className="border-b border-border pb-2">
				Notes
			</CardTitle>
			{snapshot.notes ? (
				<Text as="p" variant="body-sm" color="primary" className="mt-1.5">
					{snapshot.notes}
				</Text>
			) : (
				<Text as="p" variant="body-sm" color="muted" className="mt-1.5">
					No notes yet.
				</Text>
			)}
		</section>
	);
};

const RecipeOverview = () => {
	const { recipe } = routeApi.useLoaderData();

	return (
		<div className="flex flex-col gap-2">
			<StatusSuggestionBanner recipeId={recipe.id} />
			<Card>
				<CardContent className="flex flex-col gap-5">
					<div className="flex justify-end">
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
					<BrewParamsGrid snapshot={recipe.snapshot} />
					<DetailsGrid snapshot={recipe.snapshot} />
					<NotesSection snapshot={recipe.snapshot} />
				</CardContent>
			</Card>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId/overview")({
	component: RecipeOverview,
});
