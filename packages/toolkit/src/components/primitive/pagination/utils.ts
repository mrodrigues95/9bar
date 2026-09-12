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
