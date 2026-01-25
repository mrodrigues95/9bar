import { ChevronDownIcon } from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Collection } from "react-aria-components";
import { Label } from "../field/label";
import {
	Select,
	SelectItem,
	SelectListbox,
	SelectPopover,
	type SelectProps,
	SelectSection,
	SelectSectionHeader,
	SelectTrigger,
	SelectValue,
	type SelectValueProps,
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

// TODO: Invalid styles not applying since data-invalid not being set on the trigger.
export const Basic: Story = {
	render: (props) => (
		<Select aria-label="Favorite Animal" {...props}>
			<SelectTrigger>
				<SelectValue />
				<ChevronDownIcon />
			</SelectTrigger>
			<SelectPopover>
				<SelectListbox>
					<SelectItem>Aardvark</SelectItem>
					<SelectItem>Cat</SelectItem>
					<SelectItem>Dog</SelectItem>
					<SelectItem>Kangaroo</SelectItem>
					<SelectItem>Panda</SelectItem>
					<SelectItem>Snake</SelectItem>
				</SelectListbox>
			</SelectPopover>
		</Select>
	),
};

interface ComposedSelectProps<T extends object>
	extends Omit<SelectProps<T>, "children"> {
	label?: string;
	renderValue?: SelectValueProps<T>["children"];
	items?: Iterable<T>;
	children: ReactNode | ((item: T) => ReactNode);
}

const ComposedSelect = <T extends object>({
	label,
	renderValue,
	items = [],
	children,
	...props
}: ComposedSelectProps<T>) => {
	return (
		<Select {...props}>
			{label && <Label>{label}</Label>}
			<SelectTrigger>
				<SelectValue<T>>
					{renderValue ??
						(({ selectedText, defaultChildren }) =>
							selectedText || defaultChildren)}
				</SelectValue>
				<ChevronDownIcon />
			</SelectTrigger>
			<SelectPopover>
				<SelectListbox items={items}>{children}</SelectListbox>
			</SelectPopover>
		</Select>
	);
};

export const WithSections: Story = {
	args: {},
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
			<ComposedSelect {...props} label="Fruits and Vegetables" items={items}>
				{(section) => (
					<SelectSection id={section.name}>
						<SelectSectionHeader title={section.name} />
						<Collection items={section.children}>
							{(item) => <SelectItem id={item.name}>{item.name}</SelectItem>}
						</Collection>
					</SelectSection>
				)}
			</ComposedSelect>
		);
	},
};

export const MultipleSelection: Story = {
	args: {
		selectionMode: "multiple",
	},
	render: (props) => {
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
			<ComposedSelect
				{...props}
				placeholder="Select fruits..."
				defaultValue={["Apple", "Banana"]}
				renderValue={({ selectedText, selectedItems, defaultChildren }) => {
					if (Array.isArray(selectedItems) && selectedItems.length > 1) {
						const firstItem = selectedItems[0];
						const remaining = selectedItems.length - 1;
						return `${firstItem?.name} (+${remaining} more)`;
					}

					return selectedText || defaultChildren;
				}}
				label="Fruits"
				items={items}
			>
				{(item) => <SelectItem id={item.name}>{item.name}</SelectItem>}
			</ComposedSelect>
		);
	},
};
