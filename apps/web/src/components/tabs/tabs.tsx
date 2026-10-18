import {
	type RegisteredRouter,
	type UseLinkPropsOptions,
	useLinkProps,
} from "@tanstack/react-router";
import { TabsTrigger, type TabsTriggerProps } from "@9bar/toolkit/components";

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

	// SAFETY: React Aria documents a `render`-prop pattern for router links
	// (https://react-aria.adobe.com/Tabs#links), but `Tab` ignores `render` at
	// runtime in the installed RAC version (and upstream), so TabLink forwards the useLinkProps
	// handlers to TabsTrigger instead. Revisit if upstream honors `render` on Tab.
	const preloadProps = {
		onClick: resolvedLinkProps.onClick as React.MouseEventHandler | undefined,
		onBlur: resolvedLinkProps.onBlur as React.FocusEventHandler | undefined,
		onFocus: resolvedLinkProps.onFocus as React.FocusEventHandler | undefined,
		onMouseEnter: resolvedLinkProps.onMouseEnter as React.MouseEventHandler | undefined,
		onMouseLeave: resolvedLinkProps.onMouseLeave as React.MouseEventHandler | undefined,
		onTouchStart: resolvedLinkProps.onTouchStart as React.TouchEventHandler | undefined,
	};

	return (
		<TabsTrigger
			{...(id ? { id } : {})}
			{...(className ? { className } : {})}
			{...(isDisabled ? { isDisabled } : {})}
			{...(resolvedLinkProps.href ? { href: resolvedLinkProps.href } : {})}
			{...preloadProps}
		>
			{children}
		</TabsTrigger>
	);
};
