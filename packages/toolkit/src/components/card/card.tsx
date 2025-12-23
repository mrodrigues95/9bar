import type { HTMLAttributes } from "react";
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
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {}

const CardRoot = ({ variant, className, ...props }: CardProps) => {
	const styles = cardVariants({ variant });
	return <div className={styles.root({ className })} {...props} />;
};

const CardHeader = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => {
	const styles = cardVariants();
	return <div className={styles.header({ className })} {...props} />;
};

const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
	const styles = cardVariants();
	return <div className={styles.title({ className })} {...props} />;
};

const CardDescription = ({
	className,
	...props
}: HTMLAttributes<HTMLParagraphElement>) => {
	const styles = cardVariants();
	return <p className={styles.description({ className })} {...props} />;
};

const CardPanel = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
	const styles = cardVariants();
	return <div className={styles.panel({ className })} {...props} />;
};

const CardFooter = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => {
	const styles = cardVariants();
	return <div className={styles.footer({ className })} {...props} />;
};

export const Card = Object.assign(CardRoot, {
	Header: CardHeader,
	Title: CardTitle,
	Description: CardDescription,
	Panel: CardPanel,
	Footer: CardFooter,
});
