export type Method = "espresso" | "pour-over" | "immersion" | "other";
export type Verdict = "under-extracted" | "balanced" | "over-extracted";
export type RecipeStatus = "dialing-in" | "dialed-in" | "needs-retune" | "retired";

export interface BrewSnapshot {
	id: number;
	uuid: string;
	recipeId: number | null;
	method: Method;
	beans: string;
	machine: string;
	grinder: string;
	grindSize: string;
	dose: number;
	yield: number;
	brewTime: number;
	brewTimeUnit: "s" | "m";
	temperature: number;
	temperatureUnit: "C" | "F";
	pressure: number;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
}

export type BrewValues = Omit<BrewSnapshot, "id" | "uuid" | "recipeId" | "createdAt" | "updatedAt">;

export interface Recipe {
	id: number;
	uuid: string;
	name: string;
	brewSnapshotId: number;
	status: RecipeStatus;
	pinnedLogId: number | null;
	createdAt: string;
	updatedAt: string;
}

export interface Log {
	id: number;
	uuid: string;
	recipeId: number | null;
	brewSnapshotId: number;
	verdict: Verdict | null;
	shotAt: string;
	createdAt: string;
	updatedAt: string;
}

export type RecipeGraph = Recipe & { snapshot: BrewSnapshot; logs: Array<Log> };
