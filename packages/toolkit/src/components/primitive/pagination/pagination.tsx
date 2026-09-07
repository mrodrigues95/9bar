import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
	MoreHorizontalIcon,
} from "lucide-react";
import type * as React from "react";
import { LinkButton } from "#components/button";
import { cn } from "#lib/utils";

/** Props for the {@link Pagination} component. */
export type PaginationProps = React.ComponentProps<"nav">;

/** The root navigation landmark for a set of pagination controls. */
export const Pagination = ({ className, ...props }: PaginationProps) => {
	return (
		<nav
			aria-label="pagination"
			data-slot="pagination"
			className={cn("mx-auto flex w-full justify-center", className)}
			{...props}
		/>
	);
};

/** Props for the {@link PaginationContent} component. */
export type PaginationContentProps = React.ComponentProps<"ul">;

/** A horizontal list that lays out {@link PaginationItem} elements. */
export const PaginationContent = ({ className, ...props }: PaginationContentProps) => {
	return (
		<ul
			data-slot="pagination-content"
			className={cn("flex items-center gap-0.5", className)}
			{...props}
		/>
	);
};

/** Props for the {@link PaginationItem} component. */
export type PaginationItemProps = React.ComponentProps<"li">;

/** A list item wrapper for a single pagination control (button or ellipsis). */
export const PaginationItem = ({ ...props }: PaginationItemProps) => {
	return <li data-slot="pagination-item" {...props} />;
};

/** Props for the {@link PaginationLink} component. */
export type PaginationLinkProps = {
	isActive?: boolean;
} & Omit<React.ComponentProps<typeof LinkButton>, "variant">;

/** A page-number link within a {@link PaginationContent}, styled to indicate the active page. */
export const PaginationLink = ({
	className,
	isActive,
	size = "icon",
	...props
}: PaginationLinkProps) => {
	return (
		<LinkButton
			variant={isActive ? "outline" : "ghost"}
			size={size}
			className={cn(className)}
			aria-current={isActive ? "page" : undefined}
			data-slot="pagination-link"
			data-active={isActive}
			{...props}
		/>
	);
};

/** Props for the {@link PaginationPrevious} component. */
export type PaginationPreviousProps = React.ComponentProps<typeof PaginationLink> & {
	text?: string;
};

/** A link that navigates to the previous page. */
export const PaginationPrevious = ({
	className,
	text = "Previous",
	...props
}: PaginationPreviousProps) => {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			size="default"
			className={cn("pl-2!", className)}
			{...props}
		>
			<ChevronLeftIcon data-icon="inline-start" />
			<span className="hidden sm:block">{text}</span>
		</PaginationLink>
	);
};

/** Props for the {@link PaginationNext} component. */
export type PaginationNextProps = React.ComponentProps<typeof PaginationLink> & {
	text?: string;
};

/** A link that navigates to the next page. */
export const PaginationNext = ({ className, text = "Next", ...props }: PaginationNextProps) => {
	return (
		<PaginationLink
			aria-label="Go to next page"
			size="default"
			className={cn("pr-2!", className)}
			{...props}
		>
			<span className="hidden sm:block">{text}</span>
			<ChevronRightIcon data-icon="inline-end" />
		</PaginationLink>
	);
};

/** Props for the {@link PaginationEllipsis} component. */
export type PaginationEllipsisProps = React.ComponentProps<"span">;

/** A non-interactive indicator representing omitted page numbers between visible ranges. */
export const PaginationEllipsis = ({ className, ...props }: PaginationEllipsisProps) => {
	return (
		<span
			aria-hidden
			data-slot="pagination-ellipsis"
			className={cn(
				"flex size-7 items-center justify-center [&_svg:not([class*='size-'])]:size-3.5",
				className,
			)}
			{...props}
		>
			<MoreHorizontalIcon />
			<span className="sr-only">More pages</span>
		</span>
	);
};

/** Props for the {@link PaginationButton} component. */
export type PaginationButtonProps = Omit<PaginationLinkProps, "size"> & {
	/** Whether this button represents the currently active page. */
	isActive?: boolean;
};

/** A button representing a single page number within the pagination bar. */
export const PaginationButton = ({
	isActive = false,
	className,
	children,
	...props
}: PaginationButtonProps) => {
	return (
		<PaginationLink isActive={isActive} className={cn("size-7 p-0", className)} {...props}>
			{children}
		</PaginationLink>
	);
};

/** Props for the {@link PaginationFirst} component. */
export type PaginationFirstProps = Omit<PaginationLinkProps, "size" | "children">;

/** A link that navigates to the first page. */
export const PaginationFirst = ({ className, ...props }: PaginationFirstProps) => {
	return (
		<PaginationLink
			aria-label="Go to first page"
			className={cn("size-7 p-0", className)}
			{...props}
		>
			<ChevronsLeftIcon />
		</PaginationLink>
	);
};

/** Props for the {@link PaginationLast} component. */
export type PaginationLastProps = Omit<PaginationLinkProps, "size" | "children">;

/** A link that navigates to the last page. */
export const PaginationLast = ({ className, ...props }: PaginationLastProps) => {
	return (
		<PaginationLink aria-label="Go to last page" className={cn("size-7 p-0", className)} {...props}>
			<ChevronsRightIcon />
		</PaginationLink>
	);
};

interface GeneratePaginationOptions {
	/** The current page number (1-indexed). */
	currentPage: number;
	/** The total number of pages. */
	totalPages: number;
	/** The number of page buttons to show on each side of current page button. */
	siblingCount?: number;
	/** The number of page buttons to show at the start and end. */
	boundaryCount?: number;
}

/**
 * Generates an array of page numbers with ellipsis markers for pagination.
 *
 * @example
 * ```tsx
 * const pages = generatePagination({
 *   currentPage: 5,
 *   totalPages: 20,
 *   siblingCount: 1,
 *   boundaryCount: 1
 * });
 * // Returns: [1, "ellipsis", 4, 5, 6, "ellipsis", 20]
 * ```
 */
export const generatePagination = ({
	currentPage,
	totalPages,
	siblingCount = 1,
	boundaryCount = 1,
}: GeneratePaginationOptions) => {
	const range = (start: number, end: number) => {
		const length = end - start + 1;
		return Array.from({ length }, (_, i) => start + i);
	};

	const startPages = range(1, Math.min(boundaryCount, totalPages));
	const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

	const siblingsStart = Math.max(
		Math.min(currentPage - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
		boundaryCount + 2,
	);

	const siblingsEnd = Math.min(
		Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
		totalPages - boundaryCount - 1,
	);

	return [
		...startPages,

		...(siblingsStart > boundaryCount + 2
			? (["ellipsis"] as const)
			: boundaryCount + 1 < totalPages - boundaryCount
				? [boundaryCount + 1]
				: []),

		// Sibling pages around current page.
		...range(siblingsStart, siblingsEnd),

		...(siblingsEnd < totalPages - boundaryCount - 1
			? (["ellipsis"] as const)
			: totalPages - boundaryCount > boundaryCount
				? [totalPages - boundaryCount]
				: []),

		...endPages,
	];
};
