import type { AnyRouteMatch, RegisteredRouter } from "@tanstack/react-router";
import { useMatches, useRouter } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { z } from "zod";
import { Breadcrumb as ToolkitBreadcrumb } from "@9bar/toolkit/components";
import { Breadcrumb, Breadcrumbs } from "../breadcrumbs/breadcrumbs";

export interface RouterBreadcrumb {
	label?: string;
	disabled?: boolean;
}

declare module "@tanstack/react-router" {
	interface StaticDataRouteOption {
		breadcrumb?: RouterBreadcrumb;
	}
}

interface AppBreadcrumb {
	id: string;
	pathname: string;
	label: string;
	disabled?: boolean;
}

type RoutesById = RegisteredRouter["routesById"];

const getRouteStaticData = (route: RoutesById[keyof RoutesById]) => route.options.staticData;

const isRouteId = (id: string, routesById: RoutesById): id is keyof RoutesById =>
	Object.hasOwn(routesById, id);

const routerBreadcrumbSchema = z.object({
	label: z.string(),
	disabled: z.boolean().optional(),
});

const isRouterBreadcrumb = (value: unknown): value is RouterBreadcrumb =>
	routerBreadcrumbSchema.safeParse(value).success;

const getLoaderBreadcrumb = (match?: AnyRouteMatch) => {
	const data = match?.loaderData;
	return isRouterBreadcrumb(data?.breadcrumb) ? data.breadcrumb : null;
};

const resolveSuffixParentBreadcrumbs = (
	match: AnyRouteMatch,
	matchesById: Map<string, AnyRouteMatch>,
	routesById: RoutesById,
	seen: Set<string>,
) => {
	const breadcrumbs: Array<AppBreadcrumb> = [];
	const segments = match.id.split("/");

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		if (segment === undefined || segment.length <= 1 || !segment.endsWith("_")) {
			continue;
		}

		const parentSegments = segments.slice(0, i + 1);
		parentSegments[i] = segment.slice(0, -1);

		const parentId = parentSegments.join("/");
		if (seen.has(parentId) || !isRouteId(parentId, routesById)) {
			continue;
		}

		const route = routesById[parentId];

		const parentMatch = matchesById.get(parentId);
		const parentStaticData = getRouteStaticData(route);
		const parentBreadcrumb = getLoaderBreadcrumb(parentMatch) ?? parentStaticData?.breadcrumb;

		if (parentBreadcrumb?.label !== undefined && parentBreadcrumb.label !== "") {
			seen.add(parentId);
			breadcrumbs.push({
				id: parentId,
				pathname: parentMatch?.pathname ?? route.fullPath,
				label: parentBreadcrumb.label,
				...(parentBreadcrumb.disabled === true && { disabled: true }),
			});
		}
	}

	return breadcrumbs;
};

const useAppBreadcrumbs = () => {
	const { routesById } = useRouter();
	return useMatches({
		select: (matches) => {
			const seen = new Set<string>();
			const matchesById = new Map(matches.map((match) => [match.id, match]));
			const breadcrumbs: Array<AppBreadcrumb> = [];

			for (const match of matches) {
				if (seen.has(match.id)) {
					continue;
				}

				const parentBreadcrumbs = resolveSuffixParentBreadcrumbs(
					match,
					matchesById,
					routesById,
					seen,
				);
				breadcrumbs.push(...parentBreadcrumbs);

				const breadcrumb = getLoaderBreadcrumb(match) ?? match.staticData.breadcrumb;
				if (breadcrumb?.label === undefined || breadcrumb.label === "") {
					continue;
				}

				seen.add(match.id);
				breadcrumbs.push({
					id: match.id,
					pathname: match.pathname,
					label: breadcrumb.label,
					...(breadcrumb.disabled === true && { disabled: true }),
				});
			}

			return breadcrumbs;
		},
	});
};

export interface AppBreadcrumbsProps extends ComponentProps<typeof ToolkitBreadcrumb> {}

export const AppBreadcrumbs = (props: AppBreadcrumbsProps) => {
	const breadcrumbs = useAppBreadcrumbs();
	if (breadcrumbs.length < 2) {
		return null;
	}

	return (
		<ToolkitBreadcrumb {...props}>
			<Breadcrumbs items={breadcrumbs}>
				{(item) => (
					<Breadcrumb
						key={item.id}
						to={item.pathname}
						{...(item.disabled === true && { isDisabled: true })}
					>
						{item.label}
					</Breadcrumb>
				)}
			</Breadcrumbs>
		</ToolkitBreadcrumb>
	);
};
