import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { GitCompareArrows } from "lucide-react";
import { z } from "zod";
import { EmptyState } from "../../components/empty-state";
import { Link } from "../../components/link";
import { PageHeader } from "../../components/page-header";
import { Picker } from "../../components/picker";
import { designGroups, type DesignGroup } from "../../components/registry/registry";
import { CompareActions } from "./-components/compare-actions";
import { CompareBoard } from "./-components/compare-board";
import { ComparePickers, WIDTHS } from "./-components/compare-pickers";
import { PickerLink } from "./-components/picker-link";

const searchSchema = z.object({
	group: z.string().optional(),
	a: z.string().optional(),
	b: z.string().optional(),
	w: z.enum(["full", "tablet", "mobile"]).catch("full").optional(),
	annotate: z.boolean().optional(),
});

type CompareSearch = z.infer<typeof searchSchema>;

const resolveGroup = (id: string | undefined): DesignGroup | undefined => {
	return designGroups.find((group) => group.id === id) ?? designGroups[0];
};

const resolveWidth = (id: CompareSearch["w"]) => {
	return WIDTHS.find((preset) => preset.id === id) ?? WIDTHS[0];
};

const resolvePair = (group: DesignGroup, search: CompareSearch) => {
	const { variants } = group;
	const a = variants.find((variant) => variant.id === search.a) ?? variants[0];
	const b =
		variants.find((variant) => variant.id === search.b && variant.id !== a?.id) ??
		variants.find((variant) => variant.id !== a?.id);
	if (!a || !b) {
		return null;
	}
	return { a, b };
};

const CompareDesigns = () => {
	const search = Route.useSearch();
	const group = resolveGroup(search.group);

	if (!group) {
		return (
			<div className="space-y-6">
				<PageHeader title="Compare" />
				<EmptyState
					title="No groups yet"
					body="Register one in src/components/registry/registry.ts."
				/>
			</div>
		);
	}

	const pair = resolvePair(group, search);
	const width = resolveWidth(search.w);
	const annotate = !!search.annotate;

	return (
		<div className="space-y-6">
			<PageHeader
				title="Compare"
				actions={
					pair ? <CompareActions a={pair.a} b={pair.b} groupId={group.id} search={search} /> : null
				}
			/>

			<Picker label="Groups">
				{designGroups.map((option) => {
					return (
						<PickerLink
							key={option.id}
							active={option.id === group.id}
							search={{ ...search, group: option.id }}
						>
							{option.title}
						</PickerLink>
					);
				})}
			</Picker>

			{pair ? (
				<>
					<ComparePickers
						group={group}
						a={pair.a}
						b={pair.b}
						activeWidthId={width.id}
						search={search}
					/>
					<CompareBoard
						a={pair.a}
						b={pair.b}
						widthClassName={width.className}
						annotate={annotate}
					/>
				</>
			) : (
				<EmptyState
					icon={<GitCompareArrows />}
					title="Nothing to compare yet"
					body={`Add another variant to the “${group.title}” group to unlock side-by-side compare.`}
					action={<Link to="/">Back to the gallery</Link>}
				/>
			)}
		</div>
	);
};

export const Route = createFileRoute("/compare")({
	validateSearch: zodValidator(searchSchema),
	head: () => ({
		meta: [{ title: "Compare — 9bar Design Lab" }],
	}),
	component: CompareDesigns,
});
