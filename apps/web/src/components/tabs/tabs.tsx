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

	// SAFETY: TabsTrigger forwards these props to the underlying DOM element, so the
	// router's anchor-typed preload handlers receive a genuine DOM event at runtime.
	// The assertions only reconcile the element variance that useLinkProps erases.
	const preloadProps = {
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
			onClick={(e) => {
				// SAFETY: TabsTrigger forwards the native click event, so the router's composed
				// click handler receives a real React.MouseEvent at runtime. The single assertion
				// only recovers the handler type that useLinkProps erases.
				(resolvedLinkProps.onClick as ((e: React.MouseEvent) => void) | undefined)?.(e);
			}}
		>
			{children}
		</TabsTrigger>
	);
};
