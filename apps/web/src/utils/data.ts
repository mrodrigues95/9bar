export type TRecipe = {
	id: string;
	name: string;
	machine: string;
	grinder: string;
	grindSize: string;
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
		name: "Morning Espresso",
		grindSize: "6",
		grinder: "eureka-mignon",
		machine: "rancilio-silvia",
		dose: "18",
		yield: "36",
		brewTime: "28s",
		beans: "Sunset Roast Espresso Blend",
		temperature: "93°C",
		pressure: "9",
		isQuickLog: false,
		notes: "Sweet caramel aroma, balanced acidity.",
		quickLogs: [],
	},
	{
		id: "2",
		name: "Afternoon Delight",
		machine: "gaggia-classic",
		grinder: "eureka-mignon",
		grindSize: "3",
		brewTime: "31s",
		dose: "20",
		yield: "40",
		beans: "Stumptown - Hair Bender",
		temperature: "200°F",
		pressure: "9",
		notes: "Rich and chocolatey with a smooth finish.",
		isQuickLog: true,
		quickLogs: [],
	},
];
