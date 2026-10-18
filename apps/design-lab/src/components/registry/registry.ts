import type { ComponentType } from "react";
import { HomeHeroA } from "./variants/home-hero-a";
import { HomeHeroB } from "./variants/home-hero-b";

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
];
