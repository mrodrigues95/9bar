import { Button, Card, Heading, Text } from "@9bar/toolkit";
import { PlusIcon } from "@heroicons/react/24/solid";
import { createFileRoute } from "@tanstack/react-router";
import { Pagination } from "../../../components/pagination/pagination";

// TODO: Break this off into smaller components.
// TODO: Implement recipe list item component.
// TODO: Setup mock data.
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
						<Button variant="solidBlue">
							<PlusIcon className="size-4" />
							Create Recipe
						</Button>
					</div>
				</Card.Header>
				<Card.Panel className="px-4">
					<ul className="divide-y divide-slate-950/10">
						<li className="flex items-center justify-between py-1.5">
							<div className="flex flex-col">
								<Text variant="body-sm">
									La Marzocco Linea Mini · Eureka Atom
								</Text>
								<Text variant="body-sm" className="font-medium text-slate-950">
									Slow Bloom
								</Text>
								<Text variant="body-sm">18g → 36g · 22s</Text>
							</div>
							<div>actions here</div>
						</li>
						<li className="flex items-center justify-between py-1.5 last:pb-0">
							<div className="flex flex-col">
								<Text variant="body-sm">
									La Marzocco Linea Mini · Eureka Atom
								</Text>
								<Text variant="body-sm" className="font-medium text-slate-950">
									Slow Bloom
								</Text>
								<Text variant="body-sm">18g → 36g · 22s</Text>
							</div>
							<div>actions here</div>
						</li>
					</ul>
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
