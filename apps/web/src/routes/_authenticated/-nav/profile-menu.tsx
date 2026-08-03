import { Avatar, AvatarFallback, AvatarImage } from "@9bar/toolkit/components";

// TODO: Replace with actual profile menu component.
export const ProfileMenu = () => {
	return (
		<Avatar size="sm">
			<AvatarImage
				src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt="John Doe"
			/>
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	);
};
