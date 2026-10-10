import { toLabels } from "../utils";
import {
	type TBrewSnapshot,
	type TBrewValues,
	type TLog,
	type TMethod,
	type TRecipe,
	type TRecipeStatus,
	type TVerdict,
} from "./tables";

export interface TRecipeGraphBase {
	id: number;
	uuid: string;
	name: string | null;
	status: TRecipeStatus | null;
	pinnedLogId: number | null;
	createdAt: string;
	updatedAt: string;
	snapshot: TBrewSnapshot;
}

export type TRecipeGraph =
	| (TRecipeGraphBase & { isQuickBrew: true; log: TLog })
	| (TRecipeGraphBase & { isQuickBrew: false; logs: Array<TLog> });

const brewSnapshots: Array<TBrewSnapshot> = [];
export const recipes: Array<TRecipe> = [];
export const logs: Array<TLog> = [];

export const getBrewSnapshot = (id: number) => {
	return brewSnapshots.find((snapshot) => snapshot.id === id);
};

export const getRecipeSnapshots = (recipeId: number) => {
	return brewSnapshots
		.filter((snapshot) => snapshot.recipeId === recipeId)
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const getRecipeLogs = (recipeId: number) => {
	return logs
		.filter((log) => log.recipeId === recipeId)
		.sort((a, b) => b.shotAt.localeCompare(a.shotAt));
};

export const buildRecipeGraph = (id: number): TRecipeGraph | undefined => {
	const recipe = recipes.find((row) => row.id === id);
	if (recipe) {
		const snapshot = getBrewSnapshot(recipe.brewSnapshotId);
		if (!snapshot) {
			return undefined;
		}
		return {
			id: recipe.id,
			uuid: recipe.uuid,
			name: recipe.name,
			status: recipe.status,
			pinnedLogId: recipe.pinnedLogId,
			createdAt: recipe.createdAt,
			updatedAt: recipe.updatedAt,
			isQuickBrew: false,
			snapshot,
			logs: getRecipeLogs(recipe.id),
		};
	}

	const quickLog = logs.find((log) => log.id === id && log.recipeId === null);
	if (!quickLog) {
		return undefined;
	}
	const snapshot = getBrewSnapshot(quickLog.brewSnapshotId);
	if (!snapshot) {
		return undefined;
	}
	return {
		id: quickLog.id,
		uuid: quickLog.uuid,
		name: null,
		status: null,
		pinnedLogId: null,
		createdAt: quickLog.createdAt,
		updatedAt: quickLog.updatedAt,
		isQuickBrew: true,
		snapshot,
		log: quickLog,
	};
};

export const METHOD_OPTIONS = [
	{ id: "espresso", name: "Espresso" },
	{ id: "pour-over", name: "Pour over" },
	{ id: "immersion", name: "Immersion" },
	{ id: "other", name: "Other" },
] as const satisfies ReadonlyArray<{ id: TMethod; name: string }>;

export const VERDICT_OPTIONS = [
	{ id: "under-extracted", name: "Under-extracted" },
	{ id: "balanced", name: "Balanced" },
	{ id: "over-extracted", name: "Over-extracted" },
] as const satisfies ReadonlyArray<{ id: TVerdict; name: string }>;

export const RECIPE_STATUS_OPTIONS = [
	{ id: "dialing-in", name: "Dialing in" },
	{ id: "dialed-in", name: "Dialed in" },
	{ id: "needs-retune", name: "Needs retune" },
	{ id: "retired", name: "Retired" },
] as const satisfies ReadonlyArray<{ id: TRecipeStatus; name: string }>;

export const METHOD_LABELS = toLabels(METHOD_OPTIONS);
export const VERDICT_LABELS = toLabels(VERDICT_OPTIONS);
export const RECIPE_STATUS_LABELS = toLabels(RECIPE_STATUS_OPTIONS);

type TBrewValuesInput = Partial<TBrewValues> &
	Pick<
		TBrewValues,
		"beans" | "machine" | "grinder" | "grindSize" | "dose" | "yield" | "brewTime" | "brewTimeUnit"
	>;

const brewValues = (seed: TBrewValuesInput): TBrewValues => {
	return {
		method: "espresso",
		temperature: 93,
		temperatureUnit: "C",
		pressure: 9,
		notes: null,
		...seed,
	};
};

const applyOverrides = (values: TBrewValues, overrides: Partial<TBrewValues>) => {
	return { ...values, ...overrides };
};

interface TRecipeSeed {
	name: string;
	status?: TRecipeStatus;
	snapshots: [
		{ at: string; values: TBrewValues },
		...Array<{ at: string; values: Partial<TBrewValues> }>,
	];
	logs?: Array<{
		shotAt: string;
		verdict?: TVerdict;
		values?: Partial<TBrewValues>;
	}>;
	referenceLogIndex?: number;
}

let nextSnapshotId = 0;
let nextRecipeId = 0;
let nextLogId = 1000;

const createBrewSnapshot = (recipeId: number | null, values: TBrewValues, at: string) => {
	nextSnapshotId += 1;
	const snapshot: TBrewSnapshot = {
		id: nextSnapshotId,
		uuid: `snapshot-uuid-${nextSnapshotId}`,
		recipeId,
		...values,
		createdAt: at,
		updatedAt: at,
	};
	brewSnapshots.push(snapshot);
	return snapshot;
};

const createRecipe = (seed: TRecipeSeed) => {
	nextRecipeId += 1;
	const id = nextRecipeId;
	const [firstVersion, ...laterVersions] = seed.snapshots;
	let values = firstVersion.values;
	let current = createBrewSnapshot(id, values, firstVersion.at);

	for (const version of laterVersions) {
		values = applyOverrides(values, version.values);
		current = createBrewSnapshot(id, values, version.at);
	}

	const recipe: TRecipe = {
		id,
		uuid: `recipe-uuid-${id}`,
		name: seed.name,
		brewSnapshotId: current.id,
		status: seed.status ?? "dialing-in",
		pinnedLogId: null,
		createdAt: firstVersion.at,
		updatedAt: current.createdAt,
	};
	recipes.push(recipe);

	const createdLogs = (seed.logs ?? []).map((logSeed) => {
		nextLogId += 1;
		const snapshot = createBrewSnapshot(
			null,
			applyOverrides(values, logSeed.values ?? {}),
			logSeed.shotAt,
		);
		const log: TLog = {
			id: nextLogId,
			uuid: `log-uuid-${nextLogId}`,
			recipeId: id,
			brewSnapshotId: snapshot.id,
			verdict: logSeed.verdict ?? null,
			shotAt: logSeed.shotAt,
			createdAt: logSeed.shotAt,
			updatedAt: logSeed.shotAt,
		};
		logs.push(log);
		return log;
	});

	if (seed.referenceLogIndex !== undefined) {
		recipe.pinnedLogId = createdLogs[seed.referenceLogIndex]?.id ?? null;
	}

	return recipe;
};

const createQuickLog = (seed: { shotAt: string; verdict?: TVerdict; values: TBrewValues }) => {
	nextLogId += 1;
	const snapshot = createBrewSnapshot(null, seed.values, seed.shotAt);
	const log: TLog = {
		id: nextLogId,
		uuid: `log-uuid-${nextLogId}`,
		recipeId: null,
		brewSnapshotId: snapshot.id,
		verdict: seed.verdict ?? null,
		shotAt: seed.shotAt,
		createdAt: seed.shotAt,
		updatedAt: seed.shotAt,
	};
	logs.push(log);
	return log;
};

createRecipe({
	name: "Morning Espresso",
	status: "dialed-in",
	snapshots: [
		{
			at: "2024-05-20T08:00:00Z",
			values: brewValues({
				beans: "Sunset Roast Espresso Blend",
				machine: "rancilio-silvia",
				grinder: "eureka-mignon",
				grindSize: "6",
				dose: 18,
				yield: 36,
				brewTime: 30,
				brewTimeUnit: "s",
				notes: "Sweet caramel aroma, balanced acidity.",
			}),
		},
		{ at: "2024-06-03T07:00:00Z", values: { grindSize: "5.5", brewTime: 28 } },
	],
	logs: [
		{
			shotAt: "2024-06-01T12:05:00Z",
			verdict: "balanced",
			values: { grindSize: "6", brewTime: 30 },
		},
		{ shotAt: "2024-06-02T07:40:00Z", verdict: "over-extracted" },
		{ shotAt: "2024-06-03T07:55:00Z", verdict: "balanced" },
	],
	referenceLogIndex: 2,
});

createRecipe({
	name: "Ethiopia Guji Natural",
	status: "dialing-in",
	snapshots: [
		{
			at: "2024-05-26T08:00:00Z",
			values: brewValues({
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
		},
	],
	logs: [
		{ shotAt: "2024-05-28T07:30:00Z", verdict: "balanced" },
		{ shotAt: "2024-05-29T07:35:00Z", verdict: "balanced" },
		{ shotAt: "2024-05-30T07:40:00Z", verdict: "balanced" },
	],
});

createRecipe({
	name: "Sunset Roast Espresso",
	status: "dialing-in",
	snapshots: [
		{
			at: "2024-05-25T08:00:00Z",
			values: brewValues({
				beans: "Sunset Roast Espresso Blend",
				machine: "rancilio-silvia",
				grinder: "eureka-mignon",
				grindSize: "6",
				dose: 18,
				yield: 36,
				brewTime: 27,
				brewTimeUnit: "s",
			}),
		},
		{ at: "2024-06-04T07:00:00Z", values: { temperature: 94 } },
	],
	logs: [{ shotAt: "2024-06-04T07:45:00Z", verdict: "under-extracted" }],
});

createRecipe({
	name: "Colombia Huila",
	status: "dialed-in",
	snapshots: [
		{
			at: "2024-05-22T08:00:00Z",
			values: brewValues({
				method: "pour-over",
				beans: "Finca La Esperanza · honey processed · medium roast · Huila, Colombia",
				machine: "lelit-bianca",
				grinder: "niche-zero",
				grindSize: "10",
				dose: 16,
				yield: 250,
				brewTime: 2.5,
				brewTimeUnit: "m",
				temperature: 94,
				pressure: 0,
				notes: "Red apple and panela sweetness.",
			}),
		},
	],
	logs: [
		{ shotAt: "2024-05-27T09:10:00Z", verdict: "balanced" },
		{ shotAt: "2024-05-31T09:15:00Z", verdict: "balanced" },
	],
});

createRecipe({
	name: "Kenya AA Nyeri",
	snapshots: [
		{
			at: "2024-05-21T08:00:00Z",
			values: brewValues({
				beans: "Kenya AA · washed · Gichathaini factory",
				machine: "la-pavoni",
				grinder: "comandante",
				grindSize: "12 clicks",
				dose: 14,
				yield: 28,
				brewTime: 26,
				brewTimeUnit: "s",
			}),
		},
	],
	logs: [{ shotAt: "2024-05-26T08:05:00Z", verdict: "over-extracted" }],
});

createRecipe({
	name: "House Espresso",
	status: "needs-retune",
	snapshots: [
		{
			at: "2024-05-27T08:00:00Z",
			values: brewValues({
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
		},
		{ at: "2024-06-06T07:00:00Z", values: { grindSize: "8", brewTime: 24 } },
	],
	logs: [
		{ shotAt: "2024-06-05T08:05:00Z", verdict: "over-extracted" },
		{ shotAt: "2024-06-06T08:10:00Z", verdict: "over-extracted" },
		{ shotAt: "2024-06-07T08:15:00Z", verdict: "balanced" },
	],
});

createRecipe({
	name: "Brazil Cerrado Yellow Bourbon",
	status: "retired",
	snapshots: [
		{
			at: "2024-05-18T08:00:00Z",
			values: brewValues({
				beans: "Brazil Cerrado · natural · Yellow Bourbon",
				machine: "rancilio-silvia",
				grinder: "eureka-mignon",
				grindSize: "5",
				dose: 19,
				yield: 38,
				brewTime: 30,
				brewTimeUnit: "s",
			}),
		},
	],
	logs: [
		{ shotAt: "2024-05-25T07:20:00Z", verdict: "balanced" },
		{ shotAt: "2024-05-26T07:25:00Z", verdict: "balanced" },
	],
});

createRecipe({
	name: "Guatemala Antigua",
	status: "dialed-in",
	snapshots: [
		{
			at: "2024-05-19T08:00:00Z",
			values: brewValues({
				method: "immersion",
				beans: "Guatemala Antigua · washed · Bourbon",
				machine: "la-pavoni",
				grinder: "comandante",
				grindSize: "13 clicks",
				dose: 14,
				yield: 220,
				brewTime: 2,
				brewTimeUnit: "m",
				temperature: 85,
				pressure: 0,
			}),
		},
	],
	logs: [{ shotAt: "2024-05-24T09:00:00Z", verdict: "balanced" }],
});

createRecipe({
	name: "Ethiopia Yirgacheffe Konga",
	snapshots: [
		{
			at: "2024-05-23T08:00:00Z",
			values: brewValues({
				method: "pour-over",
				beans: "Ethiopia Yirgacheffe · washed · Konga cooperative",
				machine: "lelit-bianca",
				grinder: "niche-zero",
				grindSize: "9",
				dose: 17,
				yield: 255,
				brewTime: 2.75,
				brewTimeUnit: "m",
				temperature: 96,
				pressure: 0,
			}),
		},
	],
	logs: [
		{ shotAt: "2024-05-27T10:15:00Z", verdict: "under-extracted" },
		{ shotAt: "2024-05-28T10:20:00Z", verdict: "balanced" },
	],
});

createRecipe({
	name: "Panama Geisha Esmeralda",
	snapshots: [
		{
			at: "2024-05-24T08:00:00Z",
			values: brewValues({
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
		},
	],
	logs: [{ shotAt: "2024-05-29T11:30:00Z", verdict: "balanced" }],
});

createRecipe({
	name: "Rwanda Nyungwe",
	snapshots: [
		{
			at: "2024-05-28T08:00:00Z",
			values: brewValues({
				beans: "Rwanda Nyungwe · washed · red Bourbon",
				machine: "rancilio-silvia",
				grinder: "eureka-mignon",
				grindSize: "6",
				dose: 18,
				yield: 36,
				brewTime: 29,
				brewTimeUnit: "s",
			}),
		},
	],
});

createRecipe({
	name: "Costa Rica Tarrazú",
	snapshots: [
		{
			at: "2024-05-29T08:00:00Z",
			values: brewValues({
				beans: "Costa Rica Tarrazú · honey processed",
				machine: "breville-barista",
				grinder: "baratza-sette",
				grindSize: "9",
				dose: 18,
				yield: 34,
				brewTime: 26,
				brewTimeUnit: "s",
			}),
		},
		{ at: "2024-06-08T07:00:00Z", values: { notes: "Bright and juicy; drop the dose next time." } },
	],
});

createRecipe({
	name: "El Salvador Pacamara",
	snapshots: [
		{
			at: "2024-05-30T08:00:00Z",
			values: brewValues({
				method: "immersion",
				beans: "El Salvador · Pacamara · natural",
				machine: "la-pavoni",
				grinder: "comandante",
				grindSize: "12 clicks",
				dose: 15,
				yield: 230,
				brewTime: 2.25,
				brewTimeUnit: "m",
				temperature: 88,
				pressure: 0,
			}),
		},
	],
	logs: [{ shotAt: "2024-06-02T09:45:00Z", verdict: "over-extracted" }],
});

createRecipe({
	name: "Kenya Kirinyaga Karindundu",
	snapshots: [
		{
			at: "2024-05-31T08:00:00Z",
			values: brewValues({
				beans: "Kenya Kirinyaga · washed · Karindundu AA",
				machine: "rancilio-silvia",
				grinder: "eureka-mignon",
				grindSize: "5",
				dose: 17,
				yield: 38,
				brewTime: 31,
				brewTimeUnit: "s",
			}),
		},
	],
});

createRecipe({
	name: "Sumatra Mandheling",
	snapshots: [
		{
			at: "2024-06-01T08:00:00Z",
			values: brewValues({
				method: "immersion",
				beans: "Sumatra Mandheling · wet hulled",
				machine: "gaggia-classic",
				grinder: "other",
				grindSize: "2",
				dose: 19,
				yield: 230,
				brewTime: 2.5,
				brewTimeUnit: "m",
				temperature: 92,
				pressure: 0,
			}),
		},
	],
	logs: [
		{ shotAt: "2024-06-03T08:30:00Z", verdict: "balanced" },
		{ shotAt: "2024-06-04T08:35:00Z", verdict: "balanced" },
	],
});

createRecipe({
	name: "Peru Cajamarca",
	snapshots: [
		{
			at: "2024-06-02T08:00:00Z",
			values: brewValues({
				beans: "Peru Cajamarca · washed · organic",
				machine: "breville-barista",
				grinder: "baratza-sette",
				grindSize: "10",
				dose: 18,
				yield: 36,
				brewTime: 28,
				brewTimeUnit: "s",
			}),
		},
		{ at: "2024-06-07T07:00:00Z", values: { dose: 17 } },
	],
});

createRecipe({
	name: "Bolivia Illimani AAA",
	status: "dialed-in",
	snapshots: [
		{
			at: "2024-05-17T08:00:00Z",
			values: brewValues({
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
		},
		{ at: "2024-06-05T07:00:00Z", values: { temperature: 92 } },
	],
	logs: [
		{ shotAt: "2024-05-30T07:50:00Z", verdict: "balanced" },
		{ shotAt: "2024-06-01T07:55:00Z", verdict: "balanced" },
		{ shotAt: "2024-06-05T08:00:00Z", verdict: "balanced" },
	],
	referenceLogIndex: 2,
});

createRecipe({
	name: "Honduras Santa Barbara",
	snapshots: [
		{
			at: "2024-06-03T08:00:00Z",
			values: brewValues({
				method: "pour-over",
				beans: "Honduras Santa Barbara",
				machine: "other",
				grinder: "comandante",
				grindSize: "13 clicks",
				dose: 14,
				yield: 210,
				brewTime: 2.5,
				brewTimeUnit: "m",
				temperature: 95,
				pressure: 0,
			}),
		},
	],
});

createRecipe({
	name: "Tanzania Peaberry",
	snapshots: [
		{
			at: "2024-06-04T08:00:00Z",
			values: brewValues({
				beans: "Tanzania Peaberry · washed",
				machine: "la-pavoni",
				grinder: "comandante",
				grindSize: "12 clicks",
				dose: 14,
				yield: 30,
				brewTime: 29,
				brewTimeUnit: "s",
			}),
		},
	],
	logs: [{ shotAt: "2024-06-05T09:05:00Z", verdict: "balanced" }],
});

createQuickLog({
	shotAt: "2024-06-01T14:30:00Z",
	verdict: "balanced",
	values: brewValues({
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
	}),
});

createQuickLog({
	shotAt: "2024-06-02T06:50:00Z",
	verdict: "balanced",
	values: brewValues({
		beans: "House Espresso · medium-dark",
		machine: "breville-barista",
		grinder: "baratza-sette",
		grindSize: "11",
		dose: 18.5,
		yield: 37,
		brewTime: 27,
		brewTimeUnit: "s",
	}),
});

createQuickLog({
	shotAt: "2024-06-03T09:15:00Z",
	verdict: "over-extracted",
	values: brewValues({
		beans: "Sunset Roast Espresso Blend",
		machine: "gaggia-classic",
		grinder: "eureka-mignon",
		grindSize: "4",
		dose: 18,
		yield: 36,
		brewTime: 29,
		brewTimeUnit: "s",
	}),
});

createQuickLog({
	shotAt: "2024-06-04T20:10:00Z",
	verdict: "balanced",
	values: brewValues({
		beans: "Swiss Water Decaf · medium",
		machine: "lelit-bianca",
		grinder: "niche-zero",
		grindSize: "8",
		dose: 17,
		yield: 34,
		brewTime: 31,
		brewTimeUnit: "s",
	}),
});

createQuickLog({
	shotAt: "2024-06-05T08:05:00Z",
	verdict: "under-extracted",
	values: brewValues({
		beans: "House Espresso · medium-dark",
		machine: "breville-barista",
		grinder: "baratza-sette",
		grindSize: "10",
		dose: 18,
		yield: 39,
		brewTime: 28,
		brewTimeUnit: "s",
	}),
});

createQuickLog({
	shotAt: "2024-06-06T19:25:00Z",
	verdict: "balanced",
	values: brewValues({
		beans: "Decaf Brazil · medium",
		machine: "gaggia-classic",
		grinder: "eureka-mignon",
		grindSize: "4",
		dose: 18,
		yield: 36,
		brewTime: 30,
		brewTimeUnit: "s",
	}),
});

createQuickLog({
	shotAt: "2024-06-07T07:35:00Z",
	verdict: "balanced",
	values: brewValues({
		beans: "Ethiopia Guji · washed · light roast",
		machine: "lelit-bianca",
		grinder: "niche-zero",
		grindSize: "9",
		dose: 17,
		yield: 36,
		brewTime: 33,
		brewTimeUnit: "s",
	}),
});

createQuickLog({
	shotAt: "2024-06-08T10:45:00Z",
	verdict: "balanced",
	values: brewValues({
		method: "pour-over",
		beans: "Honduras Santa Barbara",
		machine: "other",
		grinder: "comandante",
		grindSize: "13 clicks",
		dose: 14,
		yield: 220,
		brewTime: 2.5,
		brewTimeUnit: "m",
		temperature: 95,
		pressure: 0,
	}),
});

createQuickLog({
	shotAt: "2024-06-09T08:20:00Z",
	verdict: "balanced",
	values: brewValues({
		beans: "Tanzania Peaberry · washed",
		machine: "la-pavoni",
		grinder: "comandante",
		grindSize: "12 clicks",
		dose: 14,
		yield: 30,
		brewTime: 29,
		brewTimeUnit: "s",
	}),
});

createQuickLog({
	shotAt: "2024-06-10T07:10:00Z",
	verdict: "over-extracted",
	values: brewValues({
		beans: "Kenya AA · washed",
		machine: "rancilio-silvia",
		grinder: "eureka-mignon",
		grindSize: "6",
		dose: 17,
		yield: 34,
		brewTime: 30,
		brewTimeUnit: "s",
	}),
});

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

export const machineName = (id: string) => {
	return MACHINE_OPTIONS.find((option) => option.id === id)?.name ?? id;
};

export const grinderName = (id: string) => {
	return GRINDER_OPTIONS.find((option) => option.id === id)?.name ?? id;
};
