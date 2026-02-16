import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId/")({
	beforeLoad: ({ params }) => {
		throw redirect({
			to: "/recipes/$recipeId/overview",
			params: { recipeId: params.recipeId },
		});
	},
});
