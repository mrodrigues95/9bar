import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Nav } from "src/components/nav/nav";

const AuthenticatedLayout = () => {
	return (
		<div className="min-h-screen bg-slate-50">
			<Nav />
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<Outlet />
			</main>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		// TODO: Add authentication check here
		// If user is not authenticated, redirect to login page
		// const isAuthenticated = await checkAuth();
		// if (!isAuthenticated) {
		//   throw redirect({ to: "/login" });
		// }
	},
	component: AuthenticatedLayout,
});
