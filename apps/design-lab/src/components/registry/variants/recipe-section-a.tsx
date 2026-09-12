import { ArrowRight } from "lucide-react";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	Heading,
	Text,
} from "@9bar/toolkit/components";

const SAMPLE_RECIPES = [
	{
		name: "Ethiopia Guji",
		beans: "Washed · light roast",
		params: "18g → 36g · 28s",
		tag: "Dialed in",
	},
	{
		name: "Colombia Huila",
		beans: "Honey · medium roast",
		params: "17g → 34g · 30s",
		tag: "Testing",
	},
	{
		name: "House Espresso",
		beans: "Natural blend · medium-dark",
		params: "18.5g → 37g · 27s",
		tag: "Dialed in",
	},
];

export const RecipeSectionA = () => {
	return (
		<section aria-labelledby="recipe-section-a-title" className="mx-auto max-w-5xl">
			<div className="flex flex-wrap items-end justify-between gap-2">
				<div>
					<Heading as="h2" variant="section" id="recipe-section-a-title">
						Recent recipes
					</Heading>
					<Text variant="body-sm">Pick up where you left off yesterday.</Text>
				</div>
				<Button variant="link" size="sm">
					View all
					<ArrowRight />
				</Button>
			</div>
			<ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{SAMPLE_RECIPES.map((recipe) => {
					return (
						<li key={recipe.name}>
							<Card size="sm" className="h-full">
								<CardHeader>
									<Badge variant="outline">{recipe.tag}</Badge>
									<CardTitle>{recipe.name}</CardTitle>
									<Text variant="body-sm">{recipe.beans}</Text>
								</CardHeader>
								<CardContent>
									<Text variant="body-sm" className="font-mono">
										{recipe.params}
									</Text>
								</CardContent>
								<CardFooter>
									<Button variant="ghost" size="sm">
										Open
										<ArrowRight />
									</Button>
								</CardFooter>
							</Card>
						</li>
					);
				})}
			</ul>
		</section>
	);
};
