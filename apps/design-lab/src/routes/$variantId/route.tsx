import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Badge } from "@9bar/toolkit/components";
import { AnnotateScope } from "../../components/annotate/annotate-scope";
import { EmptyState } from "../../components/empty-state";
import { Link } from "../../components/link";
import { PageHeader } from "../../components/page-header";
import { designGroups } from "../../components/registry/registry";
import { VariantCanvas } from "../../components/variant-canvas";

const searchSchema = z.object({
	annotate: z.boolean().optional(),
});

const findVariant = (variantId: string) => {
	return designGroups
		.flatMap((group) => group.variants)
		.find((variant) => variant.id === variantId);
};

const VariantView = () => {
	const { variantId } = Route.useParams();
	const { annotate } = Route.useSearch();
	const entry = findVariant(variantId);
	const annotateOn = !!annotate;

	if (!entry) {
		return (
			<EmptyState
				as="h1"
				title={`Unknown variant “${variantId}”`}
				body="It may have been renamed."
				action={<Link to="/">Back to the gallery</Link>}
			/>
		);
	}

	return (
		<div className="space-y-4">
			<PageHeader
				badge={<Badge variant="outline">{entry.kind}</Badge>}
				title={entry.title}
				lede={entry.description}
				actions={
					<Link
						to="/$variantId"
						params={{ variantId: entry.id }}
						search={annotateOn ? undefined : { annotate: true }}
					>
						{annotateOn ? "Done annotating" : "Annotate this variant"}
					</Link>
				}
			/>
			<AnnotateScope key={entry.id} variantId={entry.id} enabled={annotateOn}>
				<VariantCanvas entry={entry} />
			</AnnotateScope>
		</div>
	);
};

export const Route = createFileRoute("/$variantId")({
	validateSearch: zodValidator(searchSchema),
	head: ({ params }) => {
		const entry = findVariant(params.variantId);
		return {
			meta: [
				{
					title: entry ? `${entry.title} — 9bar Design Lab` : "Unknown variant — 9bar Design Lab",
				},
			],
		};
	},
	component: VariantView,
});
