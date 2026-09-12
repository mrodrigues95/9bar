import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Badge, Heading, Text } from "@9bar/toolkit/components";
import { AnnotateScope } from "../../components/annotate-scope";
import { Link } from "../../components/link";
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
			<div className="space-y-2">
				<Heading as="h1" variant="title">
					Unknown variant “{variantId}”
				</Heading>
				<Text variant="body-lg">
					It may have been renamed. Pick one from the <Link to="/">gallery</Link>.
				</Text>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-end justify-between gap-3">
				<div>
					<div className="flex items-center gap-2">
						<Badge variant="outline">{entry.kind}</Badge>
						<Heading as="h1" variant="title">
							{entry.title}
						</Heading>
					</div>
					<Text variant="body-lg">{entry.description}</Text>
				</div>
				<Link
					to="/$variantId"
					params={{ variantId: entry.id }}
					search={annotateOn ? undefined : { annotate: true }}
				>
					{annotateOn ? "Done annotating" : "Annotate this variant"}
				</Link>
			</div>
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
