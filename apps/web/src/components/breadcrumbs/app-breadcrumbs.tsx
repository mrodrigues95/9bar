import type {
	AnyRouteMatch,
	FileRouteTypes,
	RegisteredRouter,
	StaticDataRouteOption,
} from "@tanstack/react-router";
import { useMatches, useRouter } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { Breadcrumb, Breadcrumbs } from "../breadcrumbs/breadcrumbs";

interface RouterBreadcrumb {
	/**
	 * The static label for this route's breadcrumb.
	 *
	 * This can be overriden by returning a `breadcrumb` string from the route's loader, which is useful for dynamic breadcrumb labels.
	 */
	label?: string;
	/** The route id of the logical parent for breadcrumb hierarchy (for pathless routes). */
	parentRouteId?: FileRouteTypes["id"];
}

declare module "@tanstack/react-router" {
	interface StaticDataRouteOption {
		breadcrumb?: RouterBreadcrumb;
	}
}

interface TAppBreadcrumb {
	id: string;
	pathname: string;
	label: string;
}

type TRoutesById = RegisteredRouter["routesById"];

const getRouteStaticData = (
	route: TRoutesById[keyof TRoutesById],
): StaticDataRouteOption | undefined => {
	return route.options?.staticData;
};

const getLoaderBreadcrumb = (
	match?: AnyRouteMatch,
): RouterBreadcrumb | null => {
	const data = match?.loaderData;
	return typeof data?.breadcrumb?.label === "string" ? data.breadcrumb : null;
};

const resolvePathlessParentBreadcrumbs = (
	match: AnyRouteMatch,
	matches: AnyRouteMatch[],
	routesById: TRoutesById,
	seen: Set<string>,
) => {
	const breadcrumbs: Array<TAppBreadcrumb> = [];
	const parentId = match.staticData?.breadcrumb?.parentRouteId;
	if (!parentId) {
		return breadcrumbs;
	}

	const ancestors: Array<TAppBreadcrumb> = [];
	const visited = new Set<string>();
	let currentId: keyof TRoutesById | undefined = parentId;

	while (currentId && !visited.has(currentId)) {
		visited.add(currentId);
		const route = routesById[currentId];
		if (!route) {
			break;
		}

		const parentStaticData = getRouteStaticData(route);
		const parentMatch = matches.find((m) => m.id === currentId);
		const parentBreadcrumb =
			getLoaderBreadcrumb(parentMatch) ?? parentStaticData?.breadcrumb;

		if (parentBreadcrumb?.label) {
			ancestors.push({
				id: currentId,
				pathname: parentMatch?.pathname ?? route.fullPath,
				label: parentBreadcrumb.label,
			});
		}

		currentId = parentStaticData?.breadcrumb?.parentRouteId;
	}

	for (const ancestor of ancestors.reverse()) {
		if (!seen.has(ancestor.id)) {
			seen.add(ancestor.id);
			breadcrumbs.push(ancestor);
		}
	}

	return breadcrumbs;
};

const useAppBreadcrumbs = () => {
	const { routesById } = useRouter();
	return useMatches({
		select: (matches) => {
			const seen = new Set<string>();
			const breadcrumbs: Array<TAppBreadcrumb> = [];

			for (const match of matches) {
				if (seen.has(match.id)) {
					continue;
				}

				const ancestorBreadcrumbs = resolvePathlessParentBreadcrumbs(
					match,
					matches,
					routesById,
					seen,
				);
				if (ancestorBreadcrumbs.length) {
					breadcrumbs.push(...ancestorBreadcrumbs);
				}

				const breadcrumb =
					getLoaderBreadcrumb(match) ?? match.staticData?.breadcrumb;
				if (!breadcrumb?.label) {
					continue;
				}

				seen.add(match.id);
				breadcrumbs.push({
					id: match.id,
					pathname: match.pathname,
					label: breadcrumb.label,
				});
			}

			return breadcrumbs;
		},
	});
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
