import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useState } from "react";
import { z } from "zod";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Heading,
	Text,
} from "@9bar/toolkit/components";
import { cn } from "@9bar/toolkit/utils";
import { Link } from "../components/link";
import { AnnotateScope } from "./-annotate/annotate-scope";
import { pinsToCombinedMarkdown } from "./-annotate/annotate-utils";
import {
	designGroups,
	getGroup,
	getGroupVariants,
	getVariant,
	type DesignVariantEntry,
} from "./-design-registry";
import { VariantFrame } from "./-variant-frame";

const searchSchema = z.object({
	group: z.string().optional(),
	a: z.string().optional(),
	b: z.string().optional(),
	w: z.string().optional(),
	annotate: z.string().optional(),
});

type WidthPreset = "full" | "768" | "390";

const WIDTHS: Array<{ id: WidthPreset; label: string }> = [
	{ id: "full", label: "Full" },
	{ id: "768", label: "Tablet 768" },
	{ id: "390", label: "Mobile 390" },
];

const normalizeWidth = (w: string | undefined): WidthPreset => {
	return w === "768" || w === "390" ? w : "full";
};

const resolvePick = (
	pick: string | undefined,
	variants: Array<DesignVariantEntry>,
): DesignVariantEntry | undefined => {
	if (pick !== undefined) {
		const entry = getVariant(pick);
		if (entry !== undefined && variants.some((variant) => variant.id === entry.id)) {
			return entry;
		}
	}
	return undefined;
};

