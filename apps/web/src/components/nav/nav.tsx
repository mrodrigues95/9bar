import type { FileRouteTypes } from "../../routeTree.gen";
import { Link } from "../link/link";
import { Logo } from "../logo/logo";
import { ProfileMenu } from "./profile-menu";

const links: Array<{ to: FileRouteTypes["to"]; label: string }> = [
	{ to: "/home", label: "Home" },
	{ to: "/recipe", label: "Recipe" },
	{ to: "/profile", label: "Profile" },
];

export const Nav = () => {
	return (
		<header className="border-slate-200 border-b bg-white">
			<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					<div className="flex flex-1 items-center gap-10">
						<Logo />
						<nav>
							<ul className="flex items-center gap-2.5">
								{links.map(({ to, label }) => (
									<li key={to}>
										<Link
											to={to}
											variant="ghost"
											activeProps={{
												variant: "default",
												"aria-current": "page",
											}}
										>
											{label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>
					<ProfileMenu />
				</div>
			</div>
		</header>
	);
};
