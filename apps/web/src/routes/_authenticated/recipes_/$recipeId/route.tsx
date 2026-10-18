import { createFileRoute, Outlet, redirect, useMatchRoute } from "@tanstack/react-router";
import { FileClock, FileText, Fingerprint } from "lucide-react";
import type { Key } from "react-aria-components";
import { Heading, Tabs, TabsContent, TabsList } from "@9bar/toolkit/components";
import { getRecipeHistoryEvents } from "../-recipe-history/history-events";
import { AppBreadcrumbs, TabLink, withBreadcrumb } from "../../../../components";
import { buildRecipeGraph } from "../../../../utils/data";
import { objectKeys } from "../../../../utils/utils";

const TABS = {
	overview: "overview",
	logs: "logs",
	history: "history",
} as const;

const Recipe = () => {
	const { recipe, historyTotal } = Route.useLoaderData();
	const matchRoute = useMatchRoute();
	const overviewMatch = matchRoute({
		to: "/recipes/$recipeId/overview",
		params: { recipeId: String(recipe.id) },
	});
	const historyMatch = matchRoute({
		to: "/recipes/$recipeId/history",
		params: { recipeId: String(recipe.id) },
	});

	let tab: Key = TABS.logs;
	if (overviewMatch) {
		tab = TABS.overview;
	} else if (historyMatch) {
		tab = TABS.history;
	}

	return (
		<>
			<AppBreadcrumbs aria-label="Recipe navigation" className="mb-6" />
			<div className="flex flex-col gap-2">
				<Heading as="h1" variant="title">
					{recipe.name}
				</Heading>
				<Tabs selectedKey={tab}>
					<TabsList aria-label={`Manage ${recipe.name}`}>
						<TabLink
							id={TABS.overview}
							to="/recipes/$recipeId/overview"
							params={{ recipeId: String(recipe.id) }}
						>
							<Fingerprint />
							Overview
						</TabLink>
						<TabLink
							id={TABS.logs}
							to="/recipes/$recipeId/logs"
							params={{ recipeId: String(recipe.id) }}
						>
							<FileText />
							Logs · {recipe.logs.length}
						</TabLink>
						<TabLink
							id={TABS.history}
							to="/recipes/$recipeId/history"
							params={{ recipeId: String(recipe.id) }}
						>
							<FileClock />
							History · {historyTotal}
						</TabLink>
					</TabsList>
					{objectKeys(TABS).map((key) => (
						<TabsContent id={TABS[key]} key={key} className="px-0">
							<Outlet />
						</TabsContent>
					))}
				</Tabs>
			</div>
		</>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId")({
	loader: ({ params }) => {
		const recipe = buildRecipeGraph(Number(params.recipeId));
		if (!recipe) {
			throw redirect({ to: "/recipes" });
		}

		return withBreadcrumb(
			{ recipe, historyTotal: getRecipeHistoryEvents(recipe.id).length },
			{ label: recipe.name },
		);
	},
	component: Recipe,
});
