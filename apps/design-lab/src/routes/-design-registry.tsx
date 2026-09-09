import type { ComponentType } from "react";
import { HomeHeroA } from "./-variants/home-hero-a";
import { HomeHeroB } from "./-variants/home-hero-b";
import { RecipeSectionA } from "./-variants/recipe-section-a";
import { RecipesListA } from "./-variants/recipes-list-a";
import { RecipesListB } from "./-variants/recipes-list-b";
import { RecipesListC } from "./-variants/recipes-list-c";

/** Scope of a design variant: a full page mock or a single section. */
export type DesignVariantKind = "page" | "section";

/** How a variant is presented against the page background. */
export type DesignVariantSurface = "framed" | "plain";

/** A group of variants that answer the same design question. */
export type DesignGroup = {
	/** URL-safe id, also the `group` search param on compare. */
	id: string;
	/** Display title shown as the gallery section heading. */
	title: string;
	/** The decision this group's variants are competing to answer. */
	question: string;
};

/** A single mockup entry in the Design Lab. */
export type DesignVariantEntry = {
	/** URL-safe id, also the `$variantId` param and annotation storage key. */
	id: string;
	/** Display title shown in gallery and compare views. */
	title: string;
	/** The group this variant belongs to. Compare never crosses groups. */
	groupId: string;
	/** Whether this mocks an entire page or one section. */
	kind: DesignVariantKind;
	/** One-line note on what direction this variant explores. */
	description: string;
	/**
	 * Canvas behind the variant. `"framed"` (default) renders the shared
	 * white frame used by compare and gallery. `"plain"` renders the
	 * variant bare — for full-bleed or dark variants that paint their own
	 * background.
	 */
	surface?: DesignVariantSurface;
	/** The mockup component. Keep variants self-contained with inline sample data. */
	component: ComponentType;
};

/**
 * All design groups, in gallery order. To compare a new direction, add a
 * group here and register its variants below — gallery sections, compare
 * pickers, and the skill's scaffolding all follow this table.
 */
export const designGroups: Array<DesignGroup> = [
	{
		id: "home-hero",
		title: "Home hero",
		question: "Centered-safe vs split-rich — which hero direction?",
	},
	{
		id: "recipes-list",
		title: "Recipes list",
		question: "Which density direction: quiet rows vs ledger vs sidebar?",
	},
	{
		id: "recipe-section",
		title: "Recipe section",
		question: "Which card treatment should the recipe section use?",
	},
];

/**
 * All design variants. To add a new mockup, create a component in
 * `-variants/` and append an entry here — gallery, compare, and isolated
 * views pick it up automatically, no routing changes needed.
 */
export const designRegistry: Array<DesignVariantEntry> = [
	{
		id: "home-hero-a",
		title: "Home hero A — centered",
		groupId: "home-hero",
		kind: "page",
		description: "Centered headline, dual CTA, stat strip. Safe, classic direction.",
		component: HomeHeroA,
	},
	{
		id: "home-hero-b",
		title: "Home hero B — split with pick",
		groupId: "home-hero",
		kind: "page",
		description: "Split layout with a featured recipe card. Richer, more 9bar flavor.",
		component: HomeHeroB,
	},
	{
		id: "recipes-list-a",
		title: "Recipes list A — quiet rows",
		groupId: "recipes-list",
		kind: "page",
		description:
			"Borderless rows, quick type tabs plus FilterBar, numbered pagination. Calmest direction.",
		component: RecipesListA,
	},
	{
		id: "recipes-list-b",
		title: "Recipes list B — ledger",
		groupId: "recipes-list",
		kind: "page",
		description:
			"Dense aligned columns, mono parameters, numbered pagination. Most info per pixel.",
		component: RecipesListB,
	},
	{
		id: "recipes-list-c",
		title: "Recipes list C — sidebar filters",
		groupId: "recipes-list",
		kind: "page",
		description: "Slim filter rail with counts, compact rows, centered pages. Closest to today.",
		component: RecipesListC,
	},
	{
		id: "recipe-section-a",
		title: "Recipe list section A — cards",
		groupId: "recipe-section",
		kind: "section",
		description: "Section-scoped mock: recipe cards grid to drop into a page later.",
		component: RecipeSectionA,
	},
];

/** Find a variant by id. Returns undefined for unknown ids. */
export const getVariant = (id: string): DesignVariantEntry | undefined => {
	return designRegistry.find((entry) => entry.id === id);
};

/** Find a group by id. Returns undefined for unknown ids. */
export const getGroup = (id: string): DesignGroup | undefined => {
	return designGroups.find((group) => group.id === id);
};

/** All variants of a group, in registry order. */
export const getGroupVariants = (groupId: string): Array<DesignVariantEntry> => {
	return designRegistry.filter((entry) => entry.groupId === groupId);
};
