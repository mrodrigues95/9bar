import { ChartLine, Cog, List } from "lucide-react";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	Link,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../components";

/** Navigation patterns: recipe tabs, a collapsed breadcrumb, and link treatments. */
export const NavigationSection = () => (
	<div className="flex flex-col gap-6">
		<Tabs defaultSelectedKey="overview">
			<TabsList>
				<TabsTrigger id="overview">
					<ChartLine />
					Overview
				</TabsTrigger>
				<TabsTrigger id="shots">
					<List />
					Shots
				</TabsTrigger>
				<TabsTrigger id="settings">
					<Cog />
					Settings
				</TabsTrigger>
			</TabsList>
			<TabsContent id="overview">
				Brew ratio, dose, and target extraction for this recipe.
			</TabsContent>
			<TabsContent id="shots">
				Every logged shot with notes and ratings, newest first.
			</TabsContent>
			<TabsContent id="settings">
				Grinder, machine, and reminder preferences for this recipe.
			</TabsContent>
		</Tabs>
		<div className="flex flex-wrap items-center justify-between gap-4">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#">Recipes</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbEllipsis />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbLink href="#">Espresso</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbPage>Honey Blend</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="flex flex-wrap items-center gap-4">
				<Link href="#">Bean origin</Link>
				<Link href="#" variant="secondary" size="sm">
					Brewing guide
				</Link>
				<Link href="#" variant="outline" size="sm">
					Import recipe
				</Link>
			</div>
		</div>
	</div>
);
