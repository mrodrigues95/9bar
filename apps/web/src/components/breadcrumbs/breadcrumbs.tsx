import {
	Breadcrumb as ToolkitBreadcrumb,
	type BreadcrumbProps as ToolkitBreadcrumbProps,
	Breadcrumbs as ToolkitBreadcrumbs,
	type BreadcrumbsProps as ToolkitBreadcrumbsProps,
} from "@9bar/toolkit";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { cn } from "tailwind-variants";
import { Link, type LinkProps } from "../link/link";

export type BreadcrumbProps = LinkProps & {
	breadcrumbProps?: Omit<ToolkitBreadcrumbProps, "children">;
};

// TODO: Fix type safety on `LinkProps` since `to` is being inferred as a generic string.
export const Breadcrumb = ({
	breadcrumbProps,
	className,
	...props
}: BreadcrumbProps) => {
	return (
		<ToolkitBreadcrumb
			{...breadcrumbProps}
			className={
				cn("disabled:[&_svg]:opacity-50", breadcrumbProps?.className) ?? ""
			}
		>
			{({ isCurrent }) => (
				<>
					<Link
						{...props}
						activeOptions={{ exact: true, ...props.activeOptions }}
						className={
							cn(
								"p-0 text-slate-500",
								"hover:text-slate-900",
								"focus-visible:text-slate-900",
								"current:text-slate-900 current:disabled:opacity-100",
								className,
							) ?? ""
						}
					/>
					{!isCurrent && <ChevronRightIcon className="size-3 text-slate-500" />}
				</>
			)}
		</ToolkitBreadcrumb>
	);
};

interface BreadcrumbsProps<T extends object>
	extends ToolkitBreadcrumbsProps<T> {}

export const Breadcrumbs = <T extends object>(props: BreadcrumbsProps<T>) => {
	return <ToolkitBreadcrumbs {...props} />;
};
