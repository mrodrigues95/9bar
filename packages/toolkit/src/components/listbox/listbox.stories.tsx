import { BookOpenIcon, KeyIcon, PencilIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { Text } from "../text/text";
import {
	Listbox,
	ListboxItem,
	ListboxSection,
	ListboxSectionHeader,
	ListboxSeparator,
} from "./listbox";

const meta = {
	component: Listbox,
	title: "Listbox",
	parameters: { layout: "padded", controls: { include: [] } },
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A simple single-selection listbox with static items. */
export const Basic: Story = {
	render: (props) => (
		<Listbox {...props} aria-label="Favorite animal" selectionMode="single">
			<ListboxItem id="aardvark">Aardvark</ListboxItem>
			<ListboxItem id="cat">Cat</ListboxItem>
			<ListboxItem id="dog">Dog</ListboxItem>
			<ListboxItem id="kangaroo">Kangaroo</ListboxItem>
			<ListboxItem id="koala">Koala</ListboxItem>
			<ListboxItem id="penguin">Penguin</ListboxItem>
			<ListboxItem id="snake">Snake</ListboxItem>
			<ListboxItem id="turtle">Turtle</ListboxItem>
			<ListboxItem id="wombat">Wombat</ListboxItem>
		</Listbox>
	),
};

/** Renders items from an array using the `items` prop and a render function. */
export const DynamicContent: Story = {
	render: (props) => {
		const options = [
			{ id: 1, name: "Aardvark" },
			{ id: 2, name: "Cat" },
			{ id: 3, name: "Dog" },
			{ id: 4, name: "Kangaroo" },
			{ id: 5, name: "Koala" },
			{ id: 6, name: "Penguin" },
			{ id: 7, name: "Snake" },
			{ id: 8, name: "Turtle" },
			{ id: 9, name: "Wombat" },
		];

		return (
			<Listbox
				{...props}
				aria-label="Animals"
				items={options}
				selectionMode="single"
			>
				{(item) => <ListboxItem id={item.id}>{item.name}</ListboxItem>}
			</Listbox>
		);
	},
};

/** Shows items with leading icons and multi-line content using label and description text slots. */
export const WithDescriptions: Story = {
	render: (props) => (
		<Listbox {...props} aria-label="Permissions" selectionMode="single">
			<ListboxItem
				id="read"
				textValue="Read"
				startContent={<BookOpenIcon className="size-3.5" />}
			>
				<Text slot="label" color="primary" variant="detail">
					Read
				</Text>
				<Text slot="description" color="muted" variant="caption">
					Read only
				</Text>
			</ListboxItem>
			<ListboxItem
				id="write"
				textValue="Write"
				startContent={<PencilIcon className="size-3.5" />}
			>
				<Text slot="label" color="primary" variant="detail">
					Write
				</Text>
				<Text slot="description" color="muted" variant="caption">
					Read and write only
				</Text>
			</ListboxItem>
			<ListboxItem
				id="admin"
				textValue="Admin"
				startContent={<KeyIcon className="size-3.5" />}
			>
				<Text slot="label" color="primary" variant="detail">
					Admin
				</Text>
				<Text slot="description" color="muted" variant="caption">
					Full access
				</Text>
			</ListboxItem>
		</Listbox>
	),
};

/** Groups items into labelled sections separated by a divider. */
export const Sections: Story = {
	render: (props) => (
		<Listbox {...props} aria-label="Sandwich contents" selectionMode="multiple">
			<ListboxSection title={<ListboxSectionHeader title="Veggies" />}>
				<ListboxItem id="lettuce">Lettuce</ListboxItem>
				<ListboxItem id="tomato">Tomato</ListboxItem>
				<ListboxItem id="onion">Onion</ListboxItem>
			</ListboxSection>
			<ListboxSection title={<ListboxSectionHeader title="Protein" />}>
				<ListboxItem id="ham">Ham</ListboxItem>
				<ListboxItem id="tuna">Tuna</ListboxItem>
				<ListboxItem id="tofu">Tofu</ListboxItem>
			</ListboxSection>
			<ListboxSeparator />
			<ListboxSection
				title={<ListboxSectionHeader title="Condiments" />}
				items={[
					{ id: "mayo", name: "Mayonaise" },
					{ id: "mustard", name: "Mustard" },
					{ id: "ranch", name: "Ranch" },
				]}
			>
				{(item) => <ListboxItem id={item.id}>{item.name}</ListboxItem>}
			</ListboxSection>
		</Listbox>
	),
};

/** Demonstrates controlled multi-select with a disabled item and a live readout of the current selection. */
export const MultipleSelection: Story = {
	render: (props) => {
		const [selected, setSelected] = useState<Selection>(new Set(["cheese"]));

		return (
			<div className="space-y-4">
				<Listbox
					{...props}
					aria-label="Sandwich contents"
					selectionMode="multiple"
					selectedKeys={selected}
					onSelectionChange={setSelected}
				>
					<ListboxItem id="lettuce">Lettuce</ListboxItem>
					<ListboxItem id="tomato">Tomato</ListboxItem>
					<ListboxItem id="cheese">Cheese</ListboxItem>
					<ListboxItem id="tuna" isDisabled>
						Tuna Salad
					</ListboxItem>
					<ListboxItem id="egg">Egg Salad</ListboxItem>
					<ListboxItem id="ham">Ham</ListboxItem>
				</Listbox>
				<p className="text-gray-600 text-sm">
					Current selection:{" "}
					{selected === "all" ? "all" : [...selected].join(", ")}
				</p>
			</div>
		);
	},
};

/** Shows the placeholder rendered by `renderEmptyState` when the listbox has no items. */
export const EmptyState: Story = {
	render: (props) => (
		<Listbox
			{...props}
			aria-label="Search results"
			renderEmptyState={() => "No results found."}
		>
			{[]}
		</Listbox>
	),
};
