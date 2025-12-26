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
} from "@9bar/toolkit";
import { type ReactNode, useState } from "react";

const PaginationSummaryHighlight = ({ children }: { children: ReactNode }) => {
	return <span className="font-medium text-slate-900">{children}</span>;
};

const PaginationSummary = ({
	page,
	itemsPerPage,
	totalItems,
}: {
	page: number;
	itemsPerPage: number;
	totalItems: number;
}) => {
	const startItem = (page - 1) * itemsPerPage + 1;
	const endItem = Math.min(page * itemsPerPage, totalItems);

	return (
		<Text variant="caption">
			Showing{" "}
			<PaginationSummaryHighlight>{startItem}</PaginationSummaryHighlight> to{" "}
			<PaginationSummaryHighlight>{endItem}</PaginationSummaryHighlight> of{" "}
			<PaginationSummaryHighlight>{totalItems}</PaginationSummaryHighlight>{" "}
			recipes
		</Text>
	);
};

export const Pagination = () => {
	const [page, setPage] = useState(1);
	const totalItems = 59;
	const itemsPerPage = 10;
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const pages = generatePagination({
		currentPage: page,
		totalPages,
		siblingCount: 1,
		boundaryCount: 1,
	});

	return (
		<div className="flex w-full items-center justify-between">
			<PaginationSummary
				page={page}
				itemsPerPage={itemsPerPage}
				totalItems={totalItems}
			/>
			<ToolkitPagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationFirst
							onPress={() => setPage(1)}
							isDisabled={page === 1}
						/>
					</PaginationItem>
					<PaginationItem>
						<PaginationPrevious
							onPress={() => setPage(Math.max(1, page - 1))}
							isDisabled={page === 1}
						/>
					</PaginationItem>
					{pages.map((item) => {
						if (item === "ellipsis") {
							return (
								<PaginationItem key={item}>
									<PaginationEllipsis />
								</PaginationItem>
							);
						}

						return (
							<PaginationItem key={item}>
								<PaginationButton
									isActive={page === item}
									onPress={() => setPage(item)}
									aria-label={`Go to page ${item}`}
								>
									{item}
								</PaginationButton>
							</PaginationItem>
						);
					})}
					<PaginationItem>
						<PaginationNext
							onPress={() => setPage(Math.min(totalPages, page + 1))}
							isDisabled={page === totalPages}
						/>
					</PaginationItem>
					<PaginationItem>
						<PaginationLast
							onPress={() => setPage(totalPages)}
							isDisabled={page === totalPages}
						/>
					</PaginationItem>
				</PaginationContent>
			</ToolkitPagination>
		</div>
	);
};
