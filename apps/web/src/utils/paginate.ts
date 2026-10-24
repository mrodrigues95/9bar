export const paginate = <TItem>(items: Array<TItem>, page: number, pageSize: number) => {
	const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const offset = (currentPage - 1) * pageSize;

	return {
		items: items.slice(offset, offset + pageSize),
		total: items.length,
		page: currentPage,
		pageSize,
	};
};
