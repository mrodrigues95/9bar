import {
	type BreadcrumbProps as AriaBreadCrumbProps,
	type BreadcrumbsProps as AriaBreadCrumbsProps,
	Breadcrumb as AriaBreadcrumb,
	Breadcrumbs as AriaBreadcrumbs,
} from "react-aria-components";
import { cn } from "tailwind-variants";
import { composeTailwindRenderProps } from "../../utils/classes";

export interface BreadcrumbsProps<T extends object>
	extends AriaBreadCrumbsProps<T> {}

export const Breadcrumbs = <T extends object>({
	className,
	...props
}: BreadcrumbsProps<T>) => {
	return (
		<AriaBreadcrumbs
			{...props}
			className={
				cn(
					"wrap-break-word flex flex-wrap items-center gap-1.5 text-sm sm:gap-2.5",
					className,
				) ?? ""
			}
		/>
	);
};

export interface BreadcrumbProps extends AriaBreadCrumbProps {}

export const Breadcrumb = ({ className, ...props }: BreadcrumbProps) => {
	return (
		<AriaBreadcrumb
			{...props}
			className={composeTailwindRenderProps(
				className,
				"inline-flex items-center gap-1.5",
			)}
		/>
	);
};
