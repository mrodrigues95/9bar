import { Button, Card, Heading, Text } from "@9bar/toolkit";
import { PlusIcon } from "@heroicons/react/24/solid";
import { createFileRoute } from "@tanstack/react-router";
import { Pagination } from "../../../components/pagination/pagination";
import { RecipeList } from "./-recipe-list";

const Recipe = () => {
	return (
		<div className="space-y-4">
			<Heading as="h1" variant="title">
				Recipes
			</Heading>
			<Card className="gap-2.5 py-4">
				<Card.Header className="flex flex-row items-center justify-between px-4">
					<div className="flex flex-col gap-0.5">
						<Heading as="h2" variant="section">
							Your private recipes
						</Heading>
						<Text variant="body-sm">
							Create, edit, and track your favorite brewing methods.
						</Text>
					</div>
					<div className="flex gap-2">
						<Button variant="ghost">Quick Log</Button>
						<Button>
							<PlusIcon className="size-4" />
							Create Recipe
						</Button>
					</div>
				</Card.Header>
				<Card.Panel className="px-4">
					<RecipeList />
				</Card.Panel>
				<Card.Footer className="flex flex-row items-center justify-between border-t border-t-slate-950/10 px-4 pt-4">
					<Pagination />
				</Card.Footer>
			</Card>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/recipes")({
	component: Recipe,
});
