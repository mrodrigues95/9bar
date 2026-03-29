import {
	ChevronRightIcon,
	EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { Key } from "react-aria-components";
import { cn } from "tailwind-variants";
import { IconButton } from "../icon-button/icon-button";
import { Link } from "../link/link";
import { Menu, MenuItem, MenuTrigger } from "../menu/menu";
import { Breadcrumb, type BreadcrumbProps, Breadcrumbs } from "./breadcrumbs";

const meta = {
	component: Breadcrumbs,
	title: "Breadcrumbs",
	parameters: { controls: { include: [] } },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

const DefaultBreadcrumb = ({ label }: { label: string }) => (
	<Breadcrumb>
		{({ isCurrent }) => (
			<>
				<Link href="#">{label}</Link>
				{!isCurrent && <ChevronRightIcon className="size-3" />}
			</>
		)}
	</Breadcrumb>
);

/** A basic breadcrumb trail with link items separated by chevron icons. */
export const Default: Story = {
	render: (props) => (
		<Breadcrumbs {...props}>
			<DefaultBreadcrumb label="Home" />
			<DefaultBreadcrumb label="Library" />
			<DefaultBreadcrumb label="Data" />
		</Breadcrumbs>
	),
};

const WithEllipsisBreadcrumb = ({ children }: BreadcrumbProps) => (
	<Breadcrumb className="disabled:[&_svg]:opacity-50">
		{(props) => (
			<>
				{typeof children === "function" && children(props)}
				{typeof children !== "function" && (
					<Link
						href="#"
						className={
							cn(
								"text-muted",
								"hover:text-slate-900",
								"focus-visible:text-slate-900",
								"current:text-slate-900 current:disabled:opacity-100",
							) ?? ""
						}
					>
						{children}
					</Link>
				)}
				{!props.isCurrent && <ChevronRightIcon className="size-3 text-muted" />}
			</>
		)}
	</Breadcrumb>
);

/** A breadcrumb trail that collapses intermediate items behind an ellipsis menu, useful for deep hierarchies. */
export const WithEllipsis: Story = {
	render: (props) => (
		<Breadcrumbs {...props}>
			<WithEllipsisBreadcrumb>Home</WithEllipsisBreadcrumb>
			<Breadcrumb>
				{({ isDisabled }) => (
					<MenuTrigger>
						<IconButton
							aria-label="More"
							variant="ghost"
							size="sm"
							isDisabled={isDisabled}
						>
							<EllipsisHorizontalIcon />
						</IconButton>
						<Menu>
							<MenuItem onAction={() => alert("open")}>Docs</MenuItem>
							<MenuItem onAction={() => alert("rename")}>Particles</MenuItem>
						</Menu>
					</MenuTrigger>
				)}
			</Breadcrumb>
			<WithEllipsisBreadcrumb>Library</WithEllipsisBreadcrumb>
			<WithEllipsisBreadcrumb>Data</WithEllipsisBreadcrumb>
		</Breadcrumbs>
	),
};

/** Breadcrumbs wrapped in a `nav` landmark element for use as the primary page navigation. */
export const MainNavigation: Story = {
	...WithEllipsis,
	render: (props, context) => (
		<nav aria-label="Breadcrumbs">{WithEllipsis.render?.(props, context)}</nav>
	),
};

/** Breadcrumbs in the disabled state, preventing all interaction. */
export const Disabled: Story = {
	...WithEllipsis,
	args: {
		...WithEllipsis.args,
		isDisabled: true,
	},
};

/** Breadcrumbs with a dynamic item list that updates when a breadcrumb is clicked, simulating navigation. */
export const DynamicContent: Story = {
	render: () => {
		const [breadcrumbs, setBreadcrumbs] = useState([
			{ id: 1, label: "Home" },
			{ id: 2, label: "Trendy" },
			{ id: 3, label: "March 2022 Assets" },
		]);

		const navigate = (id: Key) => {
			const i = breadcrumbs.findIndex((item) => item.id === id);
			setBreadcrumbs(breadcrumbs.slice(0, i + 1));
		};

		return (
			<Breadcrumbs items={breadcrumbs} onAction={navigate}>
				{(item) => (
					<WithEllipsisBreadcrumb key={item.id}>
						{item.label}
					</WithEllipsisBreadcrumb>
				)}
			</Breadcrumbs>
		);
	},
};
