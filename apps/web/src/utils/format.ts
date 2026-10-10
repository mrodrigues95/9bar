import { DateFormatter } from "@internationalized/date";
import type { TBrewSnapshot } from "./data";

const SHOT_AT_FORMATTER = new DateFormatter("en-US", {
	day: "numeric",
	month: "short",
	hour: "numeric",
	minute: "2-digit",
	hour12: true,
});

const CHANGE_DATE_FORMATTER = new DateFormatter("en-US", {
	day: "numeric",
	month: "short",
});

export const formatShotAt = (shotAt: string) => {
	return SHOT_AT_FORMATTER.formatToParts(new Date(shotAt))
		.map((part) => (part.type === "dayPeriod" ? part.value.toUpperCase() : part.value))
		.join("");
};

export const formatChangeDate = (changedAt: string) => {
	return CHANGE_DATE_FORMATTER.format(new Date(changedAt));
};

export const formatBrewTime = (snapshot: Pick<TBrewSnapshot, "brewTime" | "brewTimeUnit">) => {
	return `${snapshot.brewTime}${snapshot.brewTimeUnit}`;
};

export const formatTemperature = (
	snapshot: Pick<TBrewSnapshot, "temperature" | "temperatureUnit">,
) => {
	return `${snapshot.temperature}°${snapshot.temperatureUnit}`;
};

export const formatGrams = (grams: number) => {
	return `${grams}g`;
};

export const formatPressure = (bar: number) => {
	return `${bar} bar`;
};
