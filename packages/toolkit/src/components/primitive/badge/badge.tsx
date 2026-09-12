import { type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "#lib/utils";
import { badgeVariants } from "./styles";

/** Props for the {@link Badge} component. */
export type BadgeProps = React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & {
		render?: (props: React.HTMLAttributes<HTMLElement>) => React.ReactNode;
	};

/** A compact label used to highlight status, category, or metadata. Use `badgeVariants` with a plain element to render a badge-styled link. */
export const Badge = ({ className, variant = "default", render, ...props }: BadgeProps) => {
	if (render) {
		const renderProps = {
			"data-slot": "badge",
			"data-variant": variant,
			className: cn(badgeVariants({ variant }), className),
			...props,
		};

		return render(renderProps);
	}

	return (
		<span
			data-slot="badge"
			data-variant={variant}
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
};
