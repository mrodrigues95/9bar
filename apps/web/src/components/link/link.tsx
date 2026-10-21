import {
	createLink,
	type RegisteredRouter,
	type ValidateLinkOptions,
} from "@tanstack/react-router";
import { Link as ToolkitLink } from "@9bar/toolkit/components";

export const Link = createLink(ToolkitLink);

export type LinkProps<
	TRouter extends RegisteredRouter = RegisteredRouter,
	TOptions = unknown,
	TFrom extends string = string,
> = ValidateLinkOptions<TRouter, TOptions, TFrom>;
