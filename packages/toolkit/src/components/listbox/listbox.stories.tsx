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
	parameters: { layout: "padded", controls: { disable: true } },
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	render: () => (
		<Listbox aria-label="Favorite animal" selectionMode="single">
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

export const DynamicContent: Story = {
	render: () => {
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
			<Listbox aria-label="Animals" items={options} selectionMode="single">
				{(item) => <ListboxItem id={item.id}>{item.name}</ListboxItem>}
			</Listbox>
		);
	},
};

export const WithDescriptions: Story = {
	render: () => (
		<Listbox aria-label="Permissions" selectionMode="single">
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

export const Sections: Story = {
	render: () => (
		<Listbox aria-label="Sandwich contents" selectionMode="multiple">
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

export const MultipleSelection: Story = {
	render: () => {
		const [selected, setSelected] = useState<Selection>(new Set(["cheese"]));

		return (
			<div className="space-y-4">
				<Listbox
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

export const EmptyState: Story = {
	render: () => (
		<Listbox
			aria-label="Search results"
			renderEmptyState={() => "No results found."}
		>
			{[]}
		</Listbox>
	),
};
