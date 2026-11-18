import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
	MoreHorizontalIcon,
} from "lucide-react";
import type * as React from "react";
import { Link } from "#components/link";
import { cn, composeTailwindRenderProps } from "#lib/utils";

/** Props for the {@link Pagination} component. */
export type PaginationProps = React.ComponentProps<"nav">;

/** The root navigation landmark for a set of pagination controls. */
export const Pagination = ({ className, ...props }: PaginationProps) => (
	<nav
		aria-label="pagination"
		data-slot="pagination"
		className={cn("mx-auto flex w-full justify-center", className)}
		{...props}
	/>
);

/** Props for the {@link PaginationContent} component. */
export type PaginationContentProps = React.ComponentProps<"ul">;

/** A horizontal list that lays out {@link PaginationItem} elements. */
export const PaginationContent = ({ className, ...props }: PaginationContentProps) => (
	<ul
		data-slot="pagination-content"
		className={cn("flex items-center gap-0.5", className)}
		{...props}
	/>
);

/** Props for the {@link PaginationItem} component. */
export type PaginationItemProps = React.ComponentProps<"li">;

/** A list item wrapper for a single pagination control (button or ellipsis). */
export const PaginationItem = ({ ...props }: PaginationItemProps) => (
	<li data-slot="pagination-item" {...props} />
);

/** Props for the {@link PaginationLink} component. */
export type PaginationLinkProps = {
	isActive?: boolean;
} & Omit<React.ComponentProps<typeof Link>, "variant">;

/** A page-number link within a {@link PaginationContent}, styled to indicate the active page. */
export const PaginationLink = ({
	className,
	isActive,
	size = "icon",
	...props
}: PaginationLinkProps) => (
	<Link
		variant={isActive === true ? "outline" : "ghost"}
		size={size}
		className={className}
		aria-current={isActive === true ? "page" : undefined}
		data-slot="pagination-link"
		data-active={isActive}
		{...props}
	/>
);

/** Props for the {@link PaginationPrevious} component. */
export type PaginationPreviousProps = React.ComponentProps<typeof PaginationLink> & {
	text?: string;
};

/** A link that navigates to the previous page. */
export const PaginationPrevious = ({
	className,
	text = "Previous",
	...props
}: PaginationPreviousProps) => (
	<PaginationLink
		aria-label="Go to previous page"
		size="default"
		className={composeTailwindRenderProps(className, "pl-2!")}
		{...props}
	>
		<ChevronLeftIcon data-icon="inline-start" />
		<span className="hidden sm:block">{text}</span>
	</PaginationLink>
);

/** Props for the {@link PaginationNext} component. */
export type PaginationNextProps = React.ComponentProps<typeof PaginationLink> & {
	text?: string;
};

/** A link that navigates to the next page. */
export const PaginationNext = ({ className, text = "Next", ...props }: PaginationNextProps) => (
	<PaginationLink
		aria-label="Go to next page"
		size="default"
		className={composeTailwindRenderProps(className, "pr-2!")}
		{...props}
	>
		<span className="hidden sm:block">{text}</span>
		<ChevronRightIcon data-icon="inline-end" />
	</PaginationLink>
);

/** Props for the {@link PaginationEllipsis} component. */
export type PaginationEllipsisProps = React.ComponentProps<"span">;

/** A non-interactive indicator representing omitted page numbers between visible ranges. */
export const PaginationEllipsis = ({ className, ...props }: PaginationEllipsisProps) => (
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
}: PaginationButtonProps) => (
	<PaginationLink
		isActive={isActive}
		className={composeTailwindRenderProps(className, "size-7 p-0")}
		{...props}
	>
		{children}
	</PaginationLink>
);

/** Props for the {@link PaginationFirst} component. */
export type PaginationFirstProps = Omit<PaginationLinkProps, "size" | "children">;

/** A link that navigates to the first page. */
export const PaginationFirst = ({ className, ...props }: PaginationFirstProps) => (
	<PaginationLink
		aria-label="Go to first page"
		className={composeTailwindRenderProps(className, "size-7 p-0")}
		{...props}
	>
		<ChevronsLeftIcon />
	</PaginationLink>
);

/** Props for the {@link PaginationLast} component. */
export type PaginationLastProps = Omit<PaginationLinkProps, "size" | "children">;

/** A link that navigates to the last page. */
export const PaginationLast = ({ className, ...props }: PaginationLastProps) => (
	<PaginationLink
		aria-label="Go to last page"
		className={composeTailwindRenderProps(className, "size-7 p-0")}
		{...props}
	>
		<ChevronsRightIcon />
	</PaginationLink>
);
