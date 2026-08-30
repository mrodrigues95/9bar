import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cog, FileText, Home, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
	title: "Tabs",
	component: Tabs,
	parameters: {
		layout: "fullscreen",
		controls: { include: ["orientation"] },
		docs: {
			controls: { include: ["orientation"] },
			argTypes: { include: ["orientation"] },
		},
	},
	argTypes: {
		orientation: {
			control: { type: "select" },
			options: ["horizontal", "vertical"],
		},
	},
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A tab bar with icon+label triggers and corresponding content panels. Use the controls to change orientation. */
export const Default: Story = {
	render: (props) => (
		<Tabs {...props} defaultSelectedKey="home" className="p-4">
			<TabsList>
				<TabsTrigger id="home">
					<Home />
					Home
				</TabsTrigger>
				<TabsTrigger id="files">
					<FileText />
					Files
				</TabsTrigger>
				<TabsTrigger id="search">
					<Search />
					Search
				</TabsTrigger>
				<TabsTrigger id="settings">
					<Cog />
					Settings
				</TabsTrigger>
			</TabsList>
			<TabsContent id="home">Home content</TabsContent>
			<TabsContent id="files">Files content</TabsContent>
			<TabsContent id="search">Search content</TabsContent>
			<TabsContent id="settings">Settings content</TabsContent>
		</Tabs>
	),
};
