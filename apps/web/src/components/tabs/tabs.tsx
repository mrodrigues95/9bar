import { Tab, type TabProps } from "@9bar/toolkit";
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
	Pick<TabProps, "id" | "className" | "isDisabled" | "children">;

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
		<Tab
			{...(id ? { id } : {})}
			{...(className ? { className } : {})}
			{...(isDisabled ? { isDisabled } : {})}
			{...(resolvedLinkProps.href ? { href: resolvedLinkProps.href } : {})}
			render={(domProps) =>
				"href" in domProps ? (
					<a
						{...domProps}
						href={domProps.href}
						onClick={(e) => {
							domProps.onClick?.(e);
							resolvedLinkProps.onClick?.(e);
						}}
					/>
				) : (
					<div {...domProps} />
				)
			}
		>
			{children}
		</Tab>
	);
};
