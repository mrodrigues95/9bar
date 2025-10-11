import { Text } from "@9bar/toolkit";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useLocation } from "@tanstack/react-router";
import { Link } from "../../components";
import type { FileRouteTypes } from "../../routeTree.gen";

interface TSegmentMap {
	text: string;
	linkText: string;
	linkTo: FileRouteTypes["to"];
}

const segmentMap: Partial<Record<FileRouteTypes["to"], TSegmentMap>> = {
	"/sign-in": {
		text: "New to 9bar?",
		linkText: "Create an account",
		linkTo: "/sign-up",
	},
	"/sign-up": {
		text: "Already have an account?",
		linkText: "Sign in",
		linkTo: "/sign-in",
	},
};

export const Footer = () => {
	const location = useLocation();
	const segment = segmentMap[location.pathname as FileRouteTypes["to"]];

	if (!segment) {
		return null;
	}

	return (
		<footer className="flex shrink-0 flex-col items-center justify-center gap-2 sm:flex-row">
			<Text as="span" variant="body-sm" className="leading-none">
				{segment.text}
			</Text>
			<Link to={segment.linkTo} size="sm" className="p-0">
				{segment.linkText}
				<ArrowRightIcon className="size-4" />
			</Link>
		</footer>
	);
};
