import { Heading, TabList, TabPanel, TabPanels, Tabs } from "@9bar/toolkit";
import { DocumentIcon, FingerPrintIcon } from "@heroicons/react/24/solid";
import {
	createFileRoute,
	Outlet,
	redirect,
	useMatchRoute,
} from "@tanstack/react-router";
import type { Key } from "react-aria-components";
import {
	AppBreadcrumbs,
	TabLink,
	withBreadcrumb,
} from "../../../../components";
import { recipes } from "../../../../utils/data";
import { objectKeys } from "../../../../utils/utils";

const TABS = {
	overview: "overview",
	logs: "logs",
} as const;

const Recipe = () => {
	const { recipe } = Route.useLoaderData();
	const matchRoute = useMatchRoute();
	const overviewMatch = matchRoute({
		to: "/recipes/$recipeId/overview",
		params: { recipeId: String(recipe.id) },
	});
	const logsMatch = matchRoute({
		to: "/recipes/$recipeId/logs",
		params: { recipeId: String(recipe.id) },
	});

	let tab: Key | null = null;
	if (overviewMatch) {
		tab = TABS.overview;
	} else if (logsMatch) {
		tab = TABS.logs;
	}

	return (
		<>
			<AppBreadcrumbs aria-label="Recipe navigation" className="mb-6" />
			<div className="flex flex-col gap-2">
				<Heading as="h1" variant="title">
					{recipe.name ?? "(Untitled)"}
				</Heading>
				<Tabs color="blue" selectedKey={tab}>
					<TabList aria-label={`Manage ${recipe.name ?? "recipe"}`}>
						<TabLink
							id={TABS.overview}
							to="/recipes/$recipeId/overview"
							params={{ recipeId: String(recipe.id) }}
						>
							<FingerPrintIcon />
							Overview
						</TabLink>
						<TabLink
							id={TABS.logs}
							to="/recipes/$recipeId/logs"
							params={{ recipeId: String(recipe.id) }}
						>
							<DocumentIcon />
							Logs
						</TabLink>
					</TabList>
					<TabPanels>
						{objectKeys(TABS).map((key) => (
							<TabPanel id={TABS[key]} key={key} className="px-0">
								<Outlet />
							</TabPanel>
						))}
					</TabPanels>
				</Tabs>
			</div>
		</>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId")({
	loader: ({ params }) => {
		const recipe = recipes.find((r) => r.id === Number(params.recipeId));
		if (!recipe || recipe.isQuickBrew) {
			throw redirect({ to: "/recipes" });
		}

		return withBreadcrumb({ recipe }, { label: recipe.name ?? "(Untitled)" });
	},
	component: Recipe,
});
