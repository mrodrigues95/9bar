import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Key } from "react-aria-components";
import { Button } from "../button/button";
import {
	DropdownMenu,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = {
	component: DropdownMenu,
	title: "DropdownMenu",
	parameters: {
		controls: { include: [] },
		docs: {
			controls: { include: [] },
			argTypes: { include: [] },
		},
	},
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A basic dropdown menu with grouped items and icon adornments. */
export const Basic: Story = {
	render: (props) => (
		<DropdownMenuTrigger>
			<Button variant="outline" size="sm">
				Actions
			</Button>
			<DropdownMenu {...props}>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem onAction={() => {}}>Profile</DropdownMenuItem>
					<DropdownMenuItem onAction={() => {}}>Settings</DropdownMenuItem>
					<DropdownMenuItem onAction={() => {}}>Billing</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onAction={() => {}}>
					<Pencil />
					Edit recipe
				</DropdownMenuItem>
				<DropdownMenuItem variant="destructive" onAction={() => {}}>
					<Trash2 />
					Delete recipe
				</DropdownMenuItem>
			</DropdownMenu>
		</DropdownMenuTrigger>
	),
};

/** A menu item with an aligned keyboard shortcut hint. */
export const WithShortcut: Story = {
	render: (props) => (
		<DropdownMenuTrigger>
			<Button variant="outline" size="sm">
				Edit
			</Button>
			<DropdownMenu {...props}>
				<DropdownMenuItem onAction={() => {}}>
					Undo
					<DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem onAction={() => {}}>
					Redo
					<DropdownMenuShortcut>⇧⌘Z</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive" onAction={() => {}}>
					Delete
					<DropdownMenuShortcut>⌫</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenu>
		</DropdownMenuTrigger>
	),
};

/** A menu with a nested submenu for secondary actions. */
export const WithSubmenu: Story = {
	render: (props) => (
		<DropdownMenuTrigger>
			<Button variant="outline" size="sm">
				Manage
			</Button>
			<DropdownMenu {...props}>
				<DropdownMenuGroup>
					<DropdownMenuItem onAction={() => {}}>Duplicate</DropdownMenuItem>
					<DropdownMenuItem onAction={() => {}}>Archive</DropdownMenuItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem onAction={() => {}}>
								Export as JSON
							</DropdownMenuItem>
							<DropdownMenuItem onAction={() => {}}>
								Export as CSV
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem variant="destructive" onAction={() => {}}>
								Delete permanently
							</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuGroup>
			</DropdownMenu>
		</DropdownMenuTrigger>
	),
};

/** A single-select menu where the current selection is indicated with a checkmark. */
export const SingleSelection: Story = {
	render: (props) => {
		const [selected, setSelected] = useState<Set<Key>>(new Set(["espresso"]));

		return (
			<DropdownMenuTrigger>
				<Button variant="outline" size="sm">
					Brew method
				</Button>
				<DropdownMenu
					{...props}
					selectionMode="single"
					selectedKeys={selected}
					onSelectionChange={(keys) => {
						if (keys !== "all") {
							setSelected(keys);
						}
					}}
				>
					<DropdownMenuLabel>Brew method</DropdownMenuLabel>
					<DropdownMenuItem id="espresso">Espresso</DropdownMenuItem>
					<DropdownMenuItem id="pour-over">Pour Over</DropdownMenuItem>
					<DropdownMenuItem id="french-press">French Press</DropdownMenuItem>
				</DropdownMenu>
			</DropdownMenuTrigger>
		);
	},
};

/** A multi-select menu with independent toggleable items. */
export const MultipleSelection: Story = {
	render: (props) => {
		const [selected, setSelected] = useState<Set<Key>>(
			new Set(["espresso", "pour-over"]),
		);

		return (
			<DropdownMenuTrigger>
				<Button variant="outline" size="sm">
					Brew methods
				</Button>
				<DropdownMenu
					{...props}
					selectionMode="multiple"
					selectedKeys={selected}
					onSelectionChange={(keys) => {
						if (keys !== "all") {
							setSelected(keys);
						}
					}}
				>
					<DropdownMenuLabel>Brew methods</DropdownMenuLabel>
					<DropdownMenuItem id="espresso">Espresso</DropdownMenuItem>
					<DropdownMenuItem id="pour-over">Pour Over</DropdownMenuItem>
					<DropdownMenuItem id="french-press">French Press</DropdownMenuItem>
				</DropdownMenu>
			</DropdownMenuTrigger>
		);
	},
};
