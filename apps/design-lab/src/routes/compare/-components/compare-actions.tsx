import type { InferFullSearchSchema, RegisteredRouter, RouteById } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@9bar/toolkit/components";
import { Link } from "../../../components/link";
import type { DesignVariantEntry } from "../../../components/registry/registry";
import { copyText } from "../../../utils/clipboard";
import { pinsToMarkdown, readStoredPins } from "../../../utils/pins";

type CompareActionsProps = {
	a: DesignVariantEntry;
	b: DesignVariantEntry;
	groupId: string;
	search: InferFullSearchSchema<RouteById<RegisteredRouter["routeTree"], "/compare">>;
};

export const CompareActions = ({ a, b, groupId, search }: CompareActionsProps) => {
	const [copied, setCopied] = useState(false);
	const annotate = !!search.annotate;

	const copyPair = async () => {
		const text = [a.id, b.id]
			.map((id) => pinsToMarkdown(id, readStoredPins(id)))
			.join("\n\n---\n\n");
		if (await copyText(text)) {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<div className="flex flex-wrap gap-2">
			<Button size="sm" variant="outline" onPress={copyPair}>
				{copied ? "Copied!" : "Copy A+B for agent"}
			</Button>
			<Link
				to="/compare"
				search={{ ...search, group: groupId, annotate: annotate ? undefined : true }}
			>
				{annotate ? "Done annotating" : "Annotate all"}
			</Link>
		</div>
	);
};
