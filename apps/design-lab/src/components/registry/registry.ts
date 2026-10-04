import type { ComponentType } from "react";
import { HomeHeroA } from "./variants/home-hero-a";
import { HomeHeroB } from "./variants/home-hero-b";
import { RecipeModalA } from "./variants/recipe-modal-a";
import { RecipeModalB } from "./variants/recipe-modal-b";
import { RecipeOverviewA } from "./variants/recipe-overview-a";
import { RecipeOverviewB } from "./variants/recipe-overview-b";
import { RecipeOverviewC } from "./variants/recipe-overview-c";
import { RecipeOverviewD } from "./variants/recipe-overview-d";
import { RecipeSectionA } from "./variants/recipe-section-a";

export type DesignVariantEntry = {
	id: string;
	title: string;
	kind: "page" | "section";
	description: string;
	surface?: "framed" | "plain";
	component: ComponentType;
};

export type DesignGroup = {
	id: string;
	title: string;
	question: string;
	variants: Array<DesignVariantEntry>;
};

export const designGroups: Array<DesignGroup> = [
	{
		id: "home-hero",
		title: "Home hero",
		question: "Centered-safe vs split-rich — which hero direction?",
		variants: [
			{
				id: "home-hero-a",
				title: "Home hero A — centered",
				kind: "page",
				description: "Centered headline, dual CTA, stat strip. Safe, classic direction.",
				component: HomeHeroA,
			},
			{
				id: "home-hero-b",
				title: "Home hero B — split with pick",
				kind: "page",
				description: "Split layout with a featured recipe card. Richer, more 9bar flavor.",
				component: HomeHeroB,
			},
		],
	},
	{
		id: "recipe-section",
		title: "Recipe section",
		question: "Which card treatment should the recipe section use?",
		variants: [
			{
				id: "recipe-section-a",
				title: "Recipe list section A — cards",
				kind: "section",
				description: "Section-scoped mock: recipe cards grid to drop into a page later.",
				component: RecipeSectionA,
			},
		],
	},
	{
		id: "recipe-overview",
		title: "Recipe overview",
		question: "Which page structure best balances recipe details, actions, and shot logs?",
		variants: [
			{
				id: "recipe-overview-a",
				title: "Overview A — stacked single column",
				kind: "page",
				description:
					"Header actions, stat strip, details card, then logs card with New Log, row actions, and pagination.",
				component: RecipeOverviewA,
			},
			{
				id: "recipe-overview-b",
				title: "Overview B — sidebar summary",
				kind: "page",
				description:
					"Sticky summary card with stacked Edit/Delete beside tabbed Overview/Logs content.",
				component: RecipeOverviewB,
			},
			{
				id: "recipe-overview-c",
				title: "Overview C — header band with tabs",
				kind: "page",
				description:
					"Header band with Edit, New Log, and overflow Delete above line-style Overview/Logs tabs.",
				component: RecipeOverviewC,
			},
			{
				id: "recipe-overview-d",
				title: "Overview D — revised band (feedback)",
				kind: "page",
				description:
					"Revision of C: web breadcrumbs, vertical line tabs, menu-only Edit, ghost overflow, checkmark badge, grey page background.",
				component: RecipeOverviewD,
			},
		],
	},
	{
		id: "recipe-modal",
		title: "Recipe detail modal",
		question:
			"Which modal structure best presents recipe details plus searchable, filterable, paginated logs?",
		variants: [
			{
				id: "recipe-modal-a",
				title: "Modal A — single scroll",
				kind: "page",
				description:
					"One scrolling panel: details on top, then search, outcome filter, log rows, and pagination.",
				component: RecipeModalA,
			},
			{
				id: "recipe-modal-b",
				title: "Modal B — details/logs tabs",
				kind: "page",
				description:
					"Tabbed panel: Details grid behind one tab, searchable and filterable logs behind the other.",
				component: RecipeModalB,
			},
		],
	},
];
