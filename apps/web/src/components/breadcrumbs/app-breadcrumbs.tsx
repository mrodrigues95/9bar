import type {
	AnyRouteMatch,
	RegisteredRouter,
	StaticDataRouteOption,
} from "@tanstack/react-router";
import { useMatches, useRouter } from "@tanstack/react-router";
import type { ComponentProps } from "react";
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

interface TAppBreadcrumb {
	id: string;
	pathname: string;
	label: string;
	disabled?: boolean;
}

type TRoutesById = RegisteredRouter["routesById"];

const getRouteStaticData = (
	route: TRoutesById[keyof TRoutesById],
): StaticDataRouteOption | undefined => {
	return route.options?.staticData;
};

const isRouterBreadcrumb = (value: unknown): value is RouterBreadcrumb =>
	!!value &&
	typeof value === "object" &&
	"label" in value &&
	typeof value.label === "string";

const getLoaderBreadcrumb = (
	match?: AnyRouteMatch,
): RouterBreadcrumb | null => {
	const data = match?.loaderData;
	return isRouterBreadcrumb(data?.breadcrumb) ? data.breadcrumb : null;
};

/**
 * Finds the logical parent routes for matches with the `_` suffix convention and
 * injects their breadcrumbs into the trail.
 *
 * In TanStack Router, a folder suffixed with `_` (e.g., `recipes_/`) breaks out
 * of the parent layout while sharing the same URL path. This function finds
 * those suffixed segments and resolves the corresponding non-suffixed parent
 * route to inject its breadcrumb.
 *
 * For example, `/_authenticated/recipes_/$recipeId` contains the segment
 * `recipes_`, which resolves to the parent route `/_authenticated/recipes`.
 * If that parent has a breadcrumb label, it gets injected into the trail.
 */
const resolveSuffixParentBreadcrumbs = (
	match: AnyRouteMatch,
	matches: AnyRouteMatch[],
	routesById: TRoutesById,
	seen: Set<string>,
) => {
	const breadcrumbs: Array<TAppBreadcrumb> = [];
	const segments = match.id.split("/");

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		if (!segment || segment.length <= 1 || !segment.endsWith("_")) {
			continue;
		}

		// Build the parent route ID by replacing the suffixed segment with its
		// non-suffixed counterpart (e.g., `recipes_` -> `recipes`).
		const parentSegments = segments.slice(0, i + 1);
		parentSegments[i] = segment.slice(0, -1);

		const parentId = parentSegments.join("/") as keyof TRoutesById;
		if (seen.has(parentId)) {
			continue;
		}

		const route = routesById[parentId];
		if (!route) {
			continue;
		}

		const parentMatch = matches.find((m) => m.id === parentId);
		const parentStaticData = getRouteStaticData(route);
		const parentBreadcrumb =
			getLoaderBreadcrumb(parentMatch) ?? parentStaticData?.breadcrumb;

		if (parentBreadcrumb?.label) {
			seen.add(parentId);
			breadcrumbs.push({
				id: parentId,
				pathname: parentMatch?.pathname ?? route.fullPath,
				label: parentBreadcrumb.label,
				...(parentBreadcrumb.disabled && { disabled: true }),
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
			const breadcrumbs: Array<TAppBreadcrumb> = [];

			for (const match of matches) {
				if (seen.has(match.id)) {
					continue;
				}

				const parentBreadcrumbs = resolveSuffixParentBreadcrumbs(
					match,
					matches,
					routesById,
					seen,
				);
				breadcrumbs.push(...parentBreadcrumbs);

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
					...(breadcrumb.disabled === true && { disabled: true }),
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
					<Breadcrumb
						key={item.id}
						to={item.pathname}
						{...(item.disabled === true && { isDisabled: true })}
					>
						{item.label}
					</Breadcrumb>
				)}
			</Breadcrumbs>
		</nav>
	);
};

export const withBreadcrumb = <TData extends Record<string, unknown>>(
	data: TData,
	breadcrumb: RouterBreadcrumb,
) => ({ ...data, breadcrumb });
