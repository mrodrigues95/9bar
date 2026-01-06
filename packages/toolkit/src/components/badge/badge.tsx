import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
	base: "relative inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md font-medium outline-none",
	variants: {
		variant: {
			default: "bg-slate-100 text-secondary",
			solid: "bg-slate-900 text-white",
			outline:
				"border border-slate-300 bg-transparent text-secondary shadow-xs",
			danger: "bg-red-50 text-red-700",
			success: "bg-green-50 text-green-700",
			warning: "bg-yellow-50 text-yellow-700",
			info: "bg-blue-50 text-blue-700",
		},
		size: {
			xs: "px-1.5 py-0.5 text-xs [&_svg]:size-2.5",
			sm: "px-2 py-0.5 text-sm [&_svg]:size-3.5",
			md: "px-2.5 py-1 text-base [&_svg]:size-4.5",
		},
	},
	defaultVariants: {
		size: "sm",
		variant: "default",
	},
});

export interface BadgeProps
	extends ComponentProps<"span">,
		VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, size, ...props }: BadgeProps) => {
	return (
		<span
			role="presentation"
			data-slot="badge"
			className={badgeVariants({ variant, size, className })}
			{...props}
		/>
	);
};
