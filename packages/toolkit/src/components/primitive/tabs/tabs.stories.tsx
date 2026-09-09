import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cog, FileText, Home, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsProps } from "./tabs";

const meta = {
	title: "Primitives/Tabs",
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

/** Shared tab bar with icon+label triggers and content panels. Pass `disabledKey` to disable one trigger. */
const TabsDemo = ({ disabledKey, ...props }: TabsProps & { disabledKey?: string }) => (
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
			<TabsTrigger id="settings" isDisabled={disabledKey === "settings"}>
				<Cog />
				Settings
			</TabsTrigger>
		</TabsList>
		<TabsContent id="home">Home content</TabsContent>
		<TabsContent id="files">Files content</TabsContent>
		<TabsContent id="search">Search content</TabsContent>
		<TabsContent id="settings">Settings content</TabsContent>
	</Tabs>
);

/** A tab bar with icon+label triggers and corresponding content panels. Use the controls to change orientation. */
export const Default: Story = {
	render: (props) => <TabsDemo {...props} />,
};

/** A vertical tab bar with the trigger rail beside the content panels. */
export const Vertical: Story = {
	args: {
		orientation: "vertical",
	},
	render: (props) => <TabsDemo {...props} />,
};

/** A tab bar with the settings trigger disabled, skipping it in keyboard navigation and blocking selection. */
export const Disabled: Story = {
	render: (props) => <TabsDemo {...props} disabledKey="settings" />,
};
