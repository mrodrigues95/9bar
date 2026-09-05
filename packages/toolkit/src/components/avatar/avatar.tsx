import type * as React from "react";
import { useState } from "react";
import { cn } from "#lib/utils";

/** Props for the {@link Avatar} component. */
export type AvatarProps = React.ComponentProps<"div"> & {
	size?: "default" | "sm" | "lg";
};

/** A circular image container. Combine with {@link AvatarImage} and {@link AvatarFallback} to render a user photo with a loading/error placeholder. */
export const Avatar = ({ className, size = "default", ...props }: AvatarProps) => {
	return (
		<div
			data-slot="avatar"
			data-size={size}
			className={cn(
				[
					"group/avatar relative flex size-8 shrink-0 rounded-full select-none",
					"after:absolute after:inset-0 after:rounded-full",
					"after:border after:border-border after:mix-blend-darken",
					"data-[size=lg]:size-10 data-[size=sm]:size-6",
					"dark:after:mix-blend-lighten",
				],
				className,
			)}
			{...props}
		/>
	);
};

type ImageState = "loading" | "loaded" | "error";

/** Props for the {@link AvatarImage} component. */
export type AvatarImageProps = React.ComponentProps<"img">;

/** The image displayed inside an {@link Avatar}. Tracks its own load state to show or hide the fallback. */
export const AvatarImage = ({ className, ...props }: AvatarImageProps) => {
	const [state, setState] = useState<ImageState>(props.src ? "loading" : "error");
	return (
		<img
			data-slot="avatar-image"
			alt={props.alt || ""}
			data-state={state}
			onLoad={() => setState("loaded")}
			onError={() => setState("error")}
			className={cn(
				"peer aspect-square size-full rounded-full object-cover data-[state=error]:hidden",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link AvatarFallback} component. */
export type AvatarFallbackProps = React.ComponentProps<"div">;

/** A placeholder rendered inside an {@link Avatar} while the image loads or when it fails. */
export const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => {
	return (
		<div
			data-slot="avatar-fallback"
			className={cn(
				[
					"flex size-full items-center justify-center rounded-full bg-muted text-sm text-foreground/70",
					"group-data-[size=sm]/avatar:text-xs peer-data-[state=error]:flex peer-[*]:hidden",
				],
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link AvatarBadge} component. */
export type AvatarBadgeProps = React.ComponentProps<"span">;

/** A status badge anchored to the corner of an {@link Avatar}. */
export const AvatarBadge = ({ className, ...props }: AvatarBadgeProps) => {
	return (
		<span
			data-slot="avatar-badge"
			className={cn(
				[
					"absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
					"group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
					"group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
					"group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
				],
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link AvatarGroup} component. */
export type AvatarGroupProps = React.ComponentProps<"div">;

/** A cluster of overlapping {@link Avatar} elements. */
export const AvatarGroup = ({ className, ...props }: AvatarGroupProps) => {
	return (
		<div
			data-slot="avatar-group"
			className={cn(
				[
					"group/avatar-group flex -space-x-2",
					"*:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
				],
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link AvatarGroupCount} component. */
export type AvatarGroupCountProps = React.ComponentProps<"div">;

/** A count chip rendered at the end of an {@link AvatarGroup}, sized to match the avatars. */
export const AvatarGroupCount = ({ className, ...props }: AvatarGroupCountProps) => {
	return (
		<div
			data-slot="avatar-group-count"
			className={cn(
				[
					"relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs/relaxed text-foreground/70 ring-2 ring-background",
					"group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6",
					"group-has-data-[size=lg]/avatar-group:[&>svg]:size-5",
					"group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
					"[&>svg]:size-4",
				],
				className,
			)}
			{...props}
		/>
	);
};
