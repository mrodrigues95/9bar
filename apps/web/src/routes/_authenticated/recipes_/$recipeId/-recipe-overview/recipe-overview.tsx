import {
	Button,
	Card,
	CardHeader,
	CardPanel,
	Heading,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Text,
} from "@9bar/toolkit";
import {
	ChevronDownIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";

const RecipeNotes = () => {
	return (
		<Text as="p" variant="body" color="secondary">
			Sweet caramel aroma, balanced acidity.
		</Text>
	);
};

const RecipeDetails = () => {
	return (
		<dl>
			{[
				{
					id: "beans",
					label: "Beans",
					description: "Sunset Roast Espresso Blend",
				},
				{ id: "roast", label: "Roast", description: "Medium-Dark" },
				{ id: "grind", label: "Grind", description: "6 / Espresso" },
				{ id: "ratio", label: "Ratio", description: "1:2" },
			].map(({ id, label, description }) => (
				<div key={id} className="flex w-full gap-0.5">
					<Text
						as="dt"
						variant="body-sm"
						className="font-medium"
						color="primary"
					>
						{label}:
					</Text>
					<Text as="dd" variant="body-sm" color="secondary">
						{description}
					</Text>
				</div>
			))}
		</dl>
	);
};

// TODO: Reminder to self; eventually users can save their preferred log which is where these stats come from.
const RecipeStats = () => {
	return (
		<dl className="my-6 grid grid-cols-4 place-items-center text-center font-mono text-sm">
			{[
				{
					id: "dose",
					label: "Dose",
					description: "18g",
				},
				{ id: "yield", label: "Yield", description: "36g" },
				{ id: "time", label: "Time", description: "28s" },
				{ id: "temp", label: "Temp", description: "93°C" },
			].map(({ id, label, description }) => (
				<div key={id} className="flex flex-col-reverse">
					<Text as="dt" variant="body-sm" color="muted">
						{label}
					</Text>
					<Text
						as="dd"
						variant="body-sm"
						color="secondary"
						className="font-semibold"
					>
						{description}
					</Text>
				</div>
			))}
		</dl>
	);
};

const RecipeName = () => {
	return (
		<div>
			<Heading variant="section" as="p">
				Rancilio Silvia
			</Heading>
			<Text as="p" variant="body-sm">
				Eureka Mignon
			</Text>
		</div>
	);
};

export const RecipeOverview = () => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between gap-4">
				<RecipeName />
				<MenuTrigger>
					<Button variant="outline">
						Actions
						<ChevronDownIcon />
					</Button>
					<Menu>
						<MenuItem onAction={() => alert("rename")}>
							<PencilIcon className="size-3" />
							Edit
						</MenuItem>
						<MenuSeparator />
						<MenuItem onAction={() => alert("delete")} variant="danger">
							<TrashIcon className="size-3" />
							Delete
						</MenuItem>
					</Menu>
				</MenuTrigger>
			</CardHeader>
			<CardPanel className="gap-4">
				<RecipeStats />
				<RecipeDetails />
				<RecipeNotes />
			</CardPanel>
		</Card>
	);
};
