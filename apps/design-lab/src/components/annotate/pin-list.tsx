import { useState } from "react";
import { Button, Card, CardContent, CardHeader, Heading, Text } from "@9bar/toolkit/components";
import { copyText } from "../../utils/clipboard";
import { pinsToMarkdown, type FeedbackPin } from "../../utils/pins";

type PinListProps = {
	variantId: string;
	pins: Array<FeedbackPin>;
	onLocate: (pin: FeedbackPin) => void;
	onDelete: (id: string) => void;
	onClear: () => void;
};

export const PinList = ({ variantId, pins, onLocate, onDelete, onClear }: PinListProps) => {
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		if (await copyText(pinsToMarkdown(variantId, pins))) {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		}
	};

	return (
		<Card>
			<CardHeader>
				<Heading as="h2" variant="subsection">
					Pins ({pins.length})
				</Heading>
				<Text variant="body-sm">
					Stored in this browser per variant. Copy them back to the agent to iterate.
				</Text>
			</CardHeader>
			<CardContent className="space-y-3">
				<ol className="space-y-2">
					{pins.map((pin) => {
						return (
							<li
								key={pin.id}
								className="flex flex-wrap items-start justify-between gap-2 rounded-md border border-border px-3 py-2"
							>
								<div className="min-w-0 flex-1">
									<Text variant="body-sm" className="font-medium">
										{pin.comment}
									</Text>
									<code className="mt-1 block truncate font-mono text-xs text-muted-foreground">
										{pin.selector}
									</code>
								</div>
								<div className="flex gap-1">
									<Button size="xs" variant="ghost" onPress={() => onLocate(pin)}>
										Locate
									</Button>
									<Button size="xs" variant="ghost" onPress={() => onDelete(pin.id)}>
										Delete
									</Button>
								</div>
							</li>
						);
					})}
				</ol>
				<div className="flex flex-wrap gap-2">
					<Button size="sm" variant="outline" onPress={copy}>
						{copied ? "Copied!" : "Copy for agent"}
					</Button>
					<Button size="sm" variant="ghost" onPress={onClear}>
						Clear all
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
