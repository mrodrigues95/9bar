import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta = {
	component: Input,
	title: "Primitives/Input",
	args: { "aria-label": "Beans", placeholder: "Honey Blend" },
	parameters: {
		controls: { include: ["disabled", "placeholder"] },
	},
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof Input>;

/** An empty input showing its placeholder. */
export const Default: Story = {};

/** An input with a value, as it looks after the user types. */
export const WithValue: Story = { args: { defaultValue: "Ethiopia Guji" } };

/** A disabled input that cannot be focused or edited. */
export const Disabled: Story = { args: { disabled: true, defaultValue: "Ethiopia Guji" } };

/** An input marked invalid, showing the destructive ring. */
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "abc" } };
