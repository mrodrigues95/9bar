import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { tv, type VariantProps } from "tailwind-variants";

const cardVariants = tv({
	slots: {
		root: "relative flex flex-col gap-6 rounded-lg border border-border bg-white py-6 shadow-xs outline-none",
		header: "flex flex-col gap-1.5 px-6",
		title: "font-semibold text-lg text-primary leading-none",
		description: "text-muted text-sm",
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

export const CardHeader = ({
	className,
	render,
	...props
}: useRender.ComponentProps<"div">) => {
	const styles = cardVariants();
	return useRender({
		defaultTagName: "div",
		render: render ?? <div />,
		props: mergeProps<"div">(
			{
				className: styles.header({ className }),
				["data-slot" as string]: "card-header",
			},
			props,
		),
	});
};

export const CardTitle = ({
	className,
	render,
	...props
}: useRender.ComponentProps<"div">) => {
	const styles = cardVariants();
	return useRender({
		defaultTagName: "div",
		render: render ?? <div />,
		props: mergeProps<"div">(
			{
				className: styles.title({ className }),
				["data-slot" as string]: "card-title",
			},
			props,
		),
	});
};

export const CardDescription = ({
	className,
	render,
	...props
}: useRender.ComponentProps<"p">) => {
	const styles = cardVariants();
	return useRender({
		defaultTagName: "p",
		render: render ?? <p />,
		props: mergeProps<"p">(
			{
				className: styles.description({ className }),
				["data-slot" as string]: "card-description",
			},
			props,
		),
	});
};

export const CardPanel = ({
	className,
	render,
	...props
}: useRender.ComponentProps<"div">) => {
	const styles = cardVariants();
	return useRender({
		defaultTagName: "div",
		render: render ?? <div />,
		props: mergeProps<"div">(
			{
				className: styles.panel({ className }),
				["data-slot" as string]: "card-panel",
			},
			props,
		),
	});
};

export const CardFooter = ({
	className,
	render,
	...props
}: useRender.ComponentProps<"div">) => {
	const styles = cardVariants();
	return useRender({
		defaultTagName: "div",
		render: render ?? <div />,
		props: mergeProps<"div">(
			{
				className: styles.footer({ className }),
				["data-slot" as string]: "card-footer",
			},
			props,
		),
	});
};
