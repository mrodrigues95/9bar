import { cva } from "class-variance-authority";

export const datePickerGroupVariants = cva([
	// EXTERNAL(https://react-spectrum.adobe.com/react-aria/DatePicker.html): DateInput renders a Group with role="group"; key the ring off the role because fields rename data-slot.
	"has-[[role=group][data-focus-visible]]:border-ring",
	"has-[[role=group][data-focus-visible]]:ring-2",
	"has-[[role=group][data-focus-visible]]:ring-ring/30",
	"has-[[role=group][data-invalid]]:border-destructive",
	"has-[[role=group][data-invalid]]:ring-2",
	"has-[[role=group][data-invalid]]:ring-destructive/20",
	"dark:has-[[role=group][data-invalid]]:ring-destructive/40",
]);

export const datePickerInputVariants = cva([
	"flex min-w-0 flex-1 items-center px-2 text-xs/relaxed outline-none",
	"data-disabled:opacity-50",
]);

export const datePickerSegmentVariants = cva([
	"rounded-sm p-0.5 tabular-nums outline-none",
	"data-[type=literal]:p-0",
	"data-[type=hour]:ml-0.5",
	"data-[type=dayPeriod]:ml-0.5",
	"data-placeholder:text-muted-foreground",
	"data-focused:bg-input",
	"data-disabled:opacity-50",
	"data-invalid:text-destructive",
]);
