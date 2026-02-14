export type TRecipe = {
	id: string;
	name: string;
	device: string;
	grinder: string;
	brewTime: string;
	dose: string;
	yield: string;
	beans: string;
	temperature: string;
	pressure: string;
	notes: string;
	isQuickLog: boolean;
	quickLogs: string[];
};

export const recipes: TRecipe[] = [
	{
		id: "1",
		name: "Ethiopian Yirgacheffe",
		device: "Gaggia Classic Pro",
		grinder: "Baratza Encore",
		brewTime: "22s",
		dose: "18g",
		yield: "36g",
		beans: 'Kicking Horse Coffee - "Three Sisters"',
		temperature: "205°F",
		pressure: "9 bar",
		notes: "Fruity and bright with floral notes.",
		isQuickLog: false,
		quickLogs: [],
	},
	{
		id: "2",
		name: "Colombian Supremo",
		device: "La Marzocco Linea Mini",
		grinder: "Hario Skerton",
		brewTime: "31s",
		dose: "20g",
		yield: "40g",
		beans: "Stumptown - Hair Bender",
		temperature: "200°F",
		pressure: "9 bar",
		notes: "Rich and chocolatey with a smooth finish.",
		isQuickLog: true,
		quickLogs: [],
	},
];
