import { cva } from "class-variance-authority";

export const inputVariants = cva([
	"w-full rounded-md border border-input bg-input/20 px-2 transition-colors outline-none",
	"text-sm placeholder:text-muted-foreground",
	"focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
	"aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
	"md:text-xs/relaxed",
	"dark:bg-input/30 dark:aria-invalid:border-destructive/50",
	"dark:aria-invalid:ring-destructive/40",
]);
