import type { ComponentProps } from "react";
import { cn } from "tailwind-variants";

export const ListItem = (props: ComponentProps<"li">) => {
	return (
		<li
			{...props}
			className={cn(
				"flex items-center py-4 first:pt-0 last:pb-0",
				props.className,
			)}
		/>
	);
};

export const List = (props: ComponentProps<"ul">) => {
	return (
		<ul {...props} className={cn("divide-y divide-border", props.className)} />
	);
};
