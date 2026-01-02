import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const cardVariants = tv({
	slots: {
		root: "relative flex flex-col gap-6 rounded-lg border border-slate-950/10 bg-white py-6 shadow-xs outline-none",
		header: "flex flex-col gap-1.5 px-6",
		title: "font-semibold text-lg text-slate-950 leading-none",
		description: "text-slate-500 text-sm",
		panel: "flex flex-col px-6",
		footer: "flex items-center gap-2 px-6",
	},
	variants: {
		variant: {
			default: {},
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface CardProps
	extends useRender.ComponentProps<"div">,
		VariantProps<typeof cardVariants> {}

export const Card = ({ variant, className, render, ...props }: CardProps) => {
	const styles = cardVariants({ variant });
	return useRender({
		defaultTagName: "div",
		render: render ?? <div />,
		props: mergeProps<"div">(
			{
				className: styles.root({ className }),
				// https://github.com/mui/base-ui/issues/3545
				["data-slot" as string]: "card",
			},
			props,
		),
	});
};

export const CardHeader = ({ className, ...props }: ComponentProps<"div">) => {
	const styles = cardVariants();
	return (
		<div
			data-slot="card-header"
			className={styles.header({ className })}
			{...props}
		/>
	);
};

export const CardTitle = ({ className, ...props }: ComponentProps<"div">) => {
	const styles = cardVariants();
	return (
		<div
			data-slot="card-title"
			className={styles.title({ className })}
			{...props}
		/>
	);
};

export const CardDescription = ({
	className,
	...props
}: ComponentProps<"p">) => {
	const styles = cardVariants();
	return (
		<p
			data-slot="card-description"
			className={styles.description({ className })}
			{...props}
		/>
	);
};

export const CardPanel = ({ className, ...props }: ComponentProps<"div">) => {
	const styles = cardVariants();
	return (
		<div
			data-slot="card-panel"
			className={styles.panel({ className })}
			{...props}
		/>
	);
};

export const CardFooter = ({ className, ...props }: ComponentProps<"div">) => {
	const styles = cardVariants();
	return (
		<div
			data-slot="card-footer"
			className={styles.footer({ className })}
			{...props}
		/>
	);
};
