import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./text";

const meta = {
	title: "Components/Text",
	component: Text,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "The quick brown fox jumps over the lazy dog",
	},
};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Text variant="body">
				Body - The standard text for paragraphs and content
			</Text>
			<Text variant="body-sm">
				Body Small - Smaller body text for secondary content
			</Text>
			<Text variant="body-lg">Body Large - Larger body text for emphasis</Text>
			<Text variant="caption">
				Caption - Small descriptive text for images or supplementary information
			</Text>
			<Text variant="label">Label - Text for form labels and UI elements</Text>
			<Text variant="detail">
				Detail - Fine print for metadata and auxiliary information
			</Text>
		</div>
	),
};

export const SemanticElements: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<Text as="p" variant="body">
				This is a paragraph element with body variant
			</Text>
			<Text as="span" variant="caption">
				This is a span element with caption variant
			</Text>
			<Text as="label" variant="label">
				This is a label element with label variant
			</Text>
			<Text as="div" variant="detail">
				This is a div element with detail variant
			</Text>
		</div>
	),
};

export const RealWorldExample: Story = {
	render: () => (
		<div className="mx-auto max-w-2xl space-y-6 p-8">
			<div className="space-y-2">
				<Text as="p" variant="body-lg">
					Welcome to our platform! We're excited to have you here.
				</Text>
				<Text as="p" variant="body">
					Our mission is to make web development accessible and enjoyable for
					everyone. With our toolkit, you can build beautiful, accessible
					applications with ease.
				</Text>
			</div>

			<div className="rounded-lg border border-gray-200 p-6">
				<div className="mb-4 flex items-center justify-between">
					<Text variant="label">Product Name</Text>
					<Text variant="detail">SKU: 12345</Text>
				</div>
				<Text as="p" variant="body-sm" className="text-slate-600">
					This component library provides a complete set of accessible,
					composable primitives for building modern web applications.
				</Text>
				<Text
					as="p"
					variant="caption"
					className="mt-4 border-gray-100 border-t pt-4"
				>
					Last updated: October 11, 2025
				</Text>
			</div>
		</div>
	),
};
