import type * as React from "react";
import { Button, type ButtonProps } from "../button/button";

const iconButtonSizeMap = {
	xs: "icon-xs",
	sm: "icon-sm",
	md: "icon",
	lg: "icon-lg",
} as const;

type IconButtonSize = keyof typeof iconButtonSizeMap;

/** Props for the {@link IconButton} component. */
export interface IconButtonProps extends Omit<ButtonProps, "size" | "children"> {
	size?: IconButtonSize;
	/** The icon element to render inside the button. */
	children: React.ReactNode;
	/** An accessible label describing the button's action. Required because the button has no visible text. */
	"aria-label": string;
}

/** A button that displays only an icon, requiring an `aria-label` for accessibility. */
export const IconButton = ({ size = "md", children, ...props }: IconButtonProps) => {
	return (
		<Button size={iconButtonSizeMap[size]} {...props}>
			{children}
		</Button>
	);
};
