import { TabsTrigger, type TabsTriggerProps } from "@9bar/toolkit/components";
import {
	type RegisteredRouter,
	type UseLinkPropsOptions,
	useLinkProps,
} from "@tanstack/react-router";

type TabLinkProps<
	TRouter extends RegisteredRouter = RegisteredRouter,
	TFrom extends string = string,
	TTo extends string = string,
	TMaskFrom extends string = TFrom,
	TMaskTo extends string = TFrom,
> = UseLinkPropsOptions<TRouter, TFrom, TTo, TMaskFrom, TMaskTo> &
	Pick<TabsTriggerProps, "id" | "className" | "isDisabled" | "children">;

export const TabLink = <
	TRouter extends RegisteredRouter = RegisteredRouter,
	TFrom extends string = string,
	TTo extends string = string,
	TMaskFrom extends string = TFrom,
	TMaskTo extends string = TFrom,
>(
	props: TabLinkProps<TRouter, TFrom, TTo, TMaskFrom, TMaskTo>,
) => {
	const { children, id, className, isDisabled } = props;
	const resolvedLinkProps = useLinkProps(props);

	return (
		<TabsTrigger
			{...(id ? { id } : {})}
			{...(className ? { className } : {})}
			{...(isDisabled ? { isDisabled } : {})}
			{...(resolvedLinkProps.href ? { href: resolvedLinkProps.href } : {})}
			onClick={(e) => {
				(
					resolvedLinkProps.onClick as unknown as
						| ((e: React.MouseEvent) => void)
						| undefined
				)?.(e);
			}}
		>
			{children}
		</TabsTrigger>
	);
};
