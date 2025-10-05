import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { useChildMatches } from "@tanstack/react-router";
import { Link } from "../../components";

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
	"/sign-up": {
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
		<footer className="flex shrink-0 flex-col items-center justify-center gap-2 sm:flex-row">
			<span className="text-sm">{segment.text}</span>
			<Link
				to={segment.linkTo}
				search={(prev) => prev}
				size="sm"
				className="p-0"
			>
				{segment.linkText}
				<ArrowRightIcon className="size-4" />
			</Link>
		</footer>
	);
};
