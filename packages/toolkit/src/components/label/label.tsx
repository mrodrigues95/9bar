"use client";

import {
	Label as AriaLabel,
	LabelContext,
	type LabelProps,
} from "react-aria-components";
import { cn } from "#lib/utils";

/** Props for the {@link Label} component. */
export type { LabelProps };

/** A label that describes a form control, automatically associated with it via the `htmlFor` prop or the surrounding field context. */
export const Label = ({ className, htmlFor, slot, ...props }: LabelProps) => {
	const label = (
		<AriaLabel
			data-slot="label"
			className={cn(
				[
					"flex select-none items-center gap-2 font-medium text-xs/relaxed leading-none",
					"peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
					"group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
					"peer-data-disabled:opacity-50",
				],
				className,
			)}
			{...props}
			htmlFor={htmlFor}
			slot={slot}
		/>
	);

	if (htmlFor && slot === undefined) {
		return <LabelContext.Provider value={null}>{label}</LabelContext.Provider>;
	}

	return label;
};
