import { BookOpenIcon } from "@heroicons/react/24/outline";
import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

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

export const EmptyTitle = ({ className, ...props }: ComponentProps<"div">) => {
	return (
		<div
			className={cn("font-semibold text-xl leading-none", className)}
			data-slot="empty-title"
			{...props}
		/>
	);
};

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
