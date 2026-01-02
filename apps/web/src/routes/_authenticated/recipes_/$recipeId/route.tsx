import {
	Button,
	Card,
	CardFooter,
	CardHeader,
	CardPanel,
	Heading,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
} from "@9bar/toolkit";
import {
	ChevronDownIcon,
	FingerPrintIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumb, Breadcrumbs, Pagination } from "../../../../components";
import type { FileRouteTypes } from "../../../../routeTree.gen";

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
			<Heading variant="subtitle" as="p">
				Rancilio Silvia
			</Heading>
			<Text as="p" variant="body-sm">
				Eureka Mignon
			</Text>
		</div>
	);
};

const Recipe = () => {
	// const { recipeId } = Route.useParams();

	return (
		<>
			<nav aria-label="Recipe navigation" className="mb-6">
				<Breadcrumbs
					items={
						[
							{ id: "recipes", label: "Recipes", to: "/recipes" },
							{
								id: "recipe-id",
								label: "Recipe Name Here",
								to: "/recipes/$recipeId",
							},
						] satisfies Array<{
							id: string;
							label: string;
							to?: FileRouteTypes["to"];
						}>
					}
				>
					{(item) => (
						<Breadcrumb key={item.id} to={item.to}>
							{item.label}
						</Breadcrumb>
					)}
				</Breadcrumbs>
			</nav>
			<div className="flex flex-col gap-2">
				<Heading as="h1" variant="title">
					Recipe Name Here
				</Heading>
				<Tabs color="blue">
					<TabList aria-label="Manage this recipe">
						<Tab id="overview">
							<FingerPrintIcon />
							Overview
						</Tab>
						<Tab id="logs">
							<PencilIcon />
							Logs
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel id="overview" className="px-0">
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
											<MenuItem
												onAction={() => alert("delete")}
												variant="danger"
											>
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
						</TabPanel>
						<TabPanel id="logs" className="px-0">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between gap-4">
									<Heading variant="subtitle" as="p">
										Logs
									</Heading>
									<Button variant="solid" onPress={() => alert("new log")}>
										<PlusIcon />
										New Log
									</Button>
								</CardHeader>
								<CardPanel className="gap-4">foo</CardPanel>
								<CardFooter className="flex flex-row items-center justify-between border-t border-t-border pt-6">
									<Pagination />
								</CardFooter>
							</Card>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</div>
		</>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId")({
	component: Recipe,
});
