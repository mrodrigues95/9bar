import { Avatar, type AvatarProps } from "@9bar/toolkit";

interface LogoProps extends AvatarProps {}

// TODO: Replace with actual logo graphic.
export const Logo = (props?: LogoProps) => (
	<Avatar radius="md" color="rose" name="9" size="sm" {...props} />
);
