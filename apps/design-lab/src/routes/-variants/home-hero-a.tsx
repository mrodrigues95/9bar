import { Coffee, NotebookPen, Search } from "lucide-react";
import { Badge, Button, Heading, Text } from "@9bar/toolkit/components";

/**
 * Centered hero direction: headline, dual call-to-action, stat strip.
 * Classic, low-risk landing for the home page.
 */
export const HomeHeroA = () => {
	return (
		<section aria-labelledby="hero-a-title" className="mx-auto max-w-2xl py-12 text-center">
			<Badge variant="outline">
				<Coffee />
				Espresso recipe lab
			</Badge>
			<Heading as="h1" variant="title" id="hero-a-title" className="mt-4 text-balance">
				Dial in your espresso, one shot at a time
			</Heading>
			<Text variant="body-lg" className="mt-3 text-pretty">
				Save recipes, log shots, and see exactly what changed when a shot finally sings.
			</Text>
			<div className="mt-6 flex flex-wrap items-center justify-center gap-2">
				<Button size="lg">
					<Search />
					Browse recipes
				</Button>
				<Button size="lg" variant="outline">
					<NotebookPen />
					Log a shot
				</Button>
			</div>
			<dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6">
				<div>
					<dt className="text-xs text-muted-foreground">Recipes</dt>
					<dd className="font-heading text-xl font-semibold">129</dd>
				</div>
				<div>
					<dt className="text-xs text-muted-foreground">Shots logged</dt>
					<dd className="font-heading text-xl font-semibold">1.5K</dd>
				</div>
				<div>
					<dt className="text-xs text-muted-foreground">Dialed in</dt>
					<dd className="font-heading text-xl font-semibold">86%</dd>
				</div>
			</dl>
		</section>
	);
};
