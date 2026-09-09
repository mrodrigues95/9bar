import { ArrowRight, NotebookPen, Search, Star } from "lucide-react";
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

/**
 * Split hero direction: copy on the left, featured recipe card on the right.
 * Shows product flavor up front instead of a bare headline.
 */
export const HomeHeroB = () => {
	return (
		<section
			aria-labelledby="hero-b-title"
			className="mx-auto grid max-w-5xl items-center gap-8 py-12 lg:grid-cols-2"
		>
			<div>
				<Badge variant="secondary">
					<Star />
					Staff pick: Ethiopia Guji
				</Badge>
				<Heading as="h1" variant="title" id="hero-b-title" className="mt-4 text-balance">
					Your best shot is already in your notes
				</Heading>
				<Text variant="body-lg" className="mt-3 text-pretty">
					9bar ties every shot back to its recipe — dose, yield, time, beans — so you never lose a
					great dial-in again.
				</Text>
				<div className="mt-6 flex flex-wrap gap-2">
					<Button size="lg">
						<Search />
						Browse recipes
					</Button>
					<Button size="lg" variant="outline">
						<NotebookPen />
						Log a shot
					</Button>
				</div>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Today&apos;s dial-in</CardTitle>
					<Text variant="body-sm">Ethiopia Guji · washed · light roast</Text>
				</CardHeader>
				<CardContent>
					<dl className="grid grid-cols-3 gap-3 text-center">
						<div className="rounded-md bg-muted px-2 py-3">
							<dt className="text-xs text-muted-foreground">Dose</dt>
							<dd className="font-heading text-lg font-semibold">18g</dd>
						</div>
						<div className="rounded-md bg-muted px-2 py-3">
							<dt className="text-xs text-muted-foreground">Yield</dt>
							<dd className="font-heading text-lg font-semibold">36g</dd>
						</div>
						<div className="rounded-md bg-muted px-2 py-3">
							<dt className="text-xs text-muted-foreground">Time</dt>
							<dd className="font-heading text-lg font-semibold">28s</dd>
						</div>
					</dl>
				</CardContent>
				<CardFooter>
					<Button variant="ghost" size="sm">
						Open recipe
						<ArrowRight />
					</Button>
				</CardFooter>
			</Card>
		</section>
	);
};
