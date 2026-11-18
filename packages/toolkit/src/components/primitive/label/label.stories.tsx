import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../input/input";
import { Label } from "./label";

const meta = {
	component: Label,
	title: "Primitives/Label",
	args: { children: "Grind size" },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof Label>;

/** A label on its own. */
export const Default: Story = {};

/** A label tied to an input through `htmlFor`; clicking the label focuses the input. */
export const WithInput: Story = {
	render: (props) => (
		<div className="flex flex-col gap-2">
			<Label {...props} htmlFor="label-story-grind" />
			<Input id="label-story-grind" defaultValue="12" />
		</div>
	),
};
