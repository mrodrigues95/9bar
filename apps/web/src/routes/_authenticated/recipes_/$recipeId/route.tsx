import {
	Button,
	Card,
	Heading,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Text,
} from "@9bar/toolkit";
import {
	ArrowLeftIcon,
	ChevronDownIcon,
	FingerPrintIcon,
	PencilIcon,
	SquaresPlusIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "../../../../components";

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
		<div className="flex items-center gap-2.5">
			<FingerPrintIcon className="w-8" />
			<div className="flex-1">
				<Heading variant="subtitle" as="p">
					Rancilio Silvia
				</Heading>
				<Text as="p" variant="body-sm">
					Eureka Mignon
				</Text>
			</div>
		</div>
	);
};

const Recipe = () => {
	// const { recipeId } = Route.useParams();

	return (
		<section className="flex flex-col gap-2">
			<Link
				variant="link"
				to="/recipes"
				className="w-fit text-slate-500 hover:text-slate-900 focus-visible:text-slate-900"
			>
				<ArrowLeftIcon />
				Go back
			</Link>
			<Card>
				<Card.Header className="flex flex-row items-center justify-between gap-4">
					<Heading as="h1" variant="title">
						Recipe Name Here
					</Heading>
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
							<MenuItem onAction={() => alert("rename")}>
								<SquaresPlusIcon className="size-3" />
								Log
							</MenuItem>
							<MenuSeparator />
							<MenuItem onAction={() => alert("delete")} variant="danger">
								<TrashIcon className="size-3" />
								Delete
							</MenuItem>
						</Menu>
					</MenuTrigger>
				</Card.Header>
				<Card.Panel className="gap-4">
					<RecipeName />
					<RecipeStats />
					<RecipeDetails />
					<RecipeNotes />
					<p>todo: implement log section here with pagination</p>
				</Card.Panel>
			</Card>
		</section>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId")({
	component: Recipe,
});
