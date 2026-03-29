import { BookOpenIcon } from "@heroicons/react/24/outline";
import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

/** An empty state placeholder displayed when a view has no content. Provides a call to action to help the user get started. */
export const Empty = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<div
			className={cn(
				"flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-xl border-dashed p-6 text-center md:p-12",
				className,
			)}
			data-slot="empty"
			{...props}
		/>
	);
};

/** The top section of an empty state, typically containing an icon, title, and description. */
export const EmptyHeader = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<div
			className={cn(
				"flex max-w-sm flex-col items-center text-center",
				className,
			)}
			data-slot="empty-header"
			{...props}
		/>
	);
};

/** An illustration or icon displayed above the empty state title. Renders a default book icon when no children are provided. */
export const EmptyMedia = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<div
			className={cn(
				"relative mb-6 flex shrink-0 items-center justify-center [&>svg]:pointer-events-none [&_svg]:size-8 [&_svg]:shrink-0",
				className,
			)}
			data-slot="empty-media"
			{...props}
		>
			<BookOpenIcon />
		</div>
	);
};

/** A heading for the empty state message. */
export const EmptyTitle = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<div
			className={cn("font-semibold text-xl leading-none", className)}
			data-slot="empty-title"
			{...props}
		/>
	);
};

/** Supplementary text explaining why the view is empty or what action to take. */
export const EmptyDescription = ({
	className,
	...props
}: ComponentProps<"div">) => {
	return (
		<div
			className={cn(
				"text-slate-600 text-sm/relaxed [[data-slot=empty-title]+&]:mt-1",
				className,
			)}
			data-slot="empty-description"
			{...props}
		/>
	);
};

/** A container for action buttons or links within an empty state. */
export const EmptyContent = ({
	className,
	...props
}: ComponentProps<"div">) => {
	return (
		<div
			className={cn(
				"flex w-full min-w-0 max-w-sm items-center gap-2 text-balance text-sm",
				className,
			)}
			data-slot="empty-content"
			{...props}
		/>
	);
};
