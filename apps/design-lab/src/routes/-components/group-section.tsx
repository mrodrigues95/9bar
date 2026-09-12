import { ArrowRight, GitCompareArrows, MousePointerClick } from "lucide-react";
import { Heading, Text } from "@9bar/toolkit/components";
import { Link } from "../../components/link";
import type { DesignGroup, DesignVariantEntry } from "../../components/registry/registry";
import { VariantCanvas } from "../../components/variant-canvas";
import { VariantCard } from "../../components/variant-card";

const VariantLinks = ({ entry }: { entry: DesignVariantEntry }) => {
	return (
		<div className="flex flex-wrap gap-2">
			<Link to="/$variantId" params={{ variantId: entry.id }}>
				Open
				<ArrowRight />
			</Link>
			<Link to="/$variantId" params={{ variantId: entry.id }} search={{ annotate: true }}>
				<MousePointerClick />
				Annotate
			</Link>
		</div>
	);
};

export const GroupSection = ({ group }: { group: DesignGroup }) => {
	const { variants } = group;
	if (!variants.length) {
		return null;
	}
	const [first, second] = variants;
	const headingId = `group-${group.id}`;

	return (
		<section aria-labelledby={headingId} className="space-y-4">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<Heading as="h2" variant="subtitle" id={headingId}>
						{group.title}
					</Heading>
					<Text variant="body-sm">{group.question}</Text>
				</div>
				{first && second && (
					<Link to="/compare" search={{ group: group.id, a: first.id, b: second.id }}>
						<GitCompareArrows />
						Compare these
					</Link>
				)}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{variants.map((entry) => {
					return (
						<VariantCard key={entry.id} entry={entry} footer={<VariantLinks entry={entry} />}>
							<div inert className="max-h-56 overflow-hidden">
								<VariantCanvas entry={entry} />
							</div>
						</VariantCard>
					);
				})}
			</div>
		</section>
	);
};