const CompareDesigns = () => {
	const search = Route.useSearch();
	const annotateAll = search.annotate === "1";
	const width = normalizeWidth(search.w);
	const [copiedAll, setCopiedAll] = useState(false);

	const activeGroup =
		(search.group !== undefined ? getGroup(search.group) : undefined) ?? designGroups[0];
	if (!activeGroup) {
		return (
			<div className="space-y-2">
				<Heading as="h1" variant="title">
					Compare
				</Heading>
				<Text variant="body-lg">No groups yet. Register one in -design-registry.tsx.</Text>
			</div>
		);
	}

	const variants = getGroupVariants(activeGroup.id);
	const activeA = resolvePick(search.a, variants) ?? variants[0];
	const activeB = resolvePick(search.b, variants) ?? variants[1];
	const widthParam = width === "full" ? undefined : width;

	const copyCombined = () => {
		if (!activeA || !activeB) {
			return;
		}
		const text = pinsToCombinedMarkdown([activeA.id, activeB.id]);
		const done = () => {
			setCopiedAll(true);
			window.setTimeout(() => setCopiedAll(false), 2000);
		};
		if (navigator.clipboard?.writeText) {
			navigator.clipboard.writeText(text).then(done).catch(done);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<Heading as="h1" variant="title">
					Compare
				</Heading>
				<div className="flex flex-wrap gap-2">
					<Button size="sm" variant="outline" onPress={copyCombined}>
						{copiedAll ? "Copied!" : "Copy A+B for agent"}
					</Button>
					{annotateAll ? (
						<Link
							to="/compare"
							search={{
								group: activeGroup.id,
								a: search.a,
								b: search.b,
								w: widthParam,
							}}
						>
							Done annotating
						</Link>
					) : (
						<Link
							to="/compare"
							search={{
								group: activeGroup.id,
								a: search.a,
								b: search.b,
								w: widthParam,
								annotate: "1",
							}}
						>
							Annotate all
						</Link>
					)}
				</div>
			</div>

			<fieldset className="space-y-1 border-0 p-0">
				<legend className="sr-only">Groups</legend>
				<Text variant="body-sm" className="font-semibold">
					Groups
				</Text>
				<div className="flex flex-wrap items-center gap-1">
					{designGroups.map((group) => {
						return (
							<Link
								key={group.id}
								to="/compare"
								search={{
									group: group.id,
									w: widthParam,
									annotate: search.annotate,
								}}
								variant={group.id === activeGroup.id ? "outline" : "ghost"}
								size="sm"
								aria-current={group.id === activeGroup.id ? "true" : undefined}
							>
								{group.title}
							</Link>
						);
					})}
				</div>
			</fieldset>

			{!activeA || !activeB ? (
				<Card>
					<CardHeader>
						<CardTitle>Nothing to compare yet</CardTitle>
						<Text variant="body-sm">
							Add another variant to the “{activeGroup.title}” group to unlock side-by-side compare.
						</Text>
					</CardHeader>
				</Card>
			) : (
				<>
					<div className="grid items-start gap-4 xl:grid-cols-2">
						<fieldset className="space-y-1 border-0 p-0">
							<legend className="sr-only">Variant A</legend>
							<Text variant="body-sm" className="font-semibold">
								A
							</Text>
							<ul className="list-disc space-y-1 pl-5">
								{variants.map((variant) => {
									return (
										<li key={variant.id}>
											<Link
												to="/compare"
												search={{
													group: activeGroup.id,
													a: variant.id,
													b: activeB.id,
													w: widthParam,
													annotate: search.annotate,
												}}
												variant={variant.id === activeA.id ? "outline" : "ghost"}
												size="sm"
												aria-current={variant.id === activeA.id ? "true" : undefined}
											>
												{variant.title}
											</Link>
										</li>
									);
								})}
							</ul>
						</fieldset>
						<fieldset className="space-y-1 border-0 p-0">
							<legend className="sr-only">Variant B</legend>
							<Text variant="body-sm" className="font-semibold">
								B
							</Text>
							<ul className="list-disc space-y-1 pl-5">
								{variants.map((variant) => {
									return (
										<li key={variant.id}>
											<Link
												to="/compare"
												search={{
													group: activeGroup.id,
													a: activeA.id,
													b: variant.id,
													w: widthParam,
													annotate: search.annotate,
												}}
												variant={variant.id === activeB.id ? "outline" : "ghost"}
												size="sm"
												aria-current={variant.id === activeB.id ? "true" : undefined}
											>
												{variant.title}
											</Link>
										</li>
									);
								})}
							</ul>
						</fieldset>
					</div>
					<fieldset className="space-y-1 border-0 p-0">
						<legend className="sr-only">Preview width</legend>
						<Text variant="body-sm" className="font-semibold">
							Width
						</Text>
						<div className="flex flex-wrap items-center gap-1">
							{WIDTHS.map((preset) => {
								return (
									<Link
										key={preset.id}
										to="/compare"
										search={{
											group: activeGroup.id,
											a: activeA.id,
											b: activeB.id,
											w: preset.id === "full" ? undefined : preset.id,
											annotate: search.annotate,
										}}
										variant={preset.id === width ? "outline" : "ghost"}
										size="sm"
										aria-current={preset.id === width ? "true" : undefined}
									>
										{preset.label}
									</Link>
								);
							})}
						</div>
					</fieldset>

					<div
						className={cn(
							"grid items-start gap-4 xl:grid-cols-2",
							width === "390" && "mx-auto max-w-[390px]",
							width === "768" && "mx-auto max-w-[768px]",
						)}
					>
						{[
							{ slot: "A", entry: activeA },
							{ slot: "B", entry: activeB },
						].map(({ slot, entry }) => {
							const Variant = entry.component;
							return (
								<Card key={slot}>
									<CardHeader>
										<div className="flex flex-wrap items-center justify-between gap-2">
											<div className="flex items-center gap-2">
												<Badge variant="secondary">{slot}</Badge>
												<Badge variant="outline">{entry.kind}</Badge>
												<CardTitle>{entry.title}</CardTitle>
											</div>
											<Link
												to="/$variantId"
												params={{ variantId: entry.id }}
												search={annotateAll ? { annotate: "1" } : undefined}
											>
												Open isolated
											</Link>
										</div>
										<Text variant="body-sm">{entry.description}</Text>
									</CardHeader>
									<CardContent>
										<AnnotateScope variantId={entry.id} enabled={annotateAll}>
											{entry.surface === "plain" ? (
												<Variant />
											) : (
												<VariantFrame>
													<Variant />
												</VariantFrame>
											)}
										</AnnotateScope>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
};

export const Route = createFileRoute("/compare")({
	validateSearch: zodValidator(searchSchema),
	component: CompareDesigns,
});
