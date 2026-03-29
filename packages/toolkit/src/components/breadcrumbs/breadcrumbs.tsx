import {
	type BreadcrumbProps as AriaBreadCrumbProps,
	type BreadcrumbsProps as AriaBreadCrumbsProps,
	Breadcrumb as AriaBreadcrumb,
	Breadcrumbs as AriaBreadcrumbs,
} from "react-aria-components";
import { cn } from "tailwind-variants";
import { composeTailwindRenderProps } from "../../utils/classes";

/** Props for the {@link Breadcrumbs} component. */
export interface BreadcrumbsProps<T extends object>
	extends AriaBreadCrumbsProps<T> {}

/**
 * Breadcrumbs display a hierarchy of links to the current page or resource
 * in an application. They allow the user to navigate back to any ancestor.
 */
export const Breadcrumbs = <T extends object>({
	className,
	...props
}: BreadcrumbsProps<T>) => {
	return (
		<AriaBreadcrumbs
			data-slot="breadcrumbs"
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

/** Props for the {@link Breadcrumb} component. */
export interface BreadcrumbProps extends AriaBreadCrumbProps {}

/** An individual item within a breadcrumb trail, representing a single navigation level. */
export const Breadcrumb = ({ className, ...props }: BreadcrumbProps) => {
	return (
		<AriaBreadcrumb
			data-slot="breadcrumb"
			{...props}
			className={composeTailwindRenderProps(
				className,
				"inline-flex items-center gap-1.5",
			)}
		/>
	);
};
