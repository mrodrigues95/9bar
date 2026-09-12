import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { Heading } from "@9bar/toolkit/components";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
	const router = createTanStackRouter({
		routeTree,
		defaultPreload: "intent",
		defaultNotFoundComponent: () => {
			return (
				<Heading as="h1" variant="title">
					404! Page not found!
				</Heading>
			);
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
