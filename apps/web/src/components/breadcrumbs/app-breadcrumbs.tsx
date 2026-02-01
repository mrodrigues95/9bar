import type { AnyRouteMatch, RegisteredRouter } from "@tanstack/react-router";
import { useMatches, useRouter } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { Breadcrumb, Breadcrumbs } from "../breadcrumbs/breadcrumbs";

interface TAppBreadcrumb {
	id: string;
	pathname: string;
	label: string;
}

type TRoutesById = RegisteredRouter["routesById"];

const getParentBreadcrumbs = (
	routeId: keyof TRoutesById,
	routesById: TRoutesById,
): Array<TAppBreadcrumb> => {
	const route = routesById[routeId];
	if (!route) {
		return [];
	}

	const { breadcrumb } = route.options?.staticData ?? {};
	const parentId = breadcrumb?.parent;

	const parentBreadcrumbs = parentId
		? getParentBreadcrumbs(parentId, routesById)
		: [];

	if (!breadcrumb?.label) {
		return parentBreadcrumbs;
	}

	// For parent routes, we can only use string labels (no match context).
	const label =
		typeof breadcrumb.label === "string" ? breadcrumb.label : undefined;
	if (!label) {
		return parentBreadcrumbs;
	}

	return [
		...parentBreadcrumbs,
		{
			id: routeId,
			pathname: route.fullPath,
			label,
		},
	];
};

const buildBreadcrumbs = (
	matches: AnyRouteMatch[],
	routesById: TRoutesById,
) => {
	const breadcrumbs: Array<TAppBreadcrumb> = [];

	for (const match of matches) {
		const breadcrumb = match.staticData?.breadcrumb;
		const parentId = breadcrumb?.parent;

		// Resolve parent breadcrumbs first (if not already added)
		if (parentId) {
			const parentBreadcrumbs = getParentBreadcrumbs(parentId, routesById);
			for (const parent of parentBreadcrumbs) {
				if (!breadcrumbs.some((b) => b.id === parent.id)) {
					breadcrumbs.push(parent);
				}
			}
		}

		const label =
			typeof breadcrumb?.label === "function"
				? breadcrumb.label(match)
				: breadcrumb?.label;
		if (!label) {
			continue;
		}

		if (!breadcrumbs.some((b) => b.id === match.id)) {
			breadcrumbs.push({
				id: match.id,
				pathname: match.pathname,
				label,
			});
		}
	}

	return breadcrumbs;
};

const useAppBreadcrumbs = () => {
	const matches = useMatches();
	const router = useRouter();
	return buildBreadcrumbs(matches, router.routesById);
};

interface AppBreadcrumbsProps extends ComponentProps<"nav"> {}

export const AppBreadcrumbs = (props: AppBreadcrumbsProps) => {
	const breadcrumbs = useAppBreadcrumbs();
	if (breadcrumbs.length < 2) {
		return null;
	}

	return (
		<nav {...props}>
			<Breadcrumbs items={breadcrumbs}>
				{(item) => (
					<Breadcrumb key={item.id} to={item.pathname}>
						{item.label}
					</Breadcrumb>
				)}
			</Breadcrumbs>
		</nav>
	);
};
