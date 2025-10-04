import { Button } from "@9bar/toolkit";
import { useChildMatches } from "@tanstack/react-router";

interface SegmentMap {
	text: string;
	linkText: string;
	linkTo: string;
}

const segmentMap: Record<string, SegmentMap> = {
	"/login": {
		text: "New to 9bar?",
		linkText: "Create an account",
		linkTo: "/sign-up",
	},
	"/signup": {
		text: "Already have an account?",
		linkText: "Sign in",
		linkTo: "/login",
	},
};

export const Footer = () => {
	const matches = useChildMatches();
	const match = matches.find((match) => !!segmentMap[match.pathname]);
	const segment = segmentMap[match?.pathname || ""];

	if (!segment) {
		return null;
	}

	return (
		<footer className="flex shrink-0 flex-col items-center justify-center gap-4 sm:flex-row">
			<span className="font-medium">{segment.text}</span>
			<Button variant="outline" size="md">
				{segment.linkText}
			</Button>
		</footer>
	);
};
