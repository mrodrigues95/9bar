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

export interface TLogEntry extends Omit<TLog, "recipeSnapshotId" | "recipeId"> {}

export interface TRecipeGraphBase extends Omit<TRecipe, "recipeSnapshotId" | "isQuickBrew"> {
	snapshot: TRecipeSnapshot;
}

export type TRecipeGraph =
	| (TRecipeGraphBase & { isQuickBrew: true; log: TLogEntry })
	| (TRecipeGraphBase & { isQuickBrew: false; logs: Array<TLogEntry> });

/** Hand-written fields for one dummy graph; ids and timestamps are derived from its list index. */
interface TRecipeSeed {
	/** Display name, or `null` for an unnamed quick brew. */
	name: string | null;
	/** Bean description shown as the first row meta item. */
	beans: string;
	/** Machine id from {@link MACHINE_OPTIONS}. */
	machine: string;
	/** Grinder id from {@link GRINDER_OPTIONS}. */
	grinder: string;
	grindSize: string;
	dose: number;
	yield: number;
	brewTime: number;
	brewTimeUnit: "s" | "m";
	/** Brew temperature. Defaults to `93` °C. */
	temperature?: number;
	temperatureUnit?: "C" | "F";
	notes?: string;
}

/** A quick-brew seed, which additionally carries the shot timestamp the row displays. */
interface TLogSeed extends TRecipeSeed {
	shotAt: string;
}

const BASE_TIMESTAMP = Date.UTC(2024, 0, 1, 8, 0, 0);
const DAY_MS = 24 * 60 * 60 * 1000;

/** One day after the previous graph, so seeded rows sort newest-first in a stable order. */
const timestampFor = (index: number) => {
	return new Date(BASE_TIMESTAMP + index * DAY_MS).toISOString();
};

/** Builds one log entry; callers keep ids unique across the quick-brew and saved-recipe spaces. */
const buildLog = (id: number, shotAt: string): TLogEntry => {
	return { id, uuid: `log-uuid-${id}`, shotAt, createdAt: shotAt, updatedAt: shotAt };
};

/** Snapshot fields shared by saved recipes and quick brews. */
const buildSnapshot = (index: number, seed: TRecipeSeed, timestamp: string): TRecipeSnapshot => {
	return {
		id: index + 1,
		uuid: `snapshot-uuid-${index + 1}`,
		recipeId: index + 1,
		grindSize: seed.grindSize,
		grinder: seed.grinder,
		machine: seed.machine,
		dose: seed.dose,
		yield: seed.yield,
		brewTime: seed.brewTime,
		brewTimeUnit: seed.brewTimeUnit,
		beans: seed.beans,
		temperature: seed.temperature ?? 93,
		temperatureUnit: seed.temperatureUnit ?? "C",
		pressure: 9,
		notes: seed.notes ?? null,
		createdAt: timestamp,
		updatedAt: timestamp,
	};
};

/** Builds a saved recipe; `shotAtList` fills its log history, in order. */
const savedRecipe = (
	index: number,
	seed: TRecipeSeed,
	shotAtList: Array<string> = [],
): TRecipeGraph => {
	const timestamp = timestampFor(index);
	return {
		id: index + 1,
		uuid: `uuid-${index + 1}`,
		name: seed.name,
		isQuickBrew: false,
		createdAt: timestamp,
		updatedAt: timestamp,
		snapshot: buildSnapshot(index, seed, timestamp),
		logs: shotAtList.map((shotAt, position) => buildLog(1000 + index * 10 + position, shotAt)),
	};
};

/** Builds a quick brew whose recipe and log both carry the shot timestamp. */
const quickBrew = (index: number, seed: TLogSeed): TRecipeGraph => {
	const { shotAt } = seed;
	return {
		id: index + 1,
		uuid: `uuid-${index + 1}`,
		name: seed.name,
		isQuickBrew: true,
		createdAt: shotAt,
		updatedAt: shotAt,
		snapshot: buildSnapshot(index, seed, shotAt),
		log: buildLog(index + 1, shotAt),
	};
};

