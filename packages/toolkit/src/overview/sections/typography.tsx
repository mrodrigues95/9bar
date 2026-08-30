import { Heading, Text } from "../../components";

/** The typographic scale: every `Heading` and `Text` variant side by side. */
export const TypographySection = () => (
	<div className="grid gap-10 sm:grid-cols-2">
		<div className="flex flex-col gap-4">
			<Heading variant="heading">Heading</Heading>
			<Heading variant="subheading">Subheading</Heading>
			<Heading variant="title">Title</Heading>
			<Heading variant="subtitle">Subtitle</Heading>
			<Heading variant="section">Section</Heading>
			<Heading variant="subsection">Subsection</Heading>
		</div>
		<div className="flex flex-col gap-4">
			<Text variant="body-lg" color="primary">
				Body Large — the 9bar house blend, ground fresh
			</Text>
			<Text variant="body" color="primary">
				Body — the 9bar house blend, ground fresh
			</Text>
			<Text variant="body-sm" color="primary">
				Body Small — the 9bar house blend, ground fresh
			</Text>
			<Text variant="caption" color="primary">
				Caption — pulled at 9 bars of pressure
			</Text>
			<Text variant="label" color="primary">
				Label — dose
			</Text>
			<Text variant="detail">Detail — logged 08:12 · 93 °C · 18 g</Text>
		</div>
	</div>
);
