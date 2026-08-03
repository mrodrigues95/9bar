import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home } from "lucide-react";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from "./breadcrumb";

const meta = {
	component: Breadcrumb,
	title: "Breadcrumb",
	parameters: {
		controls: { include: [] },
	},
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A standard breadcrumb with navigable links and the current page rendered as plain text. */
export const Default: Story = {
	render: (props) => (
		<Breadcrumb {...props}>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Components</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

/** A breadcrumb with a home icon on the first crumb and a longer navigation path. */
export const WithIcon: Story = {
	render: (props) => (
		<Breadcrumb {...props}>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">
						<Home className="size-3.5" />
						Home
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Recipes</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Espresso</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbPage>Honey Blend</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};

/** A collapsed breadcrumb that uses an ellipsis to hide intermediate crumb levels. */
export const Collapsed: Story = {
	render: (props) => (
		<Breadcrumb {...props}>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Home</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbEllipsis />
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Logs</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbItem>
					<BreadcrumbPage>Brew #42</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	),
};
