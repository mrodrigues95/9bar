import { METHOD_LABELS, getRecipeSnapshots, type BrewSnapshot } from "../../../../utils/data";
import {
	formatBrewTime,
	formatGrams,
	formatPressure,
	formatTemperature,
} from "../../../../utils/format";

export const HISTORY_FIELDS = [
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
] as const;

export type HistoryField = (typeof HISTORY_FIELDS)[number];

export const HISTORY_FIELD_LABELS: Record<HistoryField, string> = {
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
};

interface HistoryChange {
	field: HistoryField;
	previous: string;
	next: string;
}

export interface HistoryEvent {
	id: number;
	dateTime: string;
	changes: Array<HistoryChange>;
}

const hasChanged = (previous: BrewSnapshot, next: BrewSnapshot, field: HistoryField) => {
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

const formatValue = (snapshot: BrewSnapshot, field: HistoryField) => {
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
		default:
			return snapshot[field];
	}
};

/**
 * Groups each recipe save's setting changes into newest-first events. Saves with no
 * tracked field changes (e.g. notes-only edits) produce no event.
 */
export const getRecipeHistoryEvents = (recipeId: number) => {
	const snapshots = getRecipeSnapshots(recipeId);
	const events: Array<HistoryEvent> = [];

	for (let index = 0; index < snapshots.length - 1; index += 1) {
		const next = snapshots[index];
		const previous = snapshots[index + 1];
		if (!next || !previous) {
			continue;
		}
		const changes: Array<HistoryChange> = [];
		for (const field of HISTORY_FIELDS) {
			if (!hasChanged(previous, next, field)) {
				continue;
			}
			changes.push({
				field,
				previous: formatValue(previous, field),
				next: formatValue(next, field),
			});
		}
		if (!changes.length) {
			continue;
		}
		events.push({ id: next.id, dateTime: next.createdAt, changes });
	}

	return events;
};
