import {
	METHOD_LABELS,
	getBrewSnapshot,
	getRecipeSnapshots,
	type TBrewSnapshot,
	type TLog,
	type TRecipe,
	type TRecipeStatus,
} from "../../../../../utils/data";
import {
	formatBrewTime,
	formatGrams,
	formatPressure,
	formatTemperature,
} from "../../../../../utils/format";

export const formatRatio = (snapshot: Pick<TBrewSnapshot, "dose" | "yield">) => {
	if (snapshot.dose <= 0) {
		return "—";
	}
	return `1:${Math.round((snapshot.yield / snapshot.dose) * 10) / 10}`;
};

export const resolveReferenceShot = (recipe: Pick<TRecipe, "pinnedLogId">, logs: Array<TLog>) => {
	const pinned =
		recipe.pinnedLogId === null
			? null
			: (logs.find((log) => log.id === recipe.pinnedLogId) ?? null);
	if (pinned) {
		const snapshot = getBrewSnapshot(pinned.brewSnapshotId);
		if (snapshot) {
			return { log: pinned, snapshot, pinned: true };
		}
	}

	const balanced = logs.find((log) => log.verdict === "balanced");
	if (!balanced) {
		return null;
	}
	const snapshot = getBrewSnapshot(balanced.brewSnapshotId);
	if (!snapshot) {
		return null;
	}
	return { log: balanced, snapshot, pinned: false };
};

const BALANCED_RUN_LENGTH = 3;
const OFF_RUN_LENGTH = 2;

const leadingRun = (logs: Array<TLog>, matches: (log: TLog) => boolean) => {
	let count = 0;
	for (const log of logs) {
		if (!matches(log)) {
			break;
		}
		count += 1;
	}
	return count;
};

export const suggestRecipeStatus = (
	recipe: { status: TRecipeStatus | null },
	logs: Array<TLog>,
): { status: TRecipeStatus; reason: string } | null => {
	if (recipe.status === "retired") {
		return null;
	}

	if (recipe.status === "dialed-in") {
		const offRun = leadingRun(logs, (log) => log.verdict !== null && log.verdict !== "balanced");
		if (offRun >= OFF_RUN_LENGTH) {
			return {
				status: "needs-retune",
				reason: `The last ${offRun} shots pulled under or over. Retune this recipe?`,
			};
		}
		return null;
	}

	if (leadingRun(logs, (log) => log.verdict === "balanced") >= BALANCED_RUN_LENGTH) {
		return {
			status: "dialed-in",
			reason: "The last three shots were all balanced. Mark this recipe as dialed in?",
		};
	}
	return null;
};

const CHANGE_FIELDS = [
	"method",
	"beans",
	"machine",
	"grinder",
	"grindSize",
	"dose",
	"yield",
	"brewTime",
	"temperature",
	"pressure",
	"notes",
] as const;

type TChangeField = (typeof CHANGE_FIELDS)[number];

const CHANGE_FIELD_LABELS: Record<TChangeField, string> = {
	method: "Method",
	beans: "Beans",
	machine: "Machine",
	grinder: "Grinder",
	grindSize: "Grind",
	dose: "Dose",
	yield: "Yield",
	brewTime: "Brew time",
	temperature: "Temperature",
	pressure: "Pressure",
	notes: "Notes",
};

const hasChanged = (previous: TBrewSnapshot, next: TBrewSnapshot, field: TChangeField) => {
	if (field === "brewTime") {
		return previous.brewTime !== next.brewTime || previous.brewTimeUnit !== next.brewTimeUnit;
	}
	if (field === "temperature") {
		return (
			previous.temperature !== next.temperature || previous.temperatureUnit !== next.temperatureUnit
		);
	}
	return previous[field] !== next[field];
};

const formatValue = (snapshot: TBrewSnapshot, field: TChangeField) => {
	switch (field) {
		case "method":
			return METHOD_LABELS[snapshot.method] ?? snapshot.method;
		case "brewTime":
			return formatBrewTime(snapshot);
		case "temperature":
			return formatTemperature(snapshot);
		case "dose":
			return formatGrams(snapshot.dose);
		case "yield":
			return formatGrams(snapshot.yield);
		case "pressure":
			return formatPressure(snapshot.pressure);
		case "notes":
			return snapshot.notes ?? "—";
		default:
			return snapshot[field];
	}
};

export const getRecipeChangeLines = (recipeId: number) => {
	const snapshots = getRecipeSnapshots(recipeId);
	const lines: Array<{ label: string; previous: string; next: string; changedAt: string }> = [];

	for (let index = 0; index < snapshots.length - 1; index += 1) {
		const next = snapshots[index];
		const previous = snapshots[index + 1];
		if (!next || !previous) {
			continue;
		}
		for (const field of CHANGE_FIELDS) {
			if (!hasChanged(previous, next, field)) {
				continue;
			}
			lines.push({
				label: CHANGE_FIELD_LABELS[field],
				previous: formatValue(previous, field),
				next: formatValue(next, field),
				changedAt: next.createdAt,
			});
		}
	}

	return lines;
};
