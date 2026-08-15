import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import {
	Tab as AriaTab,
	TabList as AriaTabList,
	TabPanel as AriaTabPanel,
	Tabs as AriaTabs,
} from "react-aria-components";
import { cn } from "#lib/utils";

/** Props for the {@link Tabs} component. */
export type TabsProps = React.ComponentProps<typeof AriaTabs>;

/** A set of layered panels where only one panel is visible at a time, controlled by a tabbed navigation bar. */
export const Tabs = ({ className, ...props }: TabsProps) => {
	return (
		<AriaTabs
			data-slot="tabs"
			className={cn(
				"group/tabs flex gap-2 data-horizontal:flex-col",
				className,
			)}
			{...props}
		/>
	);
};

const tabsListVariants = cva(
	[
		"group/tabs-list inline-flex w-fit items-center justify-center rounded-lg",
		"p-[3px] text-muted-foreground",
		"data-[variant=line]:rounded-none",
		"group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit",
		"group-data-vertical/tabs:flex-col",
	],
	{
		variants: {
			variant: {
				default: "bg-muted",
				line: "gap-1 bg-transparent",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

/** Props for the {@link TabsList} component. */
export type TabsListProps = React.ComponentProps<typeof AriaTabList> &
	VariantProps<typeof tabsListVariants>;

/** A horizontal or vertical bar containing the {@link TabsTrigger} elements that control panel visibility. */
export const TabsList = ({
	className,
	variant = "default",
	...props
}: TabsListProps) => {
	return (
		<AriaTabList
			data-slot="tabs-list"
			data-variant={variant}
			className={cn(tabsListVariants({ variant }), className)}
			{...props}
		/>
	);
};

/** Props for the {@link TabsTrigger} component. */
export type TabsTriggerProps = React.ComponentProps<typeof AriaTab>;

/** An individual tab button that activates its corresponding {@link TabsContent}. */
export const TabsTrigger = ({ className, ...props }: TabsTriggerProps) => {
	return (
		<AriaTab
			data-slot="tabs-trigger"
			className={cn(
				[
					"relative inline-flex h-[calc(100%-1px)] flex-1 cursor-default items-center justify-center",
					"gap-1.5 whitespace-nowrap rounded-md border border-transparent px-1.5 py-0.5",
					"font-medium text-foreground/60 text-xs transition-all",
					"hover:text-foreground",
					"focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring",
					"focus-visible:ring-[3px] focus-visible:ring-ring/50",
					"disabled:pointer-events-none disabled:opacity-50",
					"has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1",
					"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
					"group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",
					"group-data-vertical/tabs:py-[calc(--spacing(1.25))]",
					"dark:text-muted-foreground dark:hover:text-foreground",
					"[&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				],
				[
					"group-data-[variant=line]/tabs-list:bg-transparent",
					"group-data-[variant=line]/tabs-list:data-selected:bg-transparent",
					"dark:group-data-[variant=line]/tabs-list:data-selected:border-transparent",
					"dark:group-data-[variant=line]/tabs-list:data-selected:bg-transparent",
				],
				[
					"data-selected:bg-background data-selected:text-foreground",
					"dark:data-selected:border-input dark:data-selected:bg-input/30",
					"dark:data-selected:text-foreground",
				],
				[
					"after:absolute after:bg-foreground after:opacity-0 after:transition-opacity",
					"group-data-horizontal/tabs:after:inset-x-0 group-data-vertical/tabs:after:inset-y-0",
					"group-data-vertical/tabs:after:-right-1 group-data-horizontal/tabs:after:bottom-[-5px]",
					"group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:w-0.5",
					"group-data-[variant=line]/tabs-list:data-selected:after:opacity-100",
				],
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link TabsContent} component. */
export type TabsContentProps = React.ComponentProps<typeof AriaTabPanel>;

/** The content area associated with a single {@link TabsTrigger}. Only the active panel is visible. */
export const TabsContent = ({ className, ...props }: TabsContentProps) => {
	return (
		<AriaTabPanel
			data-slot="tabs-content"
			className={cn("flex-1 text-xs/relaxed outline-none", className)}
			{...props}
		/>
	);
};

export { tabsListVariants };
