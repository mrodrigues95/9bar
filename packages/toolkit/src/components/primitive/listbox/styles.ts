import { cva } from "class-variance-authority";

export const listboxItemVariants = cva(
	[
		"group relative flex min-h-7 w-full cursor-default items-center gap-2 select-none",
		"rounded-md py-1 pr-8 pl-2 text-xs/relaxed outline-hidden",
		"[&[href]]:cursor-pointer",
		"hover:bg-foreground/10",
		"focus:bg-foreground/10 focus:text-accent-foreground",
		"not-data-[variant=destructive]:focus:**:text-accent-foreground",
		"data-focused:bg-foreground/10 data-focused:text-accent-foreground",
		"data-disabled:pointer-events-none data-disabled:opacity-50",
		"data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive",
		"dark:data-[variant=destructive]:focus:bg-destructive/20",
		"data-[variant=destructive]:*:[svg]:text-destructive",
		"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
	],
	{
		variants: {
			variant: {
				default: [],
				danger: ["text-destructive"],
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export const listboxSectionHeaderVariants = cva("px-2 py-1.5 text-xs text-muted-foreground");
