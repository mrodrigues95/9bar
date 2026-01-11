import type React from "react";
import {
	Popover as AriaPopover,
	type PopoverProps as AriaPopoverProps,
	composeRenderProps,
	OverlayArrow,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const popoverVariants = tv({
	base: "w-max rounded-md border border-border bg-white text-secondary shadow-lg outline-none",
	variants: {
		isEntering: {
			true: "fade-in zoom-in-95 animate-in duration-200 ease-out",
		},
		isExiting: {
			true: "zoom-out-95 fade-out animate-out duration-100 ease-in",
		},
	},
});

export interface PopoverProps extends Omit<AriaPopoverProps, "children"> {
	showArrow?: boolean;
	children: React.ReactNode;
}

export const Popover = ({
	children,
	showArrow,
	className,
	...props
}: PopoverProps) => {
	return (
		<AriaPopover
			offset={showArrow ? 12 : 8}
			data-slot="popover"
			{...props}
			className={composeRenderProps(className, (className, renderProps) =>
				popoverVariants({ ...renderProps, className }),
			)}
		>
			{showArrow && (
				<OverlayArrow className="group">
					<svg
						aria-hidden="true"
						width={12}
						height={12}
						viewBox="0 0 12 12"
						className="group-placement-left:-rotate-90 block fill-white stroke-1 stroke-black/10 group-placement-bottom:rotate-180 group-placement-right:rotate-90"
					>
						<path d="M0 0 L6 6 L12 0" />
					</svg>
				</OverlayArrow>
			)}
			{children}
		</AriaPopover>
	);
};
