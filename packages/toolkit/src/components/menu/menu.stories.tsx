import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Key } from "react-aria-components";
import { Button } from "../button/button";
import {
	Menu,
	MenuGroup,
	MenuItem,
	MenuLabel,
	MenuSeparator,
	MenuShortcut,
	MenuSub,
	MenuSubContent,
	MenuSubTrigger,
	MenuTrigger,
} from "./menu";

const meta = {
	component: Menu,
	title: "Menu",
	parameters: {
		controls: { include: [] },
		docs: {
			controls: { include: [] },
			argTypes: { include: [] },
		},
	},
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A basic menu with grouped items and icon adornments. */
export const Basic: Story = {
	render: (props) => (
		<MenuTrigger>
			<Button variant="outline" size="sm">
				Actions
			</Button>
			<Menu {...props}>
				<MenuLabel>My Account</MenuLabel>
				<MenuGroup>
					<MenuItem onAction={() => {}}>Profile</MenuItem>
					<MenuItem onAction={() => {}}>Settings</MenuItem>
					<MenuItem onAction={() => {}}>Billing</MenuItem>
				</MenuGroup>
				<MenuSeparator />
				<MenuItem onAction={() => {}}>
					<Pencil />
					Edit recipe
				</MenuItem>
				<MenuItem variant="destructive" onAction={() => {}}>
					<Trash2 />
					Delete recipe
				</MenuItem>
			</Menu>
		</MenuTrigger>
	),
};

/** A menu item with an aligned keyboard shortcut hint. */
export const WithShortcut: Story = {
	render: (props) => (
		<MenuTrigger>
			<Button variant="outline" size="sm">
				Edit
			</Button>
			<Menu {...props}>
				<MenuItem onAction={() => {}}>
					Undo
					<MenuShortcut>⌘Z</MenuShortcut>
				</MenuItem>
				<MenuItem onAction={() => {}}>
					Redo
					<MenuShortcut>⇧⌘Z</MenuShortcut>
				</MenuItem>
				<MenuSeparator />
				<MenuItem variant="destructive" onAction={() => {}}>
					Delete
					<MenuShortcut>⌫</MenuShortcut>
				</MenuItem>
			</Menu>
		</MenuTrigger>
	),
};

/** A menu with a nested submenu for secondary actions. */
export const WithSubmenu: Story = {
	render: (props) => (
		<MenuTrigger>
			<Button variant="outline" size="sm">
				Manage
			</Button>
			<Menu {...props}>
				<MenuGroup>
					<MenuItem onAction={() => {}}>Duplicate</MenuItem>
					<MenuItem onAction={() => {}}>Archive</MenuItem>
					<MenuSub>
						<MenuSubTrigger>More options</MenuSubTrigger>
						<MenuSubContent>
							<MenuItem onAction={() => {}}>Export as JSON</MenuItem>
							<MenuItem onAction={() => {}}>Export as CSV</MenuItem>
							<MenuSeparator />
							<MenuItem variant="destructive" onAction={() => {}}>
								Delete permanently
							</MenuItem>
						</MenuSubContent>
					</MenuSub>
				</MenuGroup>
			</Menu>
		</MenuTrigger>
	),
};

/** A single-select menu where the current selection is indicated with a checkmark. */
export const SingleSelection: Story = {
	render: (props) => {
		const [selected, setSelected] = useState<Set<Key>>(new Set(["espresso"]));

		return (
			<MenuTrigger>
				<Button variant="outline" size="sm">
					Brew method
				</Button>
				<Menu
					{...props}
					selectionMode="single"
					selectedKeys={selected}
					onSelectionChange={(keys) => {
						if (keys !== "all") {
							setSelected(keys);
						}
					}}
				>
					<MenuLabel>Brew method</MenuLabel>
					<MenuItem id="espresso">Espresso</MenuItem>
					<MenuItem id="pour-over">Pour Over</MenuItem>
					<MenuItem id="french-press">French Press</MenuItem>
				</Menu>
			</MenuTrigger>
		);
	},
};

/** A multi-select menu with independent toggleable items. */
export const MultipleSelection: Story = {
	render: (props) => {
		const [selected, setSelected] = useState<Set<Key>>(new Set(["espresso", "pour-over"]));

		return (
			<MenuTrigger>
				<Button variant="outline" size="sm">
					Brew methods
				</Button>
				<Menu
					{...props}
					selectionMode="multiple"
					selectedKeys={selected}
					onSelectionChange={(keys) => {
						if (keys !== "all") {
							setSelected(keys);
						}
					}}
				>
					<MenuLabel>Brew methods</MenuLabel>
					<MenuItem id="espresso">Espresso</MenuItem>
					<MenuItem id="pour-over">Pour Over</MenuItem>
					<MenuItem id="french-press">French Press</MenuItem>
				</Menu>
			</MenuTrigger>
		);
	},
};

/** A menu rendered from a dynamic `items` collection with a render function child. */
export const DynamicItems: Story = {
	render: (props) => {
		const items = [
			{ id: "espresso", name: "Espresso" },
			{ id: "pour-over", name: "Pour Over" },
			{ id: "french-press", name: "French Press" },
		];

		return (
			<MenuTrigger>
				<Button variant="outline" size="sm">
					Brew methods
				</Button>
				<Menu {...props} items={items}>
					{(item) => (
						<MenuItem id={item.id} onAction={() => {}}>
							{item.name}
						</MenuItem>
					)}
				</Menu>
			</MenuTrigger>
		);
	},
};
