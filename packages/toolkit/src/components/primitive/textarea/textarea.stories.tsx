import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";

const meta = {
	component: Textarea,
	title: "Primitives/Textarea",
	args: { "aria-label": "Tasting notes", placeholder: "Sweet, balanced, a little floral" },
	parameters: {
		controls: { include: ["disabled", "placeholder", "rows"] },
	},
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof Textarea>;

/** An empty textarea showing its placeholder. */
export const Default: Story = {};

/** A textarea with several lines of text. */
export const WithValue: Story = {
	args: { defaultValue: "Blueberry and jasmine.\nDelicate body, long finish." },
};

/** A disabled textarea that cannot be focused or edited. */
export const Disabled: Story = { args: { disabled: true, defaultValue: "Locked notes" } };

/** A textarea marked invalid, showing the destructive ring. */
export const Invalid: Story = { args: { "aria-invalid": true } };
