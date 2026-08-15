"use client";

import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import type * as React from "react";
import {
	Breadcrumb as BreadcrumbPrimitive,
	type BreadcrumbProps,
	Breadcrumbs as BreadcrumbsPrimitive,
	type BreadcrumbsProps,
	composeRenderProps,
	Link as LinkPrimitive,
	type LinkProps,
} from "react-aria-components";
import { cn } from "#lib/utils";

/** Props for the {@link Breadcrumb} component. */
export type BreadcrumbRootProps = React.ComponentProps<"nav">;

/** A navigation landmark that shows the user's location in the app hierarchy. */
export const Breadcrumb = ({ className, ...props }: BreadcrumbRootProps) => {
	return (
		<nav
			aria-label="breadcrumb"
			data-slot="breadcrumb"
			className={cn(className)}
			{...props}
		/>
	);
};

/** Props for the {@link BreadcrumbList} component. */
export type { BreadcrumbsProps };

/** A flex list of {@link BreadcrumbItem} elements, automatically separated. */
export const BreadcrumbList = <T extends object>({
	className,
	...props
}: BreadcrumbsProps<T>) => {
	return (
		<BreadcrumbsPrimitive
			data-slot="breadcrumb-list"
			className={cn(
				"wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-xs/relaxed",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link BreadcrumbItem} component. */
export type BreadcrumbItemProps = Omit<BreadcrumbProps, "children"> & {
	separatorClassName?: string;
	children?:
		| React.ReactNode
		| ((state: { isCurrent: boolean }) => React.ReactNode);
};

/** A single crumb in a {@link BreadcrumbList}, rendering a separator after non-current items. */
export const BreadcrumbItem = ({
	className,
	children,
	separatorClassName,
	...props
}: BreadcrumbItemProps) => {
	return (
		<BreadcrumbPrimitive
			data-slot="breadcrumb-item"
			className={cn("inline-flex items-center gap-1", className)}
			{...props}
		>
			{composeRenderProps(children, (children, { isCurrent }) => (
				<>
					{children}
					{!isCurrent && (
						<span
							data-slot="breadcrumb-separator"
							role="presentation"
							aria-hidden="true"
							className={cn("[&>svg]:size-3.5", separatorClassName)}
						>
							<ChevronRightIcon />
						</span>
					)}
				</>
			))}
		</BreadcrumbPrimitive>
	);
};

/** Props for the {@link BreadcrumbLink} component. */
export type BreadcrumbLinkProps = LinkProps;

/** A navigable crumb rendered as a link, styled as the current page when active. */
export const BreadcrumbLink = ({
	className,
	render,
	...props
}: BreadcrumbLinkProps) => {
	return (
		<LinkPrimitive
			data-slot="breadcrumb-link"
			className={cn(
				"inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
				"[&>svg:not([class*='size-'])]:size-3.5",
				className,
			)}
			render={render}
			{...props}
		/>
	);
};

/** Props for the {@link BreadcrumbPage} component. */
export type BreadcrumbPageProps = React.ComponentProps<"span">;

/** The current page crumb, rendered as non-interactive text. */
export const BreadcrumbPage = ({
	className,
	...props
}: BreadcrumbPageProps) => {
	return (
		<span
			data-slot="breadcrumb-page"
			aria-current="page"
			className={cn("font-normal text-foreground", className)}
			{...props}
		/>
	);
};

/** Props for the {@link BreadcrumbEllipsis} component. */
export type BreadcrumbEllipsisProps = React.ComponentProps<"span">;

/** A collapsed crumb indicator, used to hide intermediate breadcrumb levels. */
export const BreadcrumbEllipsis = ({
	className,
	...props
}: BreadcrumbEllipsisProps) => {
	return (
		<span
			data-slot="breadcrumb-ellipsis"
			role="presentation"
			aria-hidden="true"
			className={cn(
				"flex size-4 items-center justify-center [&>svg]:size-3.5",
				className,
			)}
			{...props}
		>
			<MoreHorizontalIcon />
			<span className="sr-only">More</span>
		</span>
	);
};
