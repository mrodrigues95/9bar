import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlert, Search } from "lucide-react";
import { useId } from "react";
import { Field } from "../field/field";
import { Label } from "../label/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectList,
	SelectTrigger,
	SelectValue,
} from "../select/select";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
} from "./input-group";

const meta = {
	component: InputGroup,
	title: "InputGroup",
	parameters: {
		controls: { include: ["isDisabled", "isInvalid"] },
	},
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A minimal input group with a trailing icon addon. */
export const Default: Story = {
	render: (props) => (
		<InputGroup aria-label="Weight" {...props}>
			<InputGroupInput aria-label="Weight value" />
			<InputGroupAddon align="inline-end">
				<CircleAlert />
			</InputGroupAddon>
		</InputGroup>
	),
};

/** Pairs the input group with a visible Field and Label, plus a trailing text addon showing the unit. */
export const WithVisibleLabel: Story = {
	render: (props) => {
		const id = useId();
		return (
			<Field data-slot="input-group-field">
				<Label data-slot="input-group-label" id={id}>
					Weight
				</Label>
				<InputGroup aria-labelledby={id} {...props}>
					<InputGroupInput
						aria-label="Weight value"
						type="number"
						step="0.01"
						min="0"
						placeholder="0.00"
					/>
					<InputGroupAddon align="inline-end">
						<InputGroupText>grams</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
			</Field>
		);
	},
};

/** Shows multiple InputGroupInput elements in a single group, useful for segmented inputs like serial numbers. */
export const WithMultipleInputs: Story = {
	render: (props) => (
		<InputGroup aria-label="Serial Number" className="max-w-40" {...props}>
			<InputGroupInput
				aria-label="First 3 digits"
				maxLength={3}
				placeholder="000"
			/>
			<InputGroupInput
				aria-label="Middle 2 digits"
				maxLength={2}
				placeholder="00"
			/>
			<InputGroupInput
				aria-label="Last 4 digits"
				maxLength={4}
				placeholder="0000"
			/>
		</InputGroup>
	),
};

/** Demonstrates a leading text addon, such as a currency symbol, before the input. */
export const WithStartText: Story = {
	render: (props) => (
		<InputGroup aria-label="Price" {...props}>
			<InputGroupAddon>
				<InputGroupText>$</InputGroupText>
			</InputGroupAddon>
			<InputGroupInput
				aria-label="Price value"
				type="number"
				step="0.01"
				min="0"
				placeholder="0.00"
			/>
		</InputGroup>
	),
};

/** Combines a leading prefix and trailing suffix around the input, useful for URL builders. */
export const WithStartAndEndText: Story = {
	render: (props) => (
		<InputGroup aria-label="URL" {...props}>
			<InputGroupAddon>
				<InputGroupText>https://</InputGroupText>
			</InputGroupAddon>
			<InputGroupInput
				aria-label="URL value"
				type="text"
				placeholder="example"
			/>
			<InputGroupAddon align="inline-end">
				<InputGroupText>.com</InputGroupText>
			</InputGroupAddon>
		</InputGroup>
	),
};

/** Adds a compact search button as a trailing addon, a common pattern for search inputs. */
export const WithButton: Story = {
	render: (props) => (
		<InputGroup aria-label="Search" className="max-w-64" {...props}>
			<InputGroupInput
				aria-label="Search terms"
				placeholder="Search recipes..."
			/>
			<InputGroupAddon align="inline-end">
				<InputGroupButton variant="ghost" size="icon-xs" aria-label="Search">
					<Search />
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	),
};

/** Embeds a compact Select inside a trailing addon, allowing the user to choose a unit alongside the numeric input. */
export const WithSelect: Story = {
	render: (props) => (
		<div className="flex flex-col gap-6">
			<InputGroup aria-label="Brew time" {...props}>
				<InputGroupInput
					aria-label="Brew time value"
					type="number"
					step="0.1"
					min="0"
					placeholder="0.0"
				/>
				<InputGroupAddon align="inline-end">
					<Select aria-label="Time unit value" defaultSelectedKey="s">
						<SelectTrigger
							size="sm"
							className="border-0 bg-transparent shadow-none dark:bg-transparent dark:hover:bg-transparent"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectList>
								<SelectItem id="s">Seconds (s)</SelectItem>
								<SelectItem id="m">Minutes (m)</SelectItem>
							</SelectList>
						</SelectContent>
					</Select>
				</InputGroupAddon>
			</InputGroup>
		</div>
	),
};
