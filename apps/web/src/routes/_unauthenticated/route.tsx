import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "./-footer";

const UnauthenticatedLayout = () => {
	return (
		<main className="flex flex-1 flex-col p-4 lg:p-8">
			<section className="flex flex-1 flex-col items-center justify-center">
				<div className="w-full max-w-sm">
					<Outlet />
				</div>
			</section>
			<Footer />
		</main>
	);
};

export const Route = createFileRoute("/_unauthenticated")({
	component: UnauthenticatedLayout,
});
