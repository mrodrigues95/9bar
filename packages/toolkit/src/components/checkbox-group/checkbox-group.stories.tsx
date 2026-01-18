import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../checkbox/checkbox";
import { Description } from "../field/description";
import { Label } from "../field/label";
import { CheckboxGroup } from "./checkbox-group";

const meta = {
	component: CheckboxGroup,
	title: "Checkbox Group",
	parameters: {
		controls: {
			include: ["isDisabled", "isReadOnly"],
		},
	},
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
	args: {},
	render: (props) => {
		return (
			<CheckboxGroup {...props}>
				<Label>Favorite Sports</Label>
				<Checkbox value="soccer">Soccer</Checkbox>
				<Checkbox value="basketball">Basketball</Checkbox>
				<Checkbox value="baseball">Baseball</Checkbox>
				<Description>Pick your favorite sports</Description>
			</CheckboxGroup>
		);
	},
};
