import { Card, CardContent, CardHeader, CardTitle } from "@9bar/toolkit/components";

const LOOP_STEPS = [
	"Agent adds a variant component in components/registry/variants/ and registers it — gallery, compare, and isolated views update automatically.",
	"Open a variant (or Compare) and toggle Annotate. Click any element, write what should change, save pins.",
	"Hit “Copy for agent”, paste the Markdown back here. The agent revises the variant; old versions stay for diffing.",
];

export const HowTheLoopWorks = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>How the loop works</CardTitle>
			</CardHeader>
			<CardContent>
				<ol className="list-decimal space-y-1.5 pl-5 text-sm">
					{LOOP_STEPS.map((step) => {
						return <li key={step}>{step}</li>;
					})}
				</ol>
			</CardContent>
		</Card>
	);
};
