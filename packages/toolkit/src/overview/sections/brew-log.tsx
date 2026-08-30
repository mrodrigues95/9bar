import { Bean, PackageOpen } from "lucide-react";
import { useState } from "react";
import {
	Avatar,
	AvatarFallback,
	Badge,
	Button,
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	generatePagination,
	Link,
	Pagination,
	PaginationButton,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
	Separator,
	Text,
} from "../../components";

/** One row of the recent-shots list. */
const logEntries = [
	{
		id: "1",
		title: "Morning shot",
		brewer: "MB",
		time: "Today, 08:12",
		ratio: "1:2",
		shotTime: "28 s",
		result: "Dialed in",
		resultVariant: "default" as const,
	},
	{
		id: "2",
		title: "Pre-workout double",
		brewer: "JT",
		time: "Yesterday, 17:45",
		ratio: "1:1.5",
		shotTime: "22 s",
		result: "Under-extracted",
		resultVariant: "secondary" as const,
	},
	{
		id: "3",
		title: "Weekend experiment",
		brewer: "AS",
		time: "Sunday, 10:03",
		ratio: "1:2.5",
		shotTime: "34 s",
		result: "Sour",
		resultVariant: "destructive" as const,
	},
];

/** The brew log: recent shots list with result badges, pagination, and an empty-state card. */
export const BrewLogSection = () => {
	const [page, setPage] = useState(2);
	const totalPages = 12;

	const pages = generatePagination({
		currentPage: page,
		totalPages,
		siblingCount: 1,
		boundaryCount: 1,
	});

	return (
		<div className="grid gap-4 lg:grid-cols-3">
			<Card className="lg:col-span-2">
				<CardHeader>
					<CardTitle>Recent shots</CardTitle>
					<CardDescription>Logged brews across all recipes</CardDescription>
					<CardAction>
						<Link href="#" size="sm">
							View all
						</Link>
					</CardAction>
				</CardHeader>
				<CardContent>
					{logEntries.map((entry, index) => (
						<div key={entry.id}>
							{index > 0 ? <Separator /> : null}
							<div className="flex items-center justify-between gap-4 py-3">
								<div className="flex items-center gap-3">
									<Avatar size="sm">
										<AvatarFallback>{entry.brewer}</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<Text variant="body-sm" color="secondary">
											{entry.title}
										</Text>
										<Text variant="detail">{entry.time}</Text>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Badge variant="outline">{entry.ratio}</Badge>
									<Badge variant="secondary">{entry.shotTime}</Badge>
									<Badge variant={entry.resultVariant}>{entry.result}</Badge>
								</div>
							</div>
						</div>
					))}
				</CardContent>
				<CardFooter>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									onPress={() => setPage(Math.max(1, page - 1))}
									isDisabled={page === 1}
								/>
							</PaginationItem>
							{pages.map((item) =>
								item === "ellipsis" ? (
									<PaginationItem key={`ellipsis-${item}`}>
										<PaginationEllipsis />
									</PaginationItem>
								) : (
									<PaginationItem key={item}>
										<PaginationButton
											isActive={page === item}
											onPress={() => setPage(item)}
											aria-label={`Go to page ${item}`}
										>
											{item}
										</PaginationButton>
									</PaginationItem>
								),
							)}
							<PaginationItem>
								<PaginationNext
									onPress={() => setPage(Math.min(totalPages, page + 1))}
									isDisabled={page === totalPages}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</CardFooter>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Bean inventory</CardTitle>
					<CardDescription>Track what is in the hopper</CardDescription>
				</CardHeader>
				<CardContent>
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<PackageOpen />
							</EmptyMedia>
							<EmptyTitle>No beans tracked</EmptyTitle>
							<EmptyDescription>
								Add a bag of beans to keep an eye on stock and roast dates.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button size="sm">
								<Bean />
								Add beans
							</Button>
						</EmptyContent>
					</Empty>
				</CardContent>
			</Card>
		</div>
	);
};
