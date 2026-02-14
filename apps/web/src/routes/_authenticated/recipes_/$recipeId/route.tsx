import {
	Heading,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from "@9bar/toolkit";
import { DocumentIcon, FingerPrintIcon } from "@heroicons/react/24/solid";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppBreadcrumbs } from "../../../../components";
import { recipes } from "../../../../utils/data";
import { RecipeLogs } from "./-recipe-logs/recipe-logs";
import { RecipeOverview } from "./-recipe-overview/recipe-overview";

const Recipe = () => {
	const recipe = Route.useLoaderData();

	// TODO: Convert individual tabs to routes.
	return (
		<>
			<AppBreadcrumbs aria-label="Recipe navigation" className="mb-6" />
			<div className="flex flex-col gap-2">
				<Heading as="h1" variant="title">
					{recipe.name}
				</Heading>
				<Tabs color="blue">
					<TabList aria-label={`Manage ${recipe.name}`}>
						<Tab id="overview">
							<FingerPrintIcon />
							Overview
						</Tab>
						<Tab id="logs">
							<DocumentIcon />
							Logs
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel id="overview" className="px-0">
							<RecipeOverview recipeId={recipe.id} />
						</TabPanel>
						<TabPanel id="logs" className="px-0">
							<RecipeLogs />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</div>
		</>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId")({
	staticData: {
		breadcrumb: {
			parentRouteId: "/_authenticated/recipes",
		},
	},
	loader: ({ params }) => {
		const recipe = recipes.find((r) => r.id === params.recipeId);

		if (!recipe || recipe.isQuickLog) {
			throw redirect({ to: "/recipes" });
		}

		return { ...recipe, breadcrumb: { label: recipe.name } };
	},
	component: Recipe,
});
