import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { FlaskConical } from "lucide-react";
import { Badge, Text } from "@9bar/toolkit/components";
import { Link } from "../components/link";

const RootLayout = () => {
	return (
		<div className="min-h-screen bg-neutral-100">
			<HeadContent />
			<header className="border-b border-border bg-card">
				<div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
					<div className="flex items-center gap-2">
						<FlaskConical className="size-4" aria-hidden="true" />
						<Text variant="body-sm" className="font-semibold">
							Design Lab
						</Text>
						<Badge variant="outline">dev only</Badge>
					</div>
					<nav aria-label="Design lab" className="flex items-center gap-4">
						<Link to="/">Gallery</Link>
						<Link to="/compare">Compare</Link>
					</nav>
				</div>
			</header>
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<Outlet />
			</main>
			<TanStackRouterDevtools position="bottom-right" />
		</div>
	);
};

export const Route = createRootRoute({
	head: () => ({
		meta: [{ title: "9bar Design Lab" }],
	}),
	component: RootLayout,
});
