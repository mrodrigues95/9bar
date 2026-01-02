import { Link as ToolkitLink } from "@9bar/toolkit";
import {
	createLink,
	type RegisteredRouter,
	type ValidateLinkOptions,
} from "@tanstack/react-router";

export const Link = createLink(ToolkitLink);

// https://tanstack.com/router/latest/docs/framework/react/guide/type-utilities#type-checking-link-options-with-validatelinkoptions
export type LinkProps<
	TRouter extends RegisteredRouter = RegisteredRouter,
	TOptions = unknown,
	TFrom extends string = string,
> = ValidateLinkOptions<TRouter, TOptions, TFrom>;
