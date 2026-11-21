import {
	Bean,
	Bolt,
	Coffee,
	Cog,
	Droplets,
	Gauge,
	Refrigerator,
	Scale,
	Thermometer,
	Timer,
} from "lucide-react";
import { METHOD_LABELS, grinderName, machineName } from "./data";
import type { BrewSnapshot } from "./data";
import { formatBrewTime, formatGrams, formatPressure, formatTemperature } from "./format";

export const BREW_FIELDS = [
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

export type BrewField = (typeof BREW_FIELDS)[number];

export const BREW_FIELD_LABELS = {
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
} satisfies Record<BrewField, string>;

export const BREW_FIELD_ICONS = {
	method: Coffee,
	beans: Bean,
	machine: Refrigerator,
	grinder: Bolt,
	grindSize: Cog,
	dose: Scale,
	yield: Droplets,
	brewTime: Timer,
	temperature: Thermometer,
	pressure: Gauge,
};

export const isSameBrewField = (a: BrewSnapshot, b: BrewSnapshot, field: BrewField) => {
	if (field === "brewTime") {
		return a.brewTime === b.brewTime && a.brewTimeUnit === b.brewTimeUnit;
	}
	if (field === "temperature") {
		return a.temperature === b.temperature && a.temperatureUnit === b.temperatureUnit;
	}
	return a[field] === b[field];
};

export const formatBrewField = (snapshot: BrewSnapshot, field: BrewField) => {
	switch (field) {
		case "method":
			return METHOD_LABELS[snapshot.method] ?? snapshot.method;
		case "machine":
			return machineName(snapshot.machine);
		case "grinder":
			return grinderName(snapshot.grinder);
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
		case "beans":
		case "grindSize":
			return snapshot[field];
	}
};
