import {
	type AnyRouteMatch,
	createRouter as createTanStackRouter,
} from "@tanstack/react-router";
import type { FileRouteTypes } from "./routeTree.gen";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		defaultPreload: "intent",
		defaultErrorComponent: () => <div>Oh no! An error occurred!</div>,
		defaultNotFoundComponent: () => <div>404! Page not found!</div>,
		scrollRestoration: true,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}

declare module "@tanstack/react-router" {
	interface StaticDataRouteOption {
		breadcrumb?: {
			/** The label for this route's breadcrumb. */
			label?: string | ((match: AnyRouteMatch) => string | undefined);
			/** The route id of the logical parent for breadcrumb hierarchy (for pathless routes). */
			parent?: FileRouteTypes["id"];
		};
	}
}
