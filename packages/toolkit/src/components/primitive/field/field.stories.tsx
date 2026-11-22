import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../checkbox/checkbox";
import { Input } from "../input/input";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from "./field";

const meta = {
	component: Field,
	title: "Primitives/Field",
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof Field>;

/** A field with a label, input, and help text linked through `aria-describedby`. */
export const Default: Story = {
	render: (props) => (
		<Field {...props} className="w-64">
			<FieldLabel htmlFor="field-story-dose">Dose</FieldLabel>
			<Input id="field-story-dose" defaultValue="18" aria-describedby="field-story-dose-help" />
			<FieldDescription id="field-story-dose-help">Grams of ground coffee.</FieldDescription>
		</Field>
	),
};

/** An invalid field announcing its error through `FieldError`. */
export const Invalid: Story = {
	render: (props) => (
		<Field {...props} className="w-64" data-invalid>
			<FieldLabel htmlFor="field-story-yield">Yield</FieldLabel>
			<Input
				id="field-story-yield"
				defaultValue="0"
				aria-invalid
				aria-describedby="field-story-yield-error"
			/>
			<FieldError id="field-story-yield-error" errors={["Yield must be above 0"]} />
		</Field>
	),
};

/** A horizontal field with a checkbox and supporting content. */
export const Horizontal: Story = {
	render: (props) => (
		<Field {...props} orientation="horizontal" className="w-72">
			<Checkbox aria-describedby="field-story-pin-help">Pin as reference</Checkbox>
			<FieldContent>
				<FieldDescription id="field-story-pin-help">
					The recipe overview shows this shot’s values.
				</FieldDescription>
			</FieldContent>
		</Field>
	),
};

/** A fieldset grouping related fields under a legend, split by a separator. */
export const Grouped: Story = {
	render: () => (
		<FieldSet className="w-72">
			<FieldLegend>Brew parameters</FieldLegend>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="field-story-temp">Temperature</FieldLabel>
					<Input id="field-story-temp" defaultValue="93" />
				</Field>
				<FieldSeparator>Optional</FieldSeparator>
				<Field>
					<FieldLabel htmlFor="field-story-pressure">Pressure</FieldLabel>
					<Input id="field-story-pressure" defaultValue="9" />
				</Field>
			</FieldGroup>
		</FieldSet>
	),
};
