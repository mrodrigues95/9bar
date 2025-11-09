import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./heading";

const meta = {
	title: "Heading",
	component: Heading,
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "The quick brown fox jumps over the lazy dog",
	},
};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-col gap-6">
			<Heading variant="heading">Heading - Main page heading</Heading>
			<Heading variant="subheading">Subheading - Secondary heading</Heading>
			<Heading variant="title">Title - Section title</Heading>
			<Heading variant="subtitle">Subtitle - Section subtitle</Heading>
			<Heading variant="section">Section - Subsection heading</Heading>
		</div>
	),
};

export const SemanticLevels: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Heading as="h1" variant="heading">
				h1 - Main page heading
			</Heading>
			<Heading as="h2" variant="title">
				h2 - Section heading
			</Heading>
			<Heading as="h3" variant="subtitle">
				h3 - Subsection heading
			</Heading>
			<Heading as="h4" variant="section">
				h4 - Minor heading
			</Heading>
			<Heading as="h5" variant="label">
				h5 - Small heading
			</Heading>
			<Heading as="h6" variant="label">
				h6 - Smallest heading
			</Heading>
		</div>
	),
};

export const RealWorldExample: Story = {
	render: () => (
		<div className="mx-auto max-w-2xl space-y-8 p-8">
			<div className="space-y-2">
				<Heading as="h1" variant="heading" className="text-center">
					Welcome to Toolkit
				</Heading>
				<Heading
					as="p"
					variant="subheading"
					className="text-center text-gray-600"
				>
					Build modern web applications with ease
				</Heading>
			</div>

			<div className="space-y-4">
				<Heading as="h2" variant="title">
					Features
				</Heading>
				<div className="space-y-3">
					<div>
						<Heading as="h3" variant="section">
							Fast Development
						</Heading>
						<p className="text-gray-600 text-sm">
							Get started quickly with our toolkit
						</p>
					</div>
					<div>
						<Heading as="h3" variant="section">
							Type Safe
						</Heading>
						<p className="text-gray-600 text-sm">
							Built with TypeScript for better developer experience
						</p>
					</div>
				</div>
			</div>
		</div>
	),
};
