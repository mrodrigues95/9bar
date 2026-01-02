import {
	Breadcrumb as ToolkitBreadcrumb,
	type BreadcrumbProps as ToolkitBreadcrumbProps,
	Breadcrumbs as ToolkitBreadcrumbs,
	type BreadcrumbsProps as ToolkitBreadcrumbsProps,
} from "@9bar/toolkit";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import type { RegisteredRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "tailwind-variants";
import { Link, type LinkProps } from "../link/link";

export type BreadcrumbProps<
	TRouter extends RegisteredRouter = RegisteredRouter,
	TOptions = unknown,
> = LinkProps<TRouter, TOptions> & {
	breadcrumbProps?: Omit<ToolkitBreadcrumbProps, "children">;
};

export function Breadcrumb<TRouter extends RegisteredRouter, TOptions>(
	props: BreadcrumbProps<TRouter, TOptions>,
): ReactNode;
export function Breadcrumb({
	breadcrumbProps,
	children,
	className,
	to,
	activeOptions,
}: BreadcrumbProps): ReactNode {
	return (
		<ToolkitBreadcrumb
			{...breadcrumbProps}
			className={
				cn("disabled:[&_svg]:opacity-50", breadcrumbProps?.className) ?? ""
			}
		>
			{({ isCurrent }) => (
				<>
					<Link
						to={to}
						activeOptions={{ exact: true, ...activeOptions }}
						className={
							cn(
								"p-0 text-muted",
								"hover:text-slate-900",
								"focus-visible:text-slate-900",
								"current:text-slate-900 current:disabled:opacity-100",
								className,
							) ?? ""
						}
					>
						{children}
					</Link>
					{!isCurrent && <ChevronRightIcon className="size-3 text-muted" />}
				</>
			)}
		</ToolkitBreadcrumb>
	);
}

interface BreadcrumbsProps<T extends object>
	extends ToolkitBreadcrumbsProps<T> {}

export const Breadcrumbs = <T extends object>(props: BreadcrumbsProps<T>) => {
	return <ToolkitBreadcrumbs {...props} />;
};
