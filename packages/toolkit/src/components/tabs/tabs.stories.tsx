import {
	Cog6ToothIcon,
	DocumentIcon,
	HomeIcon,
	MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "./tabs";

const meta = {
	title: "Tabs",
	component: Tabs,
	parameters: {
		layout: "fullscreen",
		controls: { include: ["variant", "orientation", "color"] },
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["underline"],
		},
	},
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		variant: "underline",
		orientation: "horizontal",
	},
	render: (props) => (
		<Tabs {...props} className="p-4">
			<TabList aria-label="Tabs">
				<Tab id="home">
					<HomeIcon />
					Home
				</Tab>
				<Tab id="files">
					<DocumentIcon />
					Files
				</Tab>
				<Tab id="search">
					<MagnifyingGlassCircleIcon />
					Search
				</Tab>
				<Tab id="settings">
					<Cog6ToothIcon />
					Settings
				</Tab>
			</TabList>

			<TabPanels>
				<TabPanel id="home">Home content</TabPanel>
				<TabPanel id="files">Files content</TabPanel>
				<TabPanel id="search">Search content</TabPanel>
				<TabPanel id="settings">Settings content</TabPanel>
			</TabPanels>
		</Tabs>
	),
};
