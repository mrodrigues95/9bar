import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Badge, Heading, Text } from "@9bar/toolkit/components";
import { Link } from "../components/link";
import { AnnotateScope } from "./-annotate/annotate-scope";
import { getVariant } from "./-design-registry";
import { VariantFrame } from "./-variant-frame";

const searchSchema = z.object({
	annotate: z.string().optional(),
});

const VariantView = () => {
	const { variantId } = Route.useParams();
	const { annotate } = Route.useSearch();
	const entry = getVariant(variantId);
	const annotateOn = annotate === "1";

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

	const Variant = entry.component;

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
				{annotateOn ? (
					<Link to="/$variantId" params={{ variantId: entry.id }}>
						Done annotating
					</Link>
				) : (
					<Link to="/$variantId" params={{ variantId: entry.id }} search={{ annotate: "1" }}>
						Annotate this variant
					</Link>
				)}
			</div>

			<AnnotateScope variantId={entry.id} enabled={annotateOn}>
				{entry.surface === "plain" ? (
					<Variant />
				) : (
					<VariantFrame>
						<Variant />
					</VariantFrame>
				)}
			</AnnotateScope>
		</div>
	);
};

export const Route = createFileRoute("/$variantId")({
	validateSearch: zodValidator(searchSchema),
	component: VariantView,
});
