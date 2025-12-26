import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
	generatePagination,
	Pagination,
	PaginationButton,
	PaginationContent,
	PaginationEllipsis,
	PaginationFirst,
	PaginationItem,
	PaginationLast,
	PaginationNext,
	PaginationPrevious,
} from "./pagination";

const meta = {
	component: Pagination,
	title: "Pagination",
	parameters: {
		controls: { disable: true },
	},
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
	render: () => {
		const [page, setPage] = useState(6);
		const totalPages = 20;

		const pages = generatePagination({
			currentPage: page,
			totalPages,
			siblingCount: 1,
			boundaryCount: 1,
		});

		return (
			<Pagination>
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
			</Pagination>
		);
	},
};

export const SimplePagination: Story = {
	render: () => {
		const [page, setPage] = useState(1);
		const totalPages = 5;

		return (
			<div className="space-y-4">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onPress={() => setPage(Math.max(1, page - 1))}
								isDisabled={page === 1}
							/>
						</PaginationItem>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
							<PaginationItem key={num}>
								<PaginationButton
									isActive={page === num}
									onPress={() => setPage(num)}
									aria-label={`Go to page ${num}`}
								>
									{num}
								</PaginationButton>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								onPress={() => setPage(Math.min(totalPages, page + 1))}
								isDisabled={page === totalPages}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
				<p className="text-gray-600 text-sm">Current page: {page}</p>
			</div>
		);
	},
};

export const DisabledState: Story = {
	render: () => (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious isDisabled />
				</PaginationItem>
				<PaginationItem>
					<PaginationButton isActive isDisabled aria-label="Page 1">
						1
					</PaginationButton>
				</PaginationItem>
				<PaginationItem>
					<PaginationButton isDisabled aria-label="Go to page 2">
						2
					</PaginationButton>
				</PaginationItem>
				<PaginationItem>
					<PaginationButton isDisabled aria-label="Go to page 3">
						3
					</PaginationButton>
				</PaginationItem>
				<PaginationItem>
					<PaginationEllipsis isDisabled />
				</PaginationItem>
				<PaginationItem>
					<PaginationButton isDisabled aria-label="Go to page 10">
						10
					</PaginationButton>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext isDisabled />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	),
};

export const WithContent: Story = {
	render: () => {
		const [page, setPage] = useState(1);
		const totalItems = 59;
		const itemsPerPage = 10;
		const totalPages = Math.ceil(totalItems / itemsPerPage);
		const startItem = (page - 1) * itemsPerPage + 1;
		const endItem = Math.min(page * itemsPerPage, totalItems);

		const pages = generatePagination({
			currentPage: page,
			totalPages,
			siblingCount: 1,
			boundaryCount: 1,
		});

		return (
			<div className="space-y-4">
				<div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
					<p className="text-gray-600 text-sm">
						Showing{" "}
						<span className="font-medium text-slate-950 dark:text-slate-50">
							{startItem}
						</span>{" "}
						to{" "}
						<span className="font-medium text-slate-950 dark:text-slate-50">
							{endItem}
						</span>{" "}
						of{" "}
						<span className="font-medium text-slate-950 dark:text-slate-50">
							{totalItems}
						</span>{" "}
						items
					</p>
				</div>
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onPress={() => setPage(Math.max(1, page - 1))}
								isDisabled={page === 1}
							/>
						</PaginationItem>
						{pages.map((item) => {
							if (typeof item === "string" && item.startsWith("ellipsis")) {
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
										onPress={() => setPage(item as number)}
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
					</PaginationContent>
				</Pagination>
			</div>
		);
	},
};
