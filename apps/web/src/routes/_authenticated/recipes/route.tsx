import {
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
import { Pagination } from "../../../components/pagination/pagination";
import { RecipesList } from "./-recipes-list";

const Recipe = () => {
	return (
		<div className="space-y-4">
			<Heading as="h1" variant="title">
				Recipes
			</Heading>
			<Card render={<section />}>
				<CardHeader className="flex flex-row items-center justify-between">
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
