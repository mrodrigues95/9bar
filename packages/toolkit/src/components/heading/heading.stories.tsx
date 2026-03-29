import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./heading";

const meta = {
	title: "Heading",
	component: Heading,
	parameters: {
		controls: { include: ["variant", "as"] },
	},
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Renders the default heading variant with placeholder text. Use the controls to adjust props. */
export const Default: Story = {
	args: {
		children: "The quick brown fox jumps over the lazy dog",
	},
};

/** Shows every visual variant side by side, from the largest `heading` down to the smallest `subsection`. */
export const Variants: Story = {
	render: (props) => (
		<div className="flex flex-col gap-6">
			<Heading {...props} variant="heading">
				Heading - Main page heading
			</Heading>
			<Heading {...props} variant="subheading">
				Subheading - Secondary heading
			</Heading>
			<Heading {...props} variant="title">
				Title - Section title
			</Heading>
			<Heading {...props} variant="subtitle">
				Subtitle - Section subtitle
			</Heading>
			<Heading {...props} variant="section">
				Section - Subsection heading
			</Heading>
		</div>
	),
};

/** Demonstrates mapping the `as` prop to semantic HTML elements (`h1`–`h6`) while pairing each with an appropriate visual variant. */
export const SemanticLevels: Story = {
	render: (props) => (
		<div className="flex flex-col gap-4">
			<Heading {...props} as="h1" variant="heading">
				h1 - Main page heading
			</Heading>
			<Heading {...props} as="h2" variant="title">
				h2 - Section heading
			</Heading>
			<Heading {...props} as="h3" variant="subtitle">
				h3 - Subsection heading
			</Heading>
			<Heading {...props} as="h4" variant="section">
				h4 - Minor heading
			</Heading>
			<Heading {...props} as="h5" variant="subsection">
				h5 - Small heading
			</Heading>
			<Heading {...props} as="h6" variant="subsection">
				h6 - Smallest heading
			</Heading>
		</div>
	),
};

/** A realistic page layout combining multiple heading levels to build a visual hierarchy with supporting body text. */
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
