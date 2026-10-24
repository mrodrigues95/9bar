import type { ComponentProps, ReactNode } from "react";
import { Heading, Text } from "@9bar/toolkit/components";
import { cn } from "@9bar/toolkit/utils";
import { AppBreadcrumbs, type AppBreadcrumbsProps } from "../breadcrumbs/app-breadcrumbs";

interface PageProps extends ComponentProps<"div"> {
	breadcrumbsProps?: AppBreadcrumbsProps;
}

export const Page = ({ children, breadcrumbsProps, className, ...props }: PageProps) => {
	return (
		<div className={cn("flex flex-col gap-4", className)} {...props}>
			<AppBreadcrumbs {...breadcrumbsProps} />
			<div className="flex flex-col gap-4">{children}</div>
		</div>
	);
};

interface PageHeaderProps extends Omit<ComponentProps<"header">, "title"> {
	title: ReactNode;
	description?: ReactNode;
	rightContent?: ReactNode;
}

export const PageHeader = ({
	title,
	description,
	rightContent,
	className,
	children,
	...props
}: PageHeaderProps) => {
	return (
		<header
			className={cn("flex flex-wrap items-start justify-between gap-3", className)}
			{...props}
		>
			<div>
				<Heading as="h1" variant="title">
					{title}
				</Heading>
				{!!description && (
					<Text variant="body-sm" color="secondary">
						{description}
					</Text>
				)}
				{!!children && <div className="mt-2 flex flex-wrap items-center gap-2">{children}</div>}
			</div>
			{rightContent}
		</header>
	);
};
