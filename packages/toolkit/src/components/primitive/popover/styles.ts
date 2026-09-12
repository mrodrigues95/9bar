import { cva } from "class-variance-authority";

export const popoverVariants = cva([
	"data-entering:fade-in-0 data-entering:zoom-in-95",
	"data-exiting:fade-out-0 data-exiting:zoom-out-95",
	"data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2",
	"data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2",
	"data-entering:animate-in data-exiting:animate-out",
	"z-50 origin-(--trigger-anchor-point)",
	"rounded-lg bg-popover text-popover-foreground",
	"shadow-md ring-1 ring-foreground/10 outline-hidden",
	"duration-100",
]);
