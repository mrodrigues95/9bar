import { createFileRoute, Outlet } from "@tanstack/react-router";

const AuthenticatedLayout = () => {
	return <Outlet />;
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
