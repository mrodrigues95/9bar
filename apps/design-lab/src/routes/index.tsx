import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, GitCompareArrows, MousePointerClick } from "lucide-react";
import {
	Badge,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Heading,
	Text,
} from "@9bar/toolkit/components";
import { Link } from "../components/link";
import { designGroups, designRegistry } from "./-design-registry";
import { VariantFrame } from "./-variant-frame";

const LOOP_STEPS = [
	"Agent adds a variant component in -variants/ and registers it — gallery, compare, and isolated views update automatically.",
	"Open a variant (or Compare) and toggle Annotate. Click any element, write what should change, save pins.",
	"Hit “Copy for agent”, paste the Markdown back here. The agent revises the variant; old versions stay for diffing.",
];

const DesignGallery = () => {
	return (
		<div className="space-y-6">
			<div>
				<Heading as="h1" variant="title">
					Design Lab
				</Heading>
				<Text variant="body-lg">Mock up variations, compare them side by side, pin feedback.</Text>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>How the loop works</CardTitle>
				</CardHeader>
				<CardContent>
					<ol className="list-decimal space-y-1.5 pl-5 text-sm">
						{LOOP_STEPS.map((step) => {
							return <li key={step.slice(0, 24)}>{step}</li>;
						})}
					</ol>
				</CardContent>
			</Card>

			{designGroups.map((group) => {
				const variants = designRegistry.filter((entry) => entry.groupId === group.id);
				if (!variants.length) {
					return null;
				}
				const [first, second] = variants;
				const comparable = first !== undefined && second !== undefined;
				return (
					<section key={group.id} aria-labelledby={`group-${group.id}`} className="space-y-4">
						<div className="flex flex-wrap items-end justify-between gap-3">
							<div>
								<Heading as="h2" variant="subtitle" id={`group-${group.id}`}>
									{group.title}
								</Heading>
								<Text variant="body-sm">{group.question}</Text>
							</div>
							{comparable && (
								<Link to="/compare" search={{ group: group.id, a: first.id, b: second.id }}>
									<GitCompareArrows />
									Compare these
								</Link>
							)}
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							{variants.map((entry) => {
								const Variant = entry.component;
								return (
									<Card key={entry.id}>
										<CardHeader>
											<div className="flex items-center gap-2">
												<Badge variant="outline">{entry.kind}</Badge>
												<CardTitle>{entry.title}</CardTitle>
											</div>
											<Text variant="body-sm">{entry.description}</Text>
										</CardHeader>
										<CardContent className="space-y-3">
											<div
												aria-hidden="true"
												className="pointer-events-none max-h-56 overflow-hidden"
											>
												{entry.surface === "plain" ? (
													<Variant />
												) : (
													<VariantFrame>
														<Variant />
													</VariantFrame>
												)}
											</div>
											<div className="flex flex-wrap gap-2">
												<Link to="/$variantId" params={{ variantId: entry.id }}>
													Open
													<ArrowRight />
												</Link>
												<Link
													to="/$variantId"
													params={{ variantId: entry.id }}
													search={{ annotate: "1" }}
												>
													<MousePointerClick />
													Annotate
												</Link>
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</section>
				);
			})}
		</div>
	);
};

export const Route = createFileRoute("/")({
	component: DesignGallery,
});
