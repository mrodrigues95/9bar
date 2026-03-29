import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { IconButton } from "../icon-button/icon-button";
import {
	Menu,
	MenuItem,
	MenuSection,
	MenuSectionHeader,
	MenuSeparator,
	MenuTrigger,
	SubmenuTrigger,
} from "./menu";

const meta = {
	component: Menu,
	title: "Menu",
	parameters: { controls: { include: [] } },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof Menu>;

/** A simple menu with a few action items triggered from an icon button. */
export const BasicMenu: Story = {
	render: (props) => (
		<MenuTrigger>
			<IconButton aria-label="Actions">
				<EllipsisHorizontalIcon />
			</IconButton>
			<Menu {...props}>
				<MenuItem onAction={() => alert("open")}>Open</MenuItem>
				<MenuItem onAction={() => alert("rename")}>Rename…</MenuItem>
				<MenuItem onAction={() => alert("duplicate")}>Duplicate</MenuItem>
			</Menu>
		</MenuTrigger>
	),
};

/** A menu item that opens a nested sub-menu, useful for grouping related secondary actions like sharing options. */
export const WithSubmenus: Story = {
	render: (props) => (
		<MenuTrigger>
			<IconButton aria-label="Actions">
				<EllipsisHorizontalIcon />
			</IconButton>
			<Menu {...props}>
				<MenuItem>Open</MenuItem>
				<MenuItem>Rename…</MenuItem>
				<SubmenuTrigger>
					<MenuItem>Share</MenuItem>
					<Menu>
						<MenuItem>Email</MenuItem>
						<MenuItem>SMS</MenuItem>
						<MenuItem>Instagram</MenuItem>
					</Menu>
				</SubmenuTrigger>
			</Menu>
		</MenuTrigger>
	),
};

/** Groups menu items under labelled section headers separated by dividers. */
export const WithSections: Story = {
	render: (props) => (
		<MenuTrigger>
			<IconButton aria-label="Actions">
				<EllipsisHorizontalIcon />
			</IconButton>
			<Menu {...props}>
				<MenuItem>Open</MenuItem>
				<MenuItem>Rename…</MenuItem>
				<MenuSeparator />
				<MenuSection title={<MenuSectionHeader title="View Options" />}>
					<MenuItem id="files">Show files</MenuItem>
					<MenuItem id="folders">Show folders</MenuItem>
				</MenuSection>
			</Menu>
		</MenuTrigger>
	),
};

/** Enables checkbox-style multi-select within a menu section, allowing users to toggle options on and off. */
export const WithSelection: Story = {
	render: (props) => {
		const [selected, setSelected] = useState<Selection>(new Set(["files"]));

		return (
			<MenuTrigger>
				<IconButton aria-label="Actions">
					<EllipsisHorizontalIcon />
				</IconButton>
				<Menu {...props}>
					<MenuSection
						title={<MenuSectionHeader title="View Options" />}
						selectionMode="multiple"
						selectedKeys={selected}
						onSelectionChange={setSelected}
					>
						<MenuItem id="files">Show files</MenuItem>
						<MenuItem id="folders">Show folders</MenuItem>
						<MenuItem id="hidden">Show hidden</MenuItem>
					</MenuSection>
				</Menu>
			</MenuTrigger>
		);
	},
};

/** Shows a destructive menu item using the `danger` variant to visually warn the user. */
export const DangerItem: Story = {
	render: (props) => (
		<MenuTrigger>
			<IconButton aria-label="Actions">
				<EllipsisHorizontalIcon />
			</IconButton>
			<Menu {...props}>
				<MenuItem>Open</MenuItem>
				<MenuItem>Rename…</MenuItem>
				<MenuSeparator />
				<MenuItem variant="danger" onAction={() => alert("delete")}>
					Delete…
				</MenuItem>
			</Menu>
		</MenuTrigger>
	),
};

/** Shows a disabled menu item that cannot be interacted with. */
export const DisabledItem: Story = {
	render: (props) => (
		<MenuTrigger>
			<IconButton aria-label="Actions">
				<EllipsisHorizontalIcon />
			</IconButton>
			<Menu {...props}>
				<MenuItem>Open</MenuItem>
				<MenuItem isDisabled>Duplicate</MenuItem>
				<MenuItem>Rename…</MenuItem>
			</Menu>
		</MenuTrigger>
	),
};

/** Renders items from an array using the `items` prop and a render function. */
export const DynamicCollection: Story = {
	render: (props) => {
		const items = [
			{ id: 1, name: "New file…" },
			{ id: 2, name: "New window" },
			{ id: 3, name: "Open…" },
			{ id: 4, name: "Save" },
			{ id: 5, name: "Save as…" },
			{ id: 6, name: "Revert file" },
			{ id: 7, name: "Print…" },
			{ id: 8, name: "Close window" },
			{ id: 9, name: "Quit" },
		];

		return (
			<MenuTrigger>
				<IconButton aria-label="Actions">
					<EllipsisHorizontalIcon />
				</IconButton>
				<Menu {...props} items={items}>
					{(item) => <MenuItem>{item.name}</MenuItem>}
				</Menu>
			</MenuTrigger>
		);
	},
};

/** Menu items that navigate to a URL when activated, using the `href` prop. */
export const WithLinks: Story = {
	render: (props) => (
		<MenuTrigger>
			<IconButton aria-label="Actions">
				<EllipsisHorizontalIcon />
			</IconButton>
			<Menu {...props}>
				<MenuItem href="/docs">Docs</MenuItem>
				<MenuItem href="/particles">Particles</MenuItem>
			</Menu>
		</MenuTrigger>
	),
};
