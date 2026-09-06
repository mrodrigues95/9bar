import { createLink, type RegisteredRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
	BreadcrumbItem as ToolkitBreadcrumbItem,
	BreadcrumbLink as ToolkitBreadcrumbLink,
	BreadcrumbList as ToolkitBreadcrumbList,
	BreadcrumbPage as ToolkitBreadcrumbPage,
	type BreadcrumbsProps as ToolkitBreadcrumbsProps,
} from "@9bar/toolkit/components";
import type { LinkProps } from "../link/link";

/** A routing-aware crumb link that keeps the toolkit's default breadcrumb styling. */
const BreadcrumbLink = createLink(ToolkitBreadcrumbLink);

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
		<ToolkitBreadcrumbItem className={className}>
			{({ isCurrent }) =>
				isCurrent ? (
					<ToolkitBreadcrumbPage className={className}>{children}</ToolkitBreadcrumbPage>
				) : (
					<BreadcrumbLink
						to={to}
						activeOptions={{ exact: true, ...activeOptions }}
						{...(isDisabled && { isDisabled: true })}
						className={className}
					>
						{children}
					</BreadcrumbLink>
				)
			}
		</ToolkitBreadcrumbItem>
	);
}

export interface BreadcrumbsProps<T extends object> extends ToolkitBreadcrumbsProps<T> {}

export const Breadcrumbs = <T extends object>(props: BreadcrumbsProps<T>) => {
	return <ToolkitBreadcrumbList {...props} />;
};
