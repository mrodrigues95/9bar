import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { EmptyState } from "./components/empty-state";
import { Link } from "./components/link";
import { routeTree } from "./routeTree.gen";

export const createRouter = () => {
	const router = createTanStackRouter({
		routeTree,
		defaultPreload: "intent",
		defaultNotFoundComponent: () => {
			return (
				<EmptyState
					as="h1"
					title="404! Page not found!"
					body="That route does not exist in the lab."
					action={<Link to="/">Back to the gallery</Link>}
				/>
			);
		},
		scrollRestoration: true,
	});

	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