/** Dummy graph list standing in for the API; 17 recipes and 9 quick brews across 3 pages. */
export const recipes: Array<TRecipeGraph> = [
	savedRecipe(
		0,
		{
			name: "Morning Espresso",
			beans: "Sunset Roast Espresso Blend",
			machine: "rancilio-silvia",
			grinder: "eureka-mignon",
			grindSize: "6",
			dose: 18,
			yield: 36,
			brewTime: 28,
			brewTimeUnit: "s",
			notes: "Sweet caramel aroma, balanced acidity.",
		},
		["2024-06-01T12:05:00Z", "2024-06-02T07:40:00Z", "2024-06-03T07:55:00Z"],
	),
	quickBrew(1, {
		name: null,
		beans: "Stumptown · Hair Bender",
		machine: "gaggia-classic",
		grinder: "eureka-mignon",
		grindSize: "3",
		dose: 20,
		yield: 40,
		brewTime: 31,
		brewTimeUnit: "s",
		temperature: 200,
		temperatureUnit: "F",
		notes: "Rich and chocolatey with a smooth finish.",
		shotAt: "2024-06-01T14:30:00Z",
	}),
	savedRecipe(2, {
		name: "Ethiopia Guji Natural",
		beans: "Ethiopia Guji · washed · light roast · Finca La Esperanza lot 14",
		machine: "lelit-bianca",
		grinder: "niche-zero",
		grindSize: "9",
		dose: 17,
		yield: 34,
		brewTime: 30,
		brewTimeUnit: "s",
		notes: "Blueberry and jasmine, delicate body.",
	}),
	savedRecipe(3, {
		name: "Sunset Roast Espresso",
		beans: "Sunset Roast Espresso Blend",
		machine: "rancilio-silvia",
		grinder: "eureka-mignon",
		grindSize: "6",
		dose: 18,
		yield: 36,
		brewTime: 27,
		brewTimeUnit: "s",
	}),
	quickBrew(4, {
		name: null,
		beans: "House Espresso · medium-dark",
		machine: "breville-barista",
		grinder: "baratza-sette",
		grindSize: "11",
		dose: 18.5,
		yield: 37,
		brewTime: 27,
		brewTimeUnit: "s",
		shotAt: "2024-06-02T06:50:00Z",
	}),
	savedRecipe(5, {
		name: "Colombia Huila",
		beans: "Finca La Esperanza · honey processed · medium roast · Huila, Colombia",
		machine: "lelit-bianca",
		grinder: "niche-zero",
		grindSize: "10",
		dose: 16,
		yield: 32,
		brewTime: 33,
		brewTimeUnit: "s",
		notes: "Red apple and panela sweetness.",
	}),
	savedRecipe(6, {
		name: "Kenya AA Nyeri",
		beans: "Kenya AA · washed · Gichathaini factory",
		machine: "la-pavoni",
		grinder: "comandante",
		grindSize: "12 clicks",
		dose: 14,
		yield: 28,
		brewTime: 26,
		brewTimeUnit: "s",
	}),
	quickBrew(7, {
		name: null,
		beans: "Sunset Roast Espresso Blend",
		machine: "gaggia-classic",
		grinder: "eureka-mignon",
		grindSize: "4",
		dose: 18,
		yield: 36,
		brewTime: 29,
		brewTimeUnit: "s",
		shotAt: "2024-06-03T09:15:00Z",
	}),
	savedRecipe(8, {
		name: "House Espresso",
		beans: "House Espresso · medium-dark",
		machine: "breville-barista",
		grinder: "baratza-sette",
		grindSize: "9",
		dose: 18,
		yield: 36,
		brewTime: 25,
		brewTimeUnit: "s",
		notes: "Baseline recipe for the Breville basket.",
	}),
	quickBrew(9, {
		name: null,
		beans: "Swiss Water Decaf · medium",
		machine: "lelit-bianca",
		grinder: "niche-zero",
		grindSize: "8",
		dose: 17,
		yield: 34,
		brewTime: 31,
		brewTimeUnit: "s",
		shotAt: "2024-06-04T20:10:00Z",
	}),
	savedRecipe(10, {
		name: "Brazil Cerrado Yellow Bourbon",
		beans: "Brazil Cerrado · natural · Yellow Bourbon",
		machine: "rancilio-silvia",
		grinder: "eureka-mignon",
		grindSize: "5",
		dose: 19,
		yield: 38,
		brewTime: 30,
		brewTimeUnit: "s",
	}),
	savedRecipe(11, {
		name: "Guatemala Antigua",
		beans: "Guatemala Antigua · washed · Bourbon",
		machine: "la-pavoni",
		grinder: "comandante",
		grindSize: "13 clicks",
		dose: 14,
		yield: 26,
		brewTime: 24,
		brewTimeUnit: "s",
	}),
	quickBrew(12, {
		name: null,
		beans: "House Espresso · medium-dark",
		machine: "breville-barista",
		grinder: "baratza-sette",
		grindSize: "10",
		dose: 18,
		yield: 39,
		brewTime: 28,
		brewTimeUnit: "s",
		shotAt: "2024-06-05T08:05:00Z",
	}),
	savedRecipe(13, {
		name: "Ethiopia Yirgacheffe Konga",
		beans: "Ethiopia Yirgacheffe · washed · Konga cooperative",
		machine: "lelit-bianca",
		grinder: "niche-zero",
		grindSize: "9",
		dose: 17,
		yield: 35,
		brewTime: 32,
		brewTimeUnit: "s",
	}),
	savedRecipe(14, {
		name: "Panama Geisha Esmeralda",
		beans: "Panama Geisha · washed · Hacienda La Esmeralda",
		machine: "other",
		grinder: "other",
		grindSize: "7",
		dose: 15,
		yield: 30,
		brewTime: 35,
		brewTimeUnit: "s",
		notes: "Floral and tea-like; brewed on the club machine.",
	}),
	quickBrew(15, {
		name: null,
		beans: "Decaf Brazil · medium",
		machine: "gaggia-classic",
		grinder: "eureka-mignon",
		grindSize: "4",
		dose: 18,
		yield: 36,
		brewTime: 30,
		brewTimeUnit: "s",
		shotAt: "2024-06-06T19:25:00Z",
	}),
	savedRecipe(16, {
		name: "Rwanda Nyungwe",
		beans: "Rwanda Nyungwe · washed · red Bourbon",
		machine: "rancilio-silvia",
		grinder: "eureka-mignon",
		grindSize: "6",
		dose: 18,
		yield: 36,
		brewTime: 29,
		brewTimeUnit: "s",
	}),
	savedRecipe(17, {
		name: "Costa Rica Tarrazú",
		beans: "Costa Rica Tarrazú · honey processed",
		machine: "breville-barista",
		grinder: "baratza-sette",
		grindSize: "9",
		dose: 18,
		yield: 34,
		brewTime: 26,
		brewTimeUnit: "s",
	}),
	savedRecipe(18, {
		name: "El Salvador Pacamara",
		beans: "El Salvador · Pacamara · natural",
		machine: "la-pavoni",
		grinder: "comandante",
		grindSize: "12 clicks",
		dose: 15,
		yield: 30,
		brewTime: 27,
		brewTimeUnit: "s",
	}),
	quickBrew(19, {
		name: null,
		beans: "Ethiopia Guji · washed · light roast",
		machine: "lelit-bianca",
		grinder: "niche-zero",
		grindSize: "9",
		dose: 17,
		yield: 36,
		brewTime: 33,
		brewTimeUnit: "s",
		shotAt: "2024-06-07T07:35:00Z",
	}),
	savedRecipe(20, {
		name: "Kenya Kirinyaga Karindundu",
		beans: "Kenya Kirinyaga · washed · Karindundu AA",
		machine: "rancilio-silvia",
		grinder: "eureka-mignon",
		grindSize: "5",
		dose: 17,
		yield: 38,
		brewTime: 31,
		brewTimeUnit: "s",
	}),
	savedRecipe(21, {
		name: "Sumatra Mandheling",
		beans: "Sumatra Mandheling · wet hulled",
		machine: "gaggia-classic",
		grinder: "other",
		grindSize: "2",
		dose: 19,
		yield: 36,
		brewTime: 29,
		brewTimeUnit: "s",
	}),
	quickBrew(22, {
		name: null,
		beans: "Honduras Santa Barbara",
		machine: "other",
		grinder: "comandante",
		grindSize: "13 clicks",
		dose: 14,
		yield: 28,
		brewTime: 28,
		brewTimeUnit: "s",
		shotAt: "2024-06-08T10:45:00Z",
	}),
	savedRecipe(23, {
		name: "Peru Cajamarca",
		beans: "Peru Cajamarca · washed · organic",
		machine: "breville-barista",
		grinder: "baratza-sette",
		grindSize: "10",
		dose: 18,
		yield: 36,
		brewTime: 28,
		brewTimeUnit: "s",
	}),
	savedRecipe(24, {
		name: "Bolivia Illimani AAA",
		beans: "Bolivia Illimani · washed · AAA",
		machine: "lelit-bianca",
		grinder: "niche-zero",
		grindSize: "8",
		dose: 18,
		yield: 36,
		brewTime: 30,
		brewTimeUnit: "s",
		notes: "Long pre-infusion at 3 bar.",
	}),
	quickBrew(25, {
		name: null,
		beans: "Tanzania Peaberry · washed",
		machine: "la-pavoni",
		grinder: "comandante",
		grindSize: "12 clicks",
		dose: 14,
		yield: 30,
		brewTime: 29,
		brewTimeUnit: "s",
		shotAt: "2024-06-09T08:20:00Z",
	}),
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
