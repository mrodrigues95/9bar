import type { RouterBreadcrumb } from "./app-breadcrumbs";

export const withBreadcrumb = <TData extends Record<string, unknown>>(
	data: TData,
	breadcrumb: RouterBreadcrumb,
) => ({ ...data, breadcrumb });
