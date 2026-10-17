import {
	createLink,
	type RegisteredRouter,
	type ValidateLinkOptions,
} from "@tanstack/react-router";
import type { ComponentPropsWithRef, MouseEventHandler } from "react";
import { Link as ToolkitLink } from "@9bar/toolkit/components";

/**
 * React Aria routes `onClick` through its press system, which drops the click the browser fires for
 * Enter and assistive-technology activation before the router can handle it. The browser then
 * follows the `href` and reloads the app. Running the router's click handler in the capture phase
 * lets it run first, so it can cancel that native activation and navigate on the client.
 *
 * The handler must reach the DOM through `onClickCapture` only. If React Aria also received
 * `onClick`, its press system would replay the router's own handler and navigate twice.
 *
 * @see https://github.com/TanStack/router/issues/7088
 */
export const captureRouterClick = (
	onClick: MouseEventHandler<HTMLAnchorElement> | undefined,
	onClickCapture: MouseEventHandler<HTMLAnchorElement> | undefined,
): MouseEventHandler<HTMLAnchorElement> => {
	return (event) => {
		onClickCapture?.(event);
		onClick?.(event);
	};
};

const AriaRouterLink = ({
	ref,
	onClick,
	onClickCapture,
	...props
}: ComponentPropsWithRef<typeof ToolkitLink>) => {
	return (
		<ToolkitLink
			{...props}
			ref={ref}
			onClickCapture={captureRouterClick(onClick, onClickCapture)}
		/>
	);
};

export const Link = createLink(AriaRouterLink);

export type LinkProps<
	TRouter extends RegisteredRouter = RegisteredRouter,
	TOptions = unknown,
	TFrom extends string = string,
> = ValidateLinkOptions<TRouter, TOptions, TFrom>;
