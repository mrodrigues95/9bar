import { Pencil, Play, Share2 } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	Badge,
	Button,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Heading,
	IconButton,
	Link,
	Text,
} from "../../components";

/** The recipe summary hero: title card with quick actions, brew-ratio badges, and stat cards. */
export const HeroSection = () => (
	<div className="flex flex-col gap-4">
		<Card>
			<CardHeader>
				<CardTitle>Honey Blend Espresso</CardTitle>
				<CardDescription>
					Dialed-in house espresso, last brewed this morning
				</CardDescription>
				<CardAction>
					<div className="flex items-center gap-2">
						<IconButton aria-label="Share recipe" variant="ghost">
							<Share2 />
						</IconButton>
						<Button variant="outline" size="sm">
							<Pencil />
							Edit
						</Button>
						<Button size="sm">
							<Play />
							Brew now
						</Button>
					</div>
				</CardAction>
			</CardHeader>
			<CardContent className="flex flex-wrap items-center gap-2">
				<Badge>1:2 ratio</Badge>
				<Badge variant="secondary">18 g dose</Badge>
				<Badge variant="outline">36 g yield</Badge>
				<Badge variant="outline">28 s</Badge>
				<Link href="#" size="sm" className="ml-1">
					Bean origin
				</Link>
			</CardContent>
			<CardFooter className="items-center gap-3">
				<AvatarGroup>
					<Avatar size="sm">
						<AvatarFallback>MB</AvatarFallback>
					</Avatar>
					<Avatar size="sm">
						<AvatarFallback>JT</AvatarFallback>
					</Avatar>
					<Avatar size="sm">
						<AvatarFallback>AS</AvatarFallback>
					</Avatar>
					<AvatarGroupCount>+2</AvatarGroupCount>
				</AvatarGroup>
				<Text variant="detail">5 brewers use this recipe</Text>
			</CardFooter>
		</Card>
		<div className="grid gap-4 sm:grid-cols-3">
			<Card size="sm">
				<CardContent className="flex flex-col gap-1">
					<Heading variant="title">42</Heading>
					<Text variant="detail">Shots this week</Text>
				</CardContent>
			</Card>
			<Card size="sm">
				<CardContent className="flex flex-col gap-1">
					<Heading variant="title">27.5 s</Heading>
					<Text variant="detail">Average shot time</Text>
				</CardContent>
			</Card>
			<Card size="sm">
				<CardContent className="flex flex-col items-start gap-1">
					<div className="flex items-center gap-2">
						<Heading variant="title">250 g</Heading>
						<Badge variant="secondary">Low</Badge>
					</div>
					<Text variant="detail">Beans remaining</Text>
				</CardContent>
			</Card>
		</div>
	</div>
);
