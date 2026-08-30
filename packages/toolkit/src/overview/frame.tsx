import { Coffee, Search } from "lucide-react";
import type { ReactNode } from "react";
import {
	Avatar,
	AvatarFallback,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	Button,
	IconButton,
	Menu,
	MenuGroup,
	MenuItem,
	MenuLabel,
	MenuTrigger,
} from "../components";

/** Properties for the {@link Section} component. */
export interface SectionProps {
	/** Short title rendered above the section content. */
	title: string;
	/** Optional one-line description rendered under the title. */
	description?: string;
	/** The section content. */
	children: ReactNode;
}

/** A labeled block of the overview canvas, grouping related component demos. */
export const Section = ({ title, description, children }: SectionProps) => (
	<section className="flex flex-col gap-4 py-10">
		<div className="flex flex-col gap-1">
			<h2 className="font-semibold text-sm tracking-tight">{title}</h2>
			{description ? (
				<p className="text-muted-foreground text-sm">{description}</p>
			) : null}
		</div>
		{children}
	</section>
);

/** The mock application chrome at the top of the overview canvas: brand, navigation breadcrumb, and account actions. */
const AppHeader = () => (
	<header className="flex flex-col gap-4 pb-10">
		<div className="flex items-center justify-between gap-4">
			<div className="flex items-center gap-2">
				<Coffee className="size-5" aria-hidden />
				<span className="font-semibold text-sm tracking-tight">9bar</span>
			</div>
			<div className="flex items-center gap-1">
				<IconButton aria-label="Search" variant="ghost">
					<Search />
				</IconButton>
				<MenuTrigger>
					<Button variant="ghost" size="sm" className="gap-2 px-2">
						<Avatar size="sm">
							<AvatarFallback>MB</AvatarFallback>
						</Avatar>
						marcus
					</Button>
					<Menu>
						<MenuLabel>Account</MenuLabel>
						<MenuGroup>
							<MenuItem onAction={() => {}}>Profile</MenuItem>
							<MenuItem onAction={() => {}}>Brewer settings</MenuItem>
							<MenuItem onAction={() => {}}>Equipment</MenuItem>
						</MenuGroup>
						<MenuItem variant="destructive" onAction={() => {}}>
							Sign out
						</MenuItem>
					</Menu>
				</MenuTrigger>
			</div>
		</div>
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Recipes</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Espresso</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbPage>Honey Blend</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	</header>
);

/** Properties for the {@link AppFrame} component. */
export interface AppFrameProps {
	/** The canvas sections rendered under the application header. */
	children: ReactNode;
}

/**
 * The fixed-width application frame that hosts every overview section.
 *
 * Constrains the canvas to `max-w-5xl` and centers it so the page reads like
 * an application screenshot, keeping snapshots deterministic. Sections are
 * separated by `divide-y` borders.
 */
export const AppFrame = ({ children }: AppFrameProps) => (
	<div className="mx-auto w-full max-w-5xl divide-y divide-border px-6 py-10">
		<AppHeader />
		{children}
	</div>
);
