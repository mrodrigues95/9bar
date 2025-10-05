import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { type ReactNode, Suspense } from "react";
import css from "../styles/globals.css?url";

const RootComponent = () => {
	return (
		<RootDocument>
			<div className="flex min-h-screen flex-col">
				<Suspense>
					<Outlet />
				</Suspense>
			</div>
		</RootDocument>
	);
};

const RootDocument = ({ children }: Readonly<{ children: ReactNode }>) => {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="font-geist antialiased">
				{children}
				<Scripts />
			</body>
		</html>
	);
};

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
