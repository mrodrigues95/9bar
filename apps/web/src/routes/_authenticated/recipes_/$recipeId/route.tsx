import {
	Heading,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from "@9bar/toolkit";
import { DocumentIcon, FingerPrintIcon } from "@heroicons/react/24/solid";
import { createFileRoute } from "@tanstack/react-router";
import { AppBreadcrumbs } from "../../../../components";
import { RecipeLogs } from "./-recipe-logs/recipe-logs";
import { RecipeOverview } from "./-recipe-overview/recipe-overview";

const Recipe = () => {
	// TODO: Convert individual tabs to routes.
	return (
		<>
			<AppBreadcrumbs aria-label="Recipe navigation" className="mb-6" />
			<div className="flex flex-col gap-2">
				<Heading as="h1" variant="title">
					Recipe Name Here
				</Heading>
				<Tabs color="blue">
					<TabList aria-label="Manage <recipe_name_here>">
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
							<RecipeOverview />
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
			parent: "/_authenticated/recipes",
			label: () => "Recipe Name Here",
		},
	},
	component: Recipe,
});
