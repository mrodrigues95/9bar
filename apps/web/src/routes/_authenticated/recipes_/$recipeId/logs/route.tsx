import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Heading,
	IconButton,
	Text,
} from "@9bar/toolkit/components";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import {
	EllipsisVertical,
	Fingerprint,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react";
import { Link, List, ListItem, Pagination } from "../../../../../components";
import { GRINDER_OPTIONS, MACHINE_OPTIONS } from "../../../../../utils/data";

export const RecipeLogs = () => {
	const { recipe } = useLoaderData({
		from: "/_authenticated/recipes_/$recipeId",
	});

	const machine = MACHINE_OPTIONS.find((m) => m.id === recipe.snapshot.machine);
	const grinder = GRINDER_OPTIONS.find((g) => g.id === recipe.snapshot.grinder);
	if (!machine || !grinder) {
		throw new Error(`Machine or grinder not found for recipe ${recipe.name}`);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between gap-4">
				<Heading variant="section" as="p">
					Logs
				</Heading>
				<Link
					to="/recipes/$recipeId/logs/new"
					params={{ recipeId: String(recipe.id) }}
					variant="default"
				>
					<Plus />
					New Log
				</Link>
			</CardHeader>
			<CardContent className="gap-4">
				<List>
					<ListItem className="justify-between">
						<div className="flex flex-col">
							<Text
								variant="body-sm"
								className="flex items-center gap-1 text-blue-950"
							>
								<Fingerprint className="size-4" />
								{machine.name} · {grinder.name}
							</Text>
							<Text variant="body-sm" className="font-medium" color="primary">
								{recipe.name ?? "(Untitled)"}
							</Text>
							<Text variant="body-sm" className="text-xs">
								{recipe.snapshot.beans}
							</Text>
							<Text variant="body-sm" className="text-xs">
								{recipe.snapshot.dose}g → {recipe.snapshot.yield}g ·{" "}
								{recipe.snapshot.brewTime}
								{recipe.snapshot.brewTimeUnit}
							</Text>
						</div>
						<div className="flex items-center gap-0.5">
							<DropdownMenuTrigger>
								<IconButton aria-label="Actions" size="sm" variant="ghost">
									<EllipsisVertical />
								</IconButton>
								<DropdownMenu>
									<DropdownMenuItem onAction={() => alert("rename")}>
										<Pencil className="size-3" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onAction={() => alert("delete")}
										variant="destructive"
									>
										<Trash2 className="size-3" />
										Delete
									</DropdownMenuItem>
								</DropdownMenu>
							</DropdownMenuTrigger>
						</div>
					</ListItem>
				</List>
			</CardContent>
			<CardFooter className="flex flex-row items-center justify-between border-t border-t-border pt-6">
				<Pagination />
			</CardFooter>
		</Card>
	);
};

export const Route = createFileRoute("/_authenticated/recipes_/$recipeId/logs")(
	{
		component: RecipeLogs,
	},
);
