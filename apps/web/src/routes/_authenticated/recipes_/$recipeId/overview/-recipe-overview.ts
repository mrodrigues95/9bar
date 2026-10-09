import { DateFormatter, parseAbsolute } from "@internationalized/date";
import {
	METHOD_LABELS,
	getBrewSnapshot,
	getRecipeSnapshots,
	type TBrewSnapshot,
	type TLog,
	type TRecipe,
	type TRecipeStatus,
} from "../../../../../utils/data";

const TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

const CHANGE_DATE_FORMATTER = new DateFormatter("en-GB", {
	day: "numeric",
	month: "short",
	timeZone: TIME_ZONE,
});

export const formatChangeDate = (changedAt: string): string => {
	return CHANGE_DATE_FORMATTER.format(parseAbsolute(changedAt, TIME_ZONE).toDate());
};

export const formatRatio = (snapshot: Pick<TBrewSnapshot, "dose" | "yield">): string => {
	if (snapshot.dose <= 0) {
		return "—";
	}
	return `1:${Math.round((snapshot.yield / snapshot.dose) * 10) / 10}`;
};

export interface TReferenceShot {
	log: TLog;
	snapshot: TBrewSnapshot;
	/** True when the shot is the recipe's pinned log, false when it fell back to the latest balanced shot. */
	pinned: boolean;
}

/** The pinned shot, or the newest balanced shot until one is pinned. */
export const resolveReferenceShot = (
	recipe: Pick<TRecipe, "pinnedLogId">,
	logs: Array<TLog>,
): TReferenceShot | null => {
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

export interface TStatusSuggestion {
	status: TRecipeStatus;
	reason: string;
}

const BALANCED_RUN_LENGTH = 3;
const OFF_RUN_LENGTH = 2;

const leadingRun = (logs: Array<TLog>, matches: (log: TLog) => boolean): number => {
	let count = 0;
	for (const log of logs) {
		if (!matches(log)) {
			break;
		}
		count += 1;
	}
	return count;
};

/** Derives a status suggestion from recent log verdicts; never suggests anything for a retired recipe. */
export const suggestRecipeStatus = (
	recipe: { status: TRecipeStatus | null },
	logs: Array<TLog>,
): TStatusSuggestion | null => {
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

	const recent = logs.slice(0, BALANCED_RUN_LENGTH);
	if (recent.length === BALANCED_RUN_LENGTH && recent.every((log) => log.verdict === "balanced")) {
		return {
			status: "dialed-in",
			reason: "The last three shots were all balanced. Mark this recipe as dialed in?",
		};
	}
	return null;
};

export interface TRecipeChangeLine {
	label: string;
	previous: string;
	next: string;
	changedAt: string;
}

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

const hasChanged = (previous: TBrewSnapshot, next: TBrewSnapshot, field: TChangeField): boolean => {
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

const formatValue = (snapshot: TBrewSnapshot, field: TChangeField): string => {
	switch (field) {
		case "method":
			return METHOD_LABELS[snapshot.method];
		case "brewTime":
			return `${snapshot.brewTime}${snapshot.brewTimeUnit}`;
		case "temperature":
			return `${snapshot.temperature}°${snapshot.temperatureUnit}`;
		case "dose":
			return `${snapshot.dose}g`;
		case "yield":
			return `${snapshot.yield}g`;
		case "pressure":
			return `${snapshot.pressure} bar`;
		case "notes":
			return snapshot.notes ?? "—";
		default:
			return snapshot[field];
	}
};

/** Diffs consecutive recipe versions, newest first. */
export const getRecipeChangeLines = (recipeId: number): Array<TRecipeChangeLine> => {
	const snapshots = getRecipeSnapshots(recipeId);
	const lines: Array<TRecipeChangeLine> = [];

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
