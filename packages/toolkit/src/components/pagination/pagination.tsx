import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "@heroicons/react/24/solid";
import type { ComponentProps } from "react";
import { composeRenderProps } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Button, type ButtonProps } from "../button/button";

const paginationVariants = tv({
	slots: {
		nav: "",
		content: "flex flex-row items-center gap-1",
		item: "",
		button: [
			"size-7 px-2 py-0 text-slate-700 transition-none",
			"disabled:opacity-50",
		],
		ellipsis:
			"flex size-7 items-center justify-center text-slate-700 data-[disabled]:opacity-50",
	},
	variants: {},
});

export interface PaginationProps
	extends ComponentProps<"nav">,
		VariantProps<typeof paginationVariants> {}

export const Pagination = ({
	"aria-label": ariaLabel = "Pagination",
	children,
	className,
	...props
}: PaginationProps) => {
	const styles = paginationVariants();
	return (
		<nav
			aria-label={ariaLabel}
			data-slot="pagination"
			className={styles.nav({ className })}
			{...props}
		>
			{children}
		</nav>
	);
};

export interface PaginationContentProps
	extends ComponentProps<"ul">,
		VariantProps<typeof paginationVariants> {}

export const PaginationContent = ({
	children,
	className,
	...props
}: PaginationContentProps) => {
	const styles = paginationVariants();
	return (
		<ul
			data-slot="pagination-content"
			className={styles.content({ className })}
			{...props}
		>
			{children}
		</ul>
	);
};

export interface PaginationItemProps
	extends ComponentProps<"li">,
		VariantProps<typeof paginationVariants> {}

export const PaginationItem = ({
	children,
	className,
	...props
}: PaginationItemProps) => {
	const styles = paginationVariants();
	return (
		<li
			data-slot="pagination-item"
			className={styles.item({ className })}
			{...props}
		>
			{children}
		</li>
	);
};

export interface PaginationButtonProps
	extends Omit<ButtonProps, "size">,
		VariantProps<typeof paginationVariants> {
	isActive?: boolean;
}

// TODO: add `data-slot` to non-slot like components, test this one overrides correctly.
export const PaginationButton = ({
	isActive = false,
	children,
	className,
	...props
}: PaginationButtonProps) => {
	const styles = paginationVariants();

	return (
		<Button
			data-slot="pagination-button"
			{...(isActive
				? { "aria-current": "page" as const, variant: "outline" }
				: { variant: "ghost" })}
			{...props}
			className={composeRenderProps(className, (className, renderProps) =>
				styles.button({ ...renderProps, className }),
			)}
		>
			{children}
		</Button>
	);
};

export interface PaginationPreviousProps
	extends Omit<PaginationButtonProps, "children"> {
	"aria-label"?: string;
	showLabel?: boolean;
}

export const PaginationPrevious = ({
	"aria-label": ariaLabel = "Go to previous page",
	className,
	...props
}: PaginationPreviousProps) => {
	return (
		<PaginationButton
			aria-label={ariaLabel}
			{...(className ? { className } : {})}
			{...props}
		>
			<ChevronLeftIcon />
		</PaginationButton>
	);
};

export interface PaginationNextProps
	extends Omit<PaginationButtonProps, "children"> {
	showLabel?: boolean;
}

export const PaginationNext = ({
	"aria-label": ariaLabel = "Go to next page",
	className,
	...props
}: PaginationNextProps) => {
	return (
		<PaginationButton
			aria-label={ariaLabel}
			{...(className ? { className } : {})}
			{...props}
		>
			<ChevronRightIcon />
		</PaginationButton>
	);
};

export interface PaginationFirstProps
	extends Omit<PaginationButtonProps, "children"> {}

export const PaginationFirst = ({
	"aria-label": ariaLabel = "Go to first page",
	className,
	...props
}: PaginationFirstProps) => {
	return (
		<PaginationButton
			aria-label={ariaLabel}
			{...(className ? { className } : {})}
			{...props}
		>
			<ChevronDoubleLeftIcon />
		</PaginationButton>
	);
};

export interface PaginationLastProps
	extends Omit<PaginationButtonProps, "children"> {}

export const PaginationLast = ({
	"aria-label": ariaLabel = "Go to last page",
	className,
	...props
}: PaginationLastProps) => {
	return (
		<PaginationButton
			aria-label={ariaLabel}
			{...(className ? { className } : {})}
			{...props}
		>
			<ChevronDoubleRightIcon />
		</PaginationButton>
	);
};

export interface PaginationEllipsisProps
	extends ComponentProps<"span">,
		VariantProps<typeof paginationVariants> {
	isDisabled?: boolean;
}

export const PaginationEllipsis = ({
	children = "...",
	className,
	isDisabled = false,
	...props
}: PaginationEllipsisProps) => {
	const styles = paginationVariants();
	return (
		<span
			data-slot="pagination-ellipsis"
			className={styles.ellipsis({ className })}
			aria-hidden="true"
			data-disabled={isDisabled || undefined}
			{...props}
		>
			{children}
		</span>
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
	const endPages = range(
		Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
		totalPages,
	);

	const siblingsStart = Math.max(
		Math.min(
			currentPage - siblingCount,
			totalPages - boundaryCount - siblingCount * 2 - 1,
		),
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
