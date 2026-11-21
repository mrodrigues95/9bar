import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Nav } from "./-nav/nav";

const AuthenticatedLayout = () => {
	return (
		<div className="min-h-screen bg-neutral-50/25">
			<Nav />
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<Outlet />
			</main>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});
