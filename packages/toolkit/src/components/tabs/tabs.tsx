import { createContext, useContext } from "react";
import {
	Tab as AriaTab,
	TabList as AriaTabList,
	TabPanel as AriaTabPanel,
	TabPanels as AriaTabPanels,
	Tabs as AriaTabs,
	composeRenderProps,
	SelectionIndicator,
	type TabListProps,
	type TabPanelProps,
	type TabPanelsProps,
	type TabProps,
	type TabsProps,
} from "react-aria-components";
import { cn, tv, type VariantProps } from "tailwind-variants";
import { buttonVariants } from "../button/button";

const tabsVariants = tv({
	slots: {
		root: "flex w-full gap-2",
		list: "relative z-0 flex h-fit items-center justify-center gap-x-0.5 [scrollbar-width:none]",
		tab: [
			buttonVariants({ variant: "ghost", size: "sm" }),
			"group motion-safe:transition-[translate,width,height]",
			"focus-visible:ring-offset-0",
		],
		indicator:
			"absolute z-50 transition-[width,translate] duration-150 ease-in-out",
		panels: "relative w-full flex-1",
		panel: [
			"w-full flex-1 p-4 outline-none transition",
			"exiting:absolute exiting:top-0 exiting:left-0 exiting:w-full",
		],
	},
	variants: {
		variant: {
			underline: {
				list: "gap-x-0.5 overflow-visible border-border bg-transparent",
				indicator: "z-10 h-0.5 w-full",
			},
		},
		orientation: {
			horizontal: {
				root: "flex-col",
				list: "flex-row",
			},
			vertical: {
				root: "flex-row",
				list: "flex-col items-start",
				tab: "w-full justify-start",
			},
		},
		color: {
			default: {
				tab: "selected:text-slate-900",
				indicator: "bg-slate-900",
			},
			blue: {
				tab: "selected:text-blue-900",
				indicator: "bg-blue-900",
			},
		},
	},
	compoundVariants: [
		{
			variant: "underline",
			orientation: "horizontal",
			class: {
				list: "w-full justify-start border-b py-1",
				indicator: "-bottom-[5.5px] left-0 h-[3px]",
			},
		},
		{
			variant: "underline",
			orientation: "vertical",
			class: {
				list: "border-l px-1",
				tab: "w-full justify-start",
				indicator: "-left-[5.5px] bottom-0 h-full w-0.5",
			},
		},
	],
	defaultVariants: {
		variant: "underline",
		orientation: "horizontal",
		color: "default",
	},
});

type TabsVariantProps = VariantProps<typeof tabsVariants>;

interface TabsContextValue {
	// TODO: Add a `pill` variant.
	variant: "underline";
	orientation: "horizontal" | "vertical";
	color: "default" | "blue";
}

const TabsContext = createContext<TabsContextValue>({
	variant: "underline",
	orientation: "horizontal",
	color: "default",
});

export interface TabsPropsExtended extends TabsProps, TabsVariantProps {}

export const Tabs = ({
	variant = "underline",
	orientation = "horizontal",
	color = "default",
	...props
}: TabsPropsExtended) => {
	const styles = tabsVariants({ variant, orientation, color });

	return (
		<TabsContext.Provider value={{ variant, orientation, color }}>
			<AriaTabs
				orientation={orientation}
				{...props}
				data-slot="tabs"
				className={composeRenderProps(props.className, (className) =>
					styles.root({ className }),
				)}
			/>
		</TabsContext.Provider>
	);
};

export const TabList = <T extends object>(props: TabListProps<T>) => {
	const { variant, orientation, color } = useContext(TabsContext);
	const styles = tabsVariants({ variant, orientation, color });

	return (
		<AriaTabList
			data-slot="tabs-list"
			{...props}
			className={composeRenderProps(props.className, (className) =>
				styles.list({ className }),
			)}
		/>
	);
};

export const Tab = (props: TabProps) => {
	const { variant, orientation, color } = useContext(TabsContext);
	const styles = tabsVariants({ variant, orientation, color });

	return (
		<AriaTab
			data-slot="tabs-tab"
			{...props}
			className={composeRenderProps(
				props.className,
				(className) => cn(styles.tab({ className })) ?? "",
			)}
		>
			{composeRenderProps(props.children, (children) => (
				<>
					{children}
					<SelectionIndicator className={styles.indicator()} />
				</>
			))}
		</AriaTab>
	);
};

export const TabPanels = <T extends object>(props: TabPanelsProps<T>) => {
	const { variant, orientation, color } = useContext(TabsContext);
	const styles = tabsVariants({ variant, orientation, color });

	return (
		<AriaTabPanels
			data-slot="tabs-panels"
			{...props}
			className={styles.panels({ className: props.className })}
		/>
	);
};

export const TabPanel = (props: TabPanelProps) => {
	const { variant, orientation, color } = useContext(TabsContext);
	const styles = tabsVariants({ variant, orientation, color });

	return (
		<AriaTabPanel
			data-slot="tabs-panel"
			{...props}
			className={composeRenderProps(
				props.className,
				(className) => cn(styles.panel({ className })) ?? "",
			)}
		/>
	);
};
