import { cva } from "class-variance-authority";

export const calendarVariants = cva([
	"group/calendar w-fit bg-background p-3",
	"[--cell-radius:var(--radius-md)] [--cell-size:--spacing(6)]",
	"in-data-[slot=card-content]:bg-transparent",
	"in-data-[slot=popover-content]:bg-transparent",
]);

export const calendarCellVariants = cva(
	"group/day relative h-full w-full cursor-default rounded-(--cell-radius) p-0 text-center select-none",
	{
		variants: {
			isToday: {
				true: "bg-muted text-foreground",
			},
			isUnavailable: {
				true: "text-muted-foreground opacity-50 [&>div]:line-through",
			},
			isDisabled: {
				true: "text-muted-foreground opacity-50",
			},
			isOutsideMonth: {
				true: "text-muted-foreground",
			},
		},
	},
);
