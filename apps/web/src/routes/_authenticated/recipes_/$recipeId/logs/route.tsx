import {
	Card,
	CardFooter,
	CardHeader,
	CardPanel,
	Heading,
	IconButton,
	Menu,
	MenuItem,
	MenuSeparator,
	MenuTrigger,
	Text,
} from "@9bar/toolkit";
import {
	EllipsisVerticalIcon,
	FingerPrintIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Link, List, ListItem, Pagination } from "../../../../../components";
import { grinderOptions, machineOptions } from "../../../../../utils/data";

export const RecipeLogs = () => {
	const { recipe } = useLoaderData({
		from: "/_authenticated/recipes_/$recipeId",
	});

	const machine = machineOptions.find((m) => m.id === recipe.machine);
	const grinder = grinderOptions.find((g) => g.id === recipe.grinder);
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
					params={{ recipeId: recipe.id }}
					variant="solid"
				>
					<PlusIcon />
					New Log
				</Link>
			</CardHeader>
			<CardPanel className="gap-4">
				<List>
					<ListItem className="justify-between">
						<div className="flex flex-col">
							<Text
								variant="body-sm"
								className="flex items-center gap-1 text-blue-950"
							>
								<FingerPrintIcon className="size-4" />
								{machine.name} · {grinder.name}
							</Text>
							<Text variant="body-sm" className="font-medium" color="primary">
								{recipe.name}
							</Text>
							<Text variant="body-sm" className="text-xs">
								{recipe.beans}
							</Text>
							<Text variant="body-sm" className="text-xs">
								{recipe.dose} → {recipe.yield} · {recipe.brewTime}
							</Text>
						</div>
						<div className="flex items-center gap-0.5">
							<MenuTrigger>
								<IconButton aria-label="Actions" size="sm" variant="ghost">
									<EllipsisVerticalIcon />
								</IconButton>
								<Menu>
									<MenuItem onAction={() => alert("rename")}>
										<PencilIcon className="size-3" />
										Edit
									</MenuItem>
									<MenuSeparator />
									<MenuItem onAction={() => alert("delete")} variant="danger">
										<TrashIcon className="size-3" />
										Delete
									</MenuItem>
								</Menu>
							</MenuTrigger>
						</div>
					</ListItem>
				</List>
			</CardPanel>
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
