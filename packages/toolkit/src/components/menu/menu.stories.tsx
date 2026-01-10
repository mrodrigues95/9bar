import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
	parameters: { controls: { disable: true } },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {
	args: {},
	render: (props) => (
		<MenuTrigger>
			<IconButton aria-label="Actions">
				<EllipsisHorizontalIcon />
			</IconButton>
			<Menu {...props}>
				<MenuItem onAction={() => alert("open")}>Open</MenuItem>
				<MenuItem onAction={() => alert("rename")}>Rename…</MenuItem>
				<MenuItem onAction={() => alert("duplicate")} isDisabled>
					Duplicate
				</MenuItem>
				<MenuItem onAction={() => alert("delete")} variant="danger">
					Delete…
				</MenuItem>
				<SubmenuTrigger>
					<MenuItem>Share</MenuItem>
					<Menu>
						<MenuItem>Email</MenuItem>
						<MenuItem>SMS</MenuItem>
						<MenuItem>Instagram</MenuItem>
					</Menu>
				</SubmenuTrigger>
				<MenuSeparator />
				<MenuSection
					title={<MenuSectionHeader title="View Options" />}
					selectionMode="multiple"
					defaultSelectedKeys={["files"]}
				>
					<MenuItem id="files">Show files</MenuItem>
					<MenuItem id="folders">Show folders</MenuItem>
				</MenuSection>
				<MenuSeparator />
				<MenuSection
					aria-label="Miscellaneous Options"
					selectionMode="multiple"
				>
					<MenuItem id="inspect">Inspect</MenuItem>
				</MenuSection>
			</Menu>
		</MenuTrigger>
	),
};

export const DynamicCollection: Story = {
	args: {},
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

export const WithLinks: Story = {
	args: {},
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
