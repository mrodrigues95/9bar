export interface TRecipe {
	id: number;
	uuid: string;
	name: string | null;
	isQuickBrew: boolean;
	recipeSnapshotId: string;
	createdAt: string;
	updatedAt: string;
}

export interface TRecipeSnapshot {
	id: number;
	uuid: string;
	recipeId: number;
	machine: string;
	grinder: string;
	grindSize: string;
	dose: number;
	yield: number;
	brewTime: number;
	brewTimeUnit: "s" | "m";
	beans: string;
	temperature: number;
	temperatureUnit: "C" | "F";
	pressure: number;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface TLog {
	id: number;
	uuid: string;
	recipeId: number;
	recipeSnapshotId: number;
	shotAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface TLogEntry
	extends Omit<TLog, "recipeSnapshotId" | "recipeId"> {}

export interface TRecipeGraphBase
	extends Omit<TRecipe, "recipeSnapshotId" | "isQuickBrew"> {
	snapshot: TRecipeSnapshot;
}

export type TRecipeGraph =
	| (TRecipeGraphBase & { isQuickBrew: true; log: TLogEntry })
	| (TRecipeGraphBase & { isQuickBrew: false; logs: Array<TLogEntry> });

export const recipes: Array<TRecipeGraph> = [
	{
		id: 1,
		uuid: "uuid-1",
		name: "Morning Espresso",
		isQuickBrew: false,
		createdAt: "2024-01-01T08:00:00Z",
		updatedAt: "2024-01-01T08:00:00Z",
		snapshot: {
			id: 1,
			uuid: "snapshot-uuid-1",
			recipeId: 1,
			grindSize: "6",
			grinder: "eureka-mignon",
			machine: "rancilio-silvia",
			dose: 18,
			yield: 36,
			brewTime: 28,
			brewTimeUnit: "s",
			beans: "Sunset Roast Espresso Blend",
			temperature: 93,
			temperatureUnit: "C",
			pressure: 9,
			notes: "Sweet caramel aroma, balanced acidity.",
			createdAt: "2024-01-01T08:00:00Z",
			updatedAt: "2024-01-01T08:00:00Z",
		},
		logs: [],
	},
	{
		id: 2,
		uuid: "uuid-2",
		name: "",
		isQuickBrew: true,
		createdAt: "2024-06-01T14:00:00Z",
		updatedAt: "2024-06-01T14:00:00Z",
		snapshot: {
			id: 2,
			uuid: "snapshot-uuid-2",
			recipeId: 2,
			machine: "gaggia-classic",
			grinder: "eureka-mignon",
			grindSize: "3",
			brewTime: 31,
			brewTimeUnit: "s",
			dose: 20,
			yield: 40,
			beans: "Stumptown - Hair Bender",
			temperature: 200,
			temperatureUnit: "F",
			pressure: 9,
			notes: "Rich and chocolatey with a smooth finish.",
			createdAt: "2024-06-01T14:00:00Z",
			updatedAt: "2024-06-01T14:00:00Z",
		},
		log: {
			id: 1,
			uuid: "log-uuid-1",
			shotAt: "2024-06-01T14:30:00Z",
			createdAt: "2024-06-01T14:30:00Z",
			updatedAt: "2024-06-01T14:30:00Z",
		},
	},
];

export const MACHINE_OPTIONS = [
	{ id: "la-pavoni", name: "La Pavoni" },
	{ id: "gaggia-classic", name: "Gaggia Classic" },
	{ id: "rancilio-silvia", name: "Rancilio Silvia" },
	{ id: "breville-barista", name: "Breville Barista Express" },
	{ id: "lelit-bianca", name: "Lelit Bianca" },
	{ id: "other", name: "Other" },
] as const;

export const GRINDER_OPTIONS = [
	{ id: "comandante", name: "Comandante" },
	{ id: "niche-zero", name: "Niche Zero" },
	{ id: "baratza-sette", name: "Baratza Sette 270" },
	{ id: "eureka-mignon", name: "Eureka Mignon" },
	{ id: "other", name: "Other" },
] as const;
