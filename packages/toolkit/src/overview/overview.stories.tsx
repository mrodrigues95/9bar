import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppFrame, Section } from "./frame";
import { BrewLogSection } from "./sections/brew-log";
import { FeedbackSection } from "./sections/feedback";
import { HeroSection } from "./sections/hero";
import { NavigationSection } from "./sections/navigation";
import { OverlaySection } from "./sections/overlays";
import { FormSection } from "./sections/recipe-form";
import { TypographySection } from "./sections/typography";
import { VariantsSection } from "./sections/variants";

const meta = {
	title: "Overview",
	tags: ["!autodocs"],
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The toolkit overview canvas — every public component applied in realistic
 * 9bar application UI, composed like the preview on ui.shadcn.com/create.
 *
 * Use it to get a feel for the design system, to spot visual regressions
 * after changes, and to check that components align with the overall theme.
 * Toggle the theme toolbar global to review the same canvas in dark mode.
 *
 * The canvas is split into app-like sections (hero, form, brew log,
 * feedback, navigation, overlays) followed by variant strips that guarantee
 * coverage of every public component and its key variants. When adding or
 * changing a component, update the matching section here.
 */
export const Preview: Story = {
	render: () => (
		<div className="min-h-dvh bg-background">
			<AppFrame>
				<Section title="Recipe" description="Recipe summary and brew stats">
					<HeroSection />
				</Section>
				<Section
					title="Forms"
					description="Every form-connected field in one composition"
				>
					<FormSection />
				</Section>
				<Section
					title="Brew log"
					description="Lists, pagination, and empty states"
				>
					<BrewLogSection />
				</Section>
				<Section title="Feedback" description="All alert variants">
					<FeedbackSection />
				</Section>
				<Section title="Navigation" description="Tabs, breadcrumbs, and links">
					<NavigationSection />
				</Section>
				<Section
					title="Overlays"
					description="Open by clicking — menus, popovers, selects, and a listbox"
				>
					<OverlaySection />
				</Section>
				<Section title="Typography" description="The heading and text scales">
					<TypographySection />
				</Section>
				<Section
					title="Variants"
					description="Component variants the sections above don't exercise"
				>
					<VariantsSection />
				</Section>
			</AppFrame>
		</div>
	),
};
