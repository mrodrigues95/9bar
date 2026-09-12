import { Badge } from "@9bar/toolkit/components";
import { cn } from "@9bar/toolkit/utils";
import { AnnotateScope } from "../../../components/annotate/annotate-scope";
import { Link } from "../../../components/link";
import type { DesignVariantEntry } from "../../../components/registry/registry";
import { VariantCanvas } from "../../../components/variant-canvas";
import { VariantCard } from "../../../components/variant-card";

type CompareBoardProps = {
	a: DesignVariantEntry;
	b: DesignVariantEntry;
	widthClassName?: string;
	annotate: boolean;
};

export const CompareBoard = ({ a, b, widthClassName, annotate }: CompareBoardProps) => {
	return (
		<div className={cn("grid items-start gap-4 xl:grid-cols-2", widthClassName)}>
			{(["A", "B"] as const).map((slot) => {
				const entry = slot === "A" ? a : b;
				return (
					<VariantCard
						key={slot}
						entry={entry}
						level="h2"
						badges={
							<>
								<Badge variant="secondary">{slot}</Badge>
								<Badge variant="outline">{entry.kind}</Badge>
							</>
						}
						headerAction={
							<Link
								to="/$variantId"
								params={{ variantId: entry.id }}
								search={annotate ? { annotate: true } : undefined}
							>
								Open isolated
							</Link>
						}
					>
						<AnnotateScope key={entry.id} variantId={entry.id} enabled={annotate}>
							<VariantCanvas entry={entry} />
						</AnnotateScope>
					</VariantCard>
				);
			})}
		</div>
	);
};
