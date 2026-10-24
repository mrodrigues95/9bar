import { SearchX } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@9bar/toolkit/components";
import { cn } from "@9bar/toolkit/utils";
import { Pagination } from "../pagination/pagination";

interface ListCardProps {
	actions?: ReactNode;
	paginationProps: ComponentProps<typeof Pagination>;
	children: ReactNode;
}

export const ListCard = ({ actions, paginationProps, children }: ListCardProps) => {
	return (
		<Card>
			{!!actions && (
				<CardHeader className="border-b border-b-border pb-6">
					<div className="flex flex-wrap items-center justify-end gap-2">{actions}</div>
				</CardHeader>
			)}
			<CardContent className="flex flex-col gap-2">{children}</CardContent>
			<CardFooter className="flex flex-row items-center justify-between border-t border-t-border pt-6">
				<Pagination {...paginationProps} />
			</CardFooter>
		</Card>
	);
};

interface ListResultsProps {
	isBusy: boolean;
	isEmpty: boolean;
	emptyState: ReactNode;
	children: ReactNode;
}

export const ListResults = ({ isBusy, isEmpty, emptyState, children }: ListResultsProps) => {
	return (
		<div
			aria-busy={isBusy}
			className={cn("transition-opacity duration-200", isBusy && "opacity-60")}
		>
			{isEmpty ? emptyState : children}
		</div>
	);
};

interface ListEmptyProps {
	title: string;
	description: string;
	action?: ReactNode;
}

export const ListEmpty = ({ title, description, action }: ListEmptyProps) => {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<SearchX />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
			{!!action && <EmptyContent>{action}</EmptyContent>}
		</Empty>
	);
};
