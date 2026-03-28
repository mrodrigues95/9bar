import {
	Button,
	Card,
	CardFooter,
	CardHeader,
	CardPanel,
	Heading,
	Text,
} from "@9bar/toolkit";
import { PlusIcon } from "@heroicons/react/24/solid";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "../../../components";
import {
	FilterBar,
	FilterBarActions,
	type FilterBarDefinition,
} from "../../../components/filter-bar/filter-bar";
import { Pagination } from "../../../components/pagination/pagination";
import { GRINDER_OPTIONS, MACHINE_OPTIONS } from "../../../utils/data";
import { RecipesList } from "./-recipes-list";

const OPERATORS = {
	/** Matches when the field value equals the selected option. */
	is: { id: "is", label: "is" },
	/** Matches when the field value does not equal the selected option. */
	"is-not": { id: "is-not", label: "is not" },
	/** Matches when the field value equals any one of multiple selected options (OR). */
	"is-any-of": { id: "is-any-of", label: "is any of" },
	/** Matches when the field value does not equal any of the selected options (NOR). */
	"is-none-of": { id: "is-none-of", label: "is none of" },
	/** Matches when the field contains ALL of the selected values (AND). */
	"include-all-of": { id: "include-all-of", label: "include all of" },
	/** Matches when the field contains at least one of the selected values (OR). */
	"include-any-of": { id: "include-any-of", label: "include any of" },
	/** Excludes the item if the field contains ANY of the selected values. */
	"exclude-if-any-of": { id: "exclude-if-any-of", label: "exclude if any of" },
	/** Excludes the item only if the field contains ALL of the selected values. */
	"exclude-if-all": { id: "exclude-if-all", label: "exclude if all" },
} as const;

const ATTRIBUTE_OPERATOR_PAIRS = [
	{ singular: "is", plural: "is-any-of" },
	{ singular: "is-not", plural: "is-none-of" },
] as const;

export const SET_OPERATOR_PAIRS = [
	{ singular: "include-all-of", plural: "include-any-of" },
	{ singular: "exclude-if-all", plural: "exclude-if-any-of" },
] as const;

const ATTRIBUTE_OPERATORS = [
	OPERATORS.is,
	OPERATORS["is-not"],
	OPERATORS["is-any-of"],
	OPERATORS["is-none-of"],
];

const FILTER_DEFINITIONS = [
	{
		id: "machine",
		label: "Machine",
		pluralLabel: "machines",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: MACHINE_OPTIONS.map((o) => ({ id: o.id, label: o.name })),
	},
	{
		id: "grinder",
		label: "Grinder",
		pluralLabel: "grinders",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: GRINDER_OPTIONS.map((o) => ({ id: o.id, label: o.name })),
	},
	{
		id: "recipe-type",
		label: "Type",
		pluralLabel: "types",
		operators: ATTRIBUTE_OPERATORS,
		defaultOperatorId: OPERATORS.is.id,
		operatorPairs: ATTRIBUTE_OPERATOR_PAIRS,
		options: [
			{ id: "quick-brew", label: "Quick Brew" },
			{ id: "recipe", label: "Recipe" },
		],
	},
] as const satisfies ReadonlyArray<FilterBarDefinition>;

const Recipe = () => {
	return (
		<div className="space-y-4">
			<Heading as="h1" variant="title">
				Recipes
			</Heading>
			<Card render={<section />}>
				<CardHeader className="border-b border-b-border pb-6">
					<div className="flex flex-row items-center justify-between">
						<div className="flex flex-col gap-0.5">
							<Heading as="h2" variant="section">
								Your private recipes
							</Heading>
							<Text variant="body-sm">
								Create, edit, and track your favorite brewing methods.
							</Text>
						</div>
						<Link variant="solid" to="/recipes/new">
							<PlusIcon />
							Create Recipe
						</Link>
					</div>
					<div className="rounded-md bg-slate-50 px-2.5 py-2">
						<FilterBar
							definitions={FILTER_DEFINITIONS}
							aria-label="Recipe filters"
						>
							{(state) =>
								!!state.filters.length && (
									<FilterBarActions>
										<Button variant="ghost" size="xs" onPress={state.clearAll}>
											Clear
										</Button>
										<Button variant="outline" size="xs">
											Save
										</Button>
									</FilterBarActions>
								)
							}
						</FilterBar>
					</div>
				</CardHeader>
				<CardPanel>
					<RecipesList />
				</CardPanel>
				<CardFooter className="flex flex-row items-center justify-between border-t border-t-border pt-6">
					<Pagination />
				</CardFooter>
			</Card>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/recipes")({
	staticData: { breadcrumb: { label: "Recipes" } },
	component: Recipe,
});
