import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useState, type ReactNode } from "react";
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
import { AnnotateScope } from "../../components/annotate-scope";
import { Link } from "../../components/link";
import { designGroups } from "../../components/registry/registry";
import { VariantCanvas } from "../../components/variant-canvas";
import { pinsToMarkdown, readStoredPins } from "../../utils/annotate";

const searchSchema = z.object({
	group: z.string().optional(),
	a: z.string().optional(),
	b: z.string().optional(),
	w: z.enum(["full", "tablet", "mobile"]).catch("full").optional(),
	annotate: z.boolean().optional(),
});

const WIDTHS = [
	{ id: "full", label: "Full", className: undefined },
	{ id: "tablet", label: "Tablet 768", className: "mx-auto max-w-[768px]" },
	{ id: "mobile", label: "Mobile 390", className: "mx-auto max-w-[390px]" },
] as const;

const SLOTS = ["A", "B"] as const;

const PickerGroup = ({ label, children }: { label: string; children: ReactNode }) => {
	return (
		<fieldset className="space-y-1 border-0 p-0">
			<Text as="legend" variant="body-sm" className="font-semibold">
				{label}
			</Text>
			<div className="flex flex-wrap items-center gap-1">{children}</div>
		</fieldset>
	);
};

const pickerLinkProps = (active: boolean) => {
	return {
		variant: active ? "outline" : "ghost",
		size: "sm",
		"aria-current": active ? "true" : undefined,
	} as const;
};

const CompareDesigns = () => {
	const search = Route.useSearch();
	const annotateAll = !!search.annotate;
	const width = WIDTHS.find((preset) => preset.id === search.w) ?? WIDTHS[0];
	const widthParam = width.id === "full" ? undefined : width.id;
	const [copiedAll, setCopiedAll] = useState(false);

	const activeGroup = designGroups.find((group) => group.id === search.group) ?? designGroups[0];
	if (!activeGroup) {
		return (
			<div className="space-y-2">
				<Heading as="h1" variant="title">
					Compare
				</Heading>
				<Text variant="body-lg">
					No groups yet. Register one in src/components/registry/registry.ts.
				</Text>
			</div>
		);
	}

	const { variants } = activeGroup;
	const activeA = variants.find((variant) => variant.id === search.a) ?? variants[0];
	const activeB = variants.find((variant) => variant.id === search.b) ?? variants[1];

	const copyCombined = () => {
		if (!activeA || !activeB) {
			return;
		}
		const ids = [activeA.id, activeB.id];
		const text = ids
			.map((id) => {
				return pinsToMarkdown(id, readStoredPins(id));
			})
			.join("\n\n---\n\n");
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
					<Link
						to="/compare"
						search={{
							group: activeGroup.id,
							a: search.a,
							b: search.b,
							w: widthParam,
							annotate: annotateAll ? undefined : true,
						}}
					>
						{annotateAll ? "Done annotating" : "Annotate all"}
					</Link>
				</div>
			</div>

			<PickerGroup label="Groups">
				{designGroups.map((group) => {
					return (
						<Link
							{...pickerLinkProps(group.id === activeGroup.id)}
							key={group.id}
							to="/compare"
							search={{ group: group.id, w: widthParam, annotate: search.annotate }}
						>
							{group.title}
						</Link>
					);
				})}
			</PickerGroup>

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
						{SLOTS.map((slot) => {
							const active = slot === "A" ? activeA : activeB;
							return (
								<PickerGroup key={slot} label={slot}>
									{variants.map((variant) => {
										return (
											<Link
												{...pickerLinkProps(variant.id === active.id)}
												key={variant.id}
												to="/compare"
												search={{
													group: activeGroup.id,
													a: slot === "A" ? variant.id : activeA.id,
													b: slot === "B" ? variant.id : activeB.id,
													w: widthParam,
													annotate: search.annotate,
												}}
											>
												{variant.title}
											</Link>
										);
									})}
								</PickerGroup>
							);
						})}
					</div>

					<PickerGroup label="Width">
						{WIDTHS.map((preset) => {
							return (
								<Link
									{...pickerLinkProps(preset.id === width.id)}
									key={preset.id}
									to="/compare"
									search={{
										group: activeGroup.id,
										a: activeA.id,
										b: activeB.id,
										w: preset.id === "full" ? undefined : preset.id,
										annotate: search.annotate,
									}}
								>
									{preset.label}
								</Link>
							);
						})}
					</PickerGroup>

					<div className={cn("grid items-start gap-4 xl:grid-cols-2", width.className)}>
						{SLOTS.map((slot) => {
							const entry = slot === "A" ? activeA : activeB;
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
												search={annotateAll ? { annotate: true } : undefined}
											>
												Open isolated
											</Link>
										</div>
										<Text variant="body-sm">{entry.description}</Text>
									</CardHeader>
									<CardContent>
										<AnnotateScope variantId={entry.id} enabled={annotateAll}>
											<VariantCanvas entry={entry} />
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
