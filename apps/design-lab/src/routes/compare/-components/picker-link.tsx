import type { InferFullSearchSchema, RegisteredRouter, RouteById } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Link } from "../../../components/link";

type PickerLinkProps = {
	active: boolean;
	search: InferFullSearchSchema<RouteById<RegisteredRouter["routeTree"], "/compare">>;
	children: ReactNode;
};

export const PickerLink = ({ active, search, children }: PickerLinkProps) => {
	return (
		<Link
			to="/compare"
			search={search}
			resetScroll={false}
			variant={active ? "outline" : "ghost"}
			size="sm"
			aria-current={active ? "true" : undefined}
		>
			{children}
		</Link>
	);
};
