import { cva } from "class-variance-authority";

export const dialogOverlayVariants = cva([
	"fixed inset-0 isolate z-50 bg-black/40 duration-100",
	"data-entering:animate-in data-entering:fade-in-0",
	"data-exiting:animate-out data-exiting:fade-out-0",
	"supports-backdrop-filter:backdrop-blur-xs",
]);

export const dialogContentVariants = cva([
	"fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2",
	"max-w-[calc(100%-2rem)] gap-4 rounded-xl bg-popover p-4",
	"text-xs/relaxed text-popover-foreground shadow-lg ring-1 ring-foreground/10",
	"duration-100 outline-none",
	"data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95",
	"data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95",
	"sm:max-w-sm",
]);
