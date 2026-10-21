import {
	type RegisteredRouter,
	type UseLinkPropsOptions,
	useLinkProps,
	useRouter,
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
	const { href } = useLinkProps(props);
	const router = useRouter();

	const preload = () => {
		if (href) {
			// SAFETY: `preloadRoute` builds its location with `buildLocation`, which ignores `href`,
			// so preload by the tab's path. A generic `string` path cannot satisfy its literal `to`.
			void router.preloadRoute({ to: href } as Parameters<typeof router.preloadRoute>[0]);
		}
	};

	return (
		<TabsTrigger
			{...(id ? { id } : {})}
			{...(className ? { className } : {})}
			{...(isDisabled ? { isDisabled } : {})}
			{...(href ? { href } : {})}
			onMouseEnter={preload}
			onFocus={preload}
			onTouchStart={preload}
		>
			{children}
		</TabsTrigger>
	);
};
