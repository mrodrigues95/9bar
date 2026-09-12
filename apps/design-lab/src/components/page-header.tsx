import type { ReactNode } from "react";
import { Heading, Text } from "@9bar/toolkit/components";

type PageHeaderProps = {
	title: string;
	lede?: string;
	badge?: ReactNode;
	actions?: ReactNode;
};

export const PageHeader = ({ title, lede, badge, actions }: PageHeaderProps) => {
	return (
		<div className="flex flex-wrap items-end justify-between gap-3">
			<div>
				<div className="flex flex-wrap items-center gap-2">
					{badge}
					<Heading as="h1" variant="title">
						{title}
					</Heading>
				</div>
				{lede && <Text variant="body-lg">{lede}</Text>}
			</div>
			{actions}
		</div>
	);
};
