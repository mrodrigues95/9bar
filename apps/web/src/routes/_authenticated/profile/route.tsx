import { createFileRoute } from "@tanstack/react-router";
import { Heading, Text } from "@9bar/toolkit/components";

const Profile = () => {
	return (
		<div className="space-y-4">
			<Heading as="h1" variant="title">
				Profile
			</Heading>
			<Text as="p" variant="body-lg">
				Manage your profile settings and preferences. Update your information and customize your
				experience.
			</Text>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/profile")({
	component: Profile,
});
