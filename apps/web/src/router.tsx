import { createRouter as createTanStackRouter, createRouteMask } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const routeMasks = [
	createRouteMask({
		routeTree,
		from: "/recipes/logs/new",
		to: "/recipes",
		search: true,
		unmaskOnReload: true,
	}),
	createRouteMask({
		routeTree,
		from: "/recipes/logs/$logId/edit",
		to: "/recipes",
		search: true,
		unmaskOnReload: true,
	}),
	createRouteMask({
		routeTree,
		from: "/recipes/logs/$logId/repeat",
		to: "/recipes",
		search: true,
		unmaskOnReload: true,
	}),
	createRouteMask({
		routeTree,
		from: "/recipes/$recipeId/logs/new",
		to: "/recipes/$recipeId/logs",
		params: (prev) => ({ recipeId: prev.recipeId }),
		unmaskOnReload: true,
	}),
	createRouteMask({
		routeTree,
		from: "/recipes/$recipeId/logs/$logId/edit",
		to: "/recipes/$recipeId/logs",
		params: (prev) => ({ recipeId: prev.recipeId }),
		unmaskOnReload: true,
	}),
];

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		routeMasks,
		defaultPreload: "intent",
		defaultErrorComponent: () => <div>Oh no! An error occurred!</div>,
		defaultNotFoundComponent: () => <div>404! Page not found!</div>,
		scrollRestoration: true,
	});

	return router;
}

export function getRouter() {
	return createRouter();
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
