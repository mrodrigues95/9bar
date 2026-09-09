import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		defaultPreload: "intent",
		defaultNotFoundComponent: () => {
			return <div>404! Page not found!</div>;
		},
		scrollRestoration: true,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
