import { type ReactNode } from "react";
import {
	generatePagination,
	PaginationButton,
	PaginationContent,
	PaginationEllipsis,
	PaginationFirst,
	PaginationItem,
	PaginationLast,
	PaginationNext,
	PaginationPrevious,
	Text,
	Pagination as ToolkitPagination,
} from "@9bar/toolkit/components";

interface PaginationProps {
	page: number;
	pageSize: number;
	total: number;
	onPageChange: (page: number) => void;
}

const PaginationSummaryHighlight = ({ children }: { children: ReactNode }) => {
	return <span className="font-medium text-primary">{children}</span>;
};

const PaginationSummary = ({ page, pageSize, total }: Omit<PaginationProps, "onPageChange">) => {
	const startItem = total ? (page - 1) * pageSize + 1 : total;
	const endItem = Math.min(page * pageSize, total);

	return (
		<Text variant="caption">
			Showing <PaginationSummaryHighlight>{startItem}</PaginationSummaryHighlight> to{" "}
			<PaginationSummaryHighlight>{endItem}</PaginationSummaryHighlight> of{" "}
			<PaginationSummaryHighlight>{total}</PaginationSummaryHighlight>
		</Text>
	);
};

const resolvePageItems = (pages: Array<number | "ellipsis">) => {
	return pages.map((item, index) => ({
		key: item === "ellipsis" ? `ellipsis-${pages[index + 1] ?? "end"}` : `page-${item}`,
		item,
	}));
};

export const Pagination = ({ page, pageSize, total, onPageChange }: PaginationProps) => {
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	const pages = generatePagination({
		currentPage: page,
		totalPages,
		siblingCount: 1,
		boundaryCount: 1,
	});
	const pageItems = resolvePageItems(pages);

	return (
		<div className="flex w-full items-center justify-between gap-4">
			<PaginationSummary page={page} pageSize={pageSize} total={total} />
			<ToolkitPagination className="mx-0 w-auto">
				<PaginationContent>
					<PaginationItem>
						<PaginationFirst onPress={() => onPageChange(1)} isDisabled={page === 1} />
					</PaginationItem>
					<PaginationItem>
						<PaginationPrevious
							onPress={() => onPageChange(Math.max(1, page - 1))}
							isDisabled={page === 1}
						/>
					</PaginationItem>
					{pageItems.map(({ key, item }) => {
						if (item === "ellipsis") {
							return (
								<PaginationItem key={key}>
									<PaginationEllipsis />
								</PaginationItem>
							);
						}

						return (
							<PaginationItem key={key}>
								<PaginationButton
									isActive={page === item}
									onPress={() => onPageChange(item)}
									aria-label={`Go to page ${item}`}
								>
									{item}
								</PaginationButton>
							</PaginationItem>
						);
					})}
					<PaginationItem>
						<PaginationNext
							onPress={() => onPageChange(Math.min(totalPages, page + 1))}
							isDisabled={page === totalPages}
						/>
					</PaginationItem>
					<PaginationItem>
						<PaginationLast
							onPress={() => onPageChange(totalPages)}
							isDisabled={page === totalPages}
						/>
					</PaginationItem>
				</PaginationContent>
			</ToolkitPagination>
		</div>
	);
};
