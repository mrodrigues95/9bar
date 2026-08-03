import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collection } from "react-aria-components";
import { Label } from "../label/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectList,
	SelectTrigger,
	SelectValue,
} from "./select";

const meta = {
	component: Select,
	title: "Select",
	parameters: {
		controls: {
			include: ["placeholder", "isDisabled", "isInvalid", "selectionMode"],
		},
	},
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof Select>;

/** A single-select dropdown with static items and no label. */
export const Basic: Story = {
	render: (props) => (
		<Select aria-label="Favorite Animal" {...props}>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectList>
					<SelectItem id="aardvark">Aardvark</SelectItem>
					<SelectItem id="cat">Cat</SelectItem>
					<SelectItem id="dog">Dog</SelectItem>
					<SelectItem id="kangaroo">Kangaroo</SelectItem>
					<SelectItem id="panda">Panda</SelectItem>
					<SelectItem id="snake">Snake</SelectItem>
				</SelectList>
			</SelectContent>
		</Select>
	),
};

/** Groups options under labelled section headers with dynamic data. */
export const WithSections: Story = {
	render: (props) => {
		const items = [
			{
				name: "Fruit",
				children: [
					{ name: "Apple" },
					{ name: "Banana" },
					{ name: "Orange" },
					{ name: "Honeydew" },
					{ name: "Grapes" },
					{ name: "Watermelon" },
					{ name: "Cantaloupe" },
					{ name: "Pear" },
				],
			},
			{
				name: "Vegetable",
				children: [
					{ name: "Cabbage" },
					{ name: "Broccoli" },
					{ name: "Carrots" },
					{ name: "Lettuce" },
					{ name: "Spinach" },
					{ name: "Bok Choy" },
					{ name: "Cauliflower" },
					{ name: "Potatoes" },
				],
			},
		];

		return (
			<Select aria-label="Fruits and Vegetables" {...props}>
				<Label>Fruits and Vegetables</Label>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectList items={items}>
						{(section) => (
							<SelectGroup id={section.name}>
								<SelectLabel>{section.name}</SelectLabel>
								<Collection items={section.children}>
									{(item) => (
										<SelectItem id={item.name}>{item.name}</SelectItem>
									)}
								</Collection>
							</SelectGroup>
						)}
					</SelectList>
				</SelectContent>
			</Select>
		);
	},
};

/** Allows selecting multiple items with a custom render value that summarises the selection count. */
export const MultipleSelection: Story = {
	args: {
		selectionMode: "multiple",
	},
	render: () => {
		const items = [
			{ name: "Apple" },
			{ name: "Banana" },
			{ name: "Orange" },
			{ name: "Honeydew" },
			{ name: "Grapes" },
			{ name: "Watermelon" },
			{ name: "Cantaloupe" },
			{ name: "Pear" },
		];

		return (
			<Select<{ name: string }, "multiple">
				selectionMode="multiple"
				placeholder="Select fruits..."
				defaultValue={["Apple", "Banana"]}
			>
				<Label>Fruits</Label>
				<SelectTrigger>
					<SelectValue<{ name: string }>>
						{({ selectedText, selectedItems, defaultChildren }) => {
							if (selectedItems.length > 1) {
								const firstItem = selectedItems[0];
								return `${firstItem?.name} (+${selectedItems.length - 1} more)`;
							}

							return selectedText || defaultChildren;
						}}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectList items={items}>
						{(item) => <SelectItem id={item.name}>{item.name}</SelectItem>}
					</SelectList>
				</SelectContent>
			</Select>
		);
	},
};
