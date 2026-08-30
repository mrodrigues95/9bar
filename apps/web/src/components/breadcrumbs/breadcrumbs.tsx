import {
	BreadcrumbItem as ToolkitBreadcrumbItem,
	BreadcrumbList as ToolkitBreadcrumbList,
	BreadcrumbPage as ToolkitBreadcrumbPage,
	type BreadcrumbsProps as ToolkitBreadcrumbsProps,
} from "@9bar/toolkit/components";
import { cn } from "@9bar/toolkit/utils";
import type { RegisteredRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Link, type LinkProps } from "../link/link";

export type BreadcrumbProps<
	TRouter extends RegisteredRouter = RegisteredRouter,
	TOptions = unknown,
> = LinkProps<TRouter, TOptions> & {
	className?: string;
	isDisabled?: boolean;
	children?: ReactNode;
};

export function Breadcrumb<TRouter extends RegisteredRouter, TOptions>(
	props: BreadcrumbProps<TRouter, TOptions>,
): ReactNode;
export function Breadcrumb({
	children,
	className,
	to,
	activeOptions,
	isDisabled,
}: BreadcrumbProps): ReactNode {
	return (
		<ToolkitBreadcrumbItem
			className={cn("disabled:[&_svg]:opacity-50", className) ?? ""}
		>
			{({ isCurrent }) =>
				isCurrent ? (
					<ToolkitBreadcrumbPage className={cn("text-muted", className) ?? ""}>
						{children}
					</ToolkitBreadcrumbPage>
				) : (
					<Link
						to={to}
						{...(isDisabled && { isDisabled: true })}
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
				)
			}
		</ToolkitBreadcrumbItem>
	);
}

export interface BreadcrumbsProps<T extends object>
	extends ToolkitBreadcrumbsProps<T> {}

export const Breadcrumbs = <T extends object>(props: BreadcrumbsProps<T>) => {
	return <ToolkitBreadcrumbList {...props} />;
};
