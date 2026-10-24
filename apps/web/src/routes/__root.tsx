import { createRootRoute, HeadContent, Outlet, Scripts, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { StrictMode, type ReactNode, Suspense } from "react";
import { RouterProvider } from "react-aria-components";
import css from "../styles/globals.css?url";

const RootComponent = () => {
	const router = useRouter();

	return (
		<StrictMode>
			<RouterProvider
				navigate={(href) => {
					void router.navigate({ href });
				}}
			>
				<RootDocument>
					<div className="flex min-h-screen flex-col">
						<Suspense>
							<Outlet />
						</Suspense>
						<TanStackRouterDevtools position="bottom-right" />
					</div>
				</RootDocument>
			</RouterProvider>
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
