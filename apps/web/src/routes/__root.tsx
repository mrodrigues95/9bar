import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { StrictMode, type ReactNode, Suspense } from "react";
import css from "../styles/globals.css?url";

const RootComponent = () => {
	return (
		<StrictMode>
			<RootDocument>
				<div className="flex min-h-screen flex-col">
					<Suspense>
						<Outlet />
					</Suspense>
					<TanStackRouterDevtools position="bottom-right" />
				</div>
			</RootDocument>
		</StrictMode>
	);
};

const RootDocument = ({ children }: Readonly<{ children: ReactNode }>) => {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="antialiased">
				{children}
				<Scripts />
			</body>
		</html>
	);
};

// TODO: Look into code splitting routes.
export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [{ rel: "stylesheet", href: css }],
	}),
	component: RootComponent,
});
