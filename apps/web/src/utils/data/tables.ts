export type TMethod = "espresso" | "pour-over" | "immersion" | "other";
export type TVerdict = "under-extracted" | "balanced" | "over-extracted";
export type TRecipeStatus = "dialing-in" | "dialed-in" | "needs-retune" | "retired";

export interface TBrewSnapshot {
	id: number;
	uuid: string;
	recipeId: number | null;
	method: TMethod;
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

export type TBrewValues = Omit<
	TBrewSnapshot,
	"id" | "uuid" | "recipeId" | "createdAt" | "updatedAt"
>;

export interface TRecipe {
	id: number;
	uuid: string;
	name: string;
	brewSnapshotId: number;
	status: TRecipeStatus;
	pinnedLogId: number | null;
	createdAt: string;
	updatedAt: string;
}

export interface TLog {
	id: number;
	uuid: string;
	recipeId: number | null;
	brewSnapshotId: number;
	verdict: TVerdict | null;
	shotAt: string;
	createdAt: string;
	updatedAt: string;
}
