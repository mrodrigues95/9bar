import { type LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Text } from "@9bar/toolkit/components";
import { cn } from "@9bar/toolkit/utils";

export const List = (props: ComponentProps<"ul">) => {
	return <ul {...props} />;
};

export const ListRow = (props: ComponentProps<"li">) => {
	return <li {...props} className={cn("flex items-center gap-3 py-1.75", props.className)} />;
};

export const ListRowBody = (props: ComponentProps<"div">) => {
	return <div {...props} className={cn("min-w-0 flex-1", props.className)} />;
};

export const ListRowHeading = (props: ComponentProps<"div">) => {
	return <div {...props} className={cn("flex min-w-0 items-center gap-2", props.className)} />;
};

export const ListRowActions = (props: ComponentProps<"div">) => {
	return <div {...props} className={cn("flex shrink-0 items-center gap-1", props.className)} />;
};

export const ListMeta = (props: ComponentProps<"div">) => {
	return (
		<div
			{...props}
			className={cn(
				"mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-0.5",
				props.className,
			)}
		/>
	);
};

export const ListMetaItem = ({ icon: Icon, label }: { icon: LucideIcon; label: string }) => {
	return (
		<Text variant="caption" className="flex max-w-full min-w-0 items-center gap-1">
			<Icon className="size-3 shrink-0" />
			<span className="truncate">{label}</span>
		</Text>
	);
};

interface ListLineProps {
	icon: LucideIcon;
	mono?: boolean;
	children: ReactNode;
}

export const ListLine = ({ icon: Icon, mono, children }: ListLineProps) => {
	return (
		<Text
			variant="caption"
			className={cn("mt-0.5 flex min-w-0 items-center gap-1", !!mono && "font-mono")}
		>
			<Icon className="size-3 shrink-0" />
			<span className="truncate">{children}</span>
		</Text>
	);
};
