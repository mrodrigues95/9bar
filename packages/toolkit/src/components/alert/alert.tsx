import {
	CheckCircleIcon,
	ExclamationTriangleIcon,
	InformationCircleIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";
import {
	createContext,
	type HTMLAttributes,
	type ReactNode,
	useContext,
	useEffect,
	useId,
	useState,
} from "react";
import { tv, type VariantProps } from "tailwind-variants";

interface AlertContextValue {
	variant: "success" | "danger" | "warning" | "info";
	titleId: string;
	descriptionId: string;
	hasTitle: boolean;
	setHasTitle: (value: boolean) => void;
	hasDescription: boolean;
	setHasDescription: (value: boolean) => void;
}

const AlertContext = createContext<AlertContextValue | null>(null);

const useAlert = () => {
	const context = useContext(AlertContext);
	if (!context) {
		throw new Error("<Alert /> subcomponents must be used within an <Alert />");
	}
	return context;
};

const alertVariants = tv({
	slots: {
		root: "relative flex items-start gap-3 rounded-md border p-3",
		indicator: "size-5 flex-shrink-0",
		content: "flex flex-1 flex-col gap-1",
		title: "font-semibold text-sm leading-4.5",
		description: "text-sm",
	},
	variants: {
		variant: {
			success: {
				root: "border-green-200 bg-green-50 text-green-900",
				indicator: "text-green-600",
			},
			danger: {
				root: "border-red-200 bg-red-50 text-red-900",
				indicator: "text-red-600",
			},
			warning: {
				root: "border-yellow-200 bg-yellow-50 text-yellow-900",
				indicator: "text-yellow-600",
			},
			info: {
				root: "border-blue-200 bg-blue-50 text-blue-900",
				indicator: "text-blue-600",
			},
		},
	},
	defaultVariants: {
		variant: "info",
	},
});

const defaultIcons = {
	success: CheckCircleIcon,
	danger: XCircleIcon,
	warning: ExclamationTriangleIcon,
	info: InformationCircleIcon,
};

export interface AlertProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof alertVariants> {}

const AlertRoot = ({
	variant = "info",
	className,
	children,
	...props
}: AlertProps) => {
	const titleId = useId();
	const descriptionId = useId();
	const [hasTitle, setHasTitle] = useState(false);
	const [hasDescription, setHasDescription] = useState(false);
	const styles = alertVariants({ variant });

	return (
		<AlertContext.Provider
			value={{
				variant,
				titleId,
				descriptionId,
				hasTitle,
				setHasTitle,
				hasDescription,
				setHasDescription,
			}}
		>
			<div
				role="alert"
				aria-labelledby={hasTitle ? titleId : undefined}
				aria-describedby={hasDescription ? descriptionId : undefined}
				className={styles.root({ className })}
				{...props}
			>
				{children}
			</div>
		</AlertContext.Provider>
	);
};

export interface AlertIndicatorProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
}

const AlertIndicator = ({
	className,
	children,
	...props
}: AlertIndicatorProps) => {
	const { variant } = useAlert();
	const styles = alertVariants({ variant });
	const DefaultIcon = defaultIcons[variant];

	return (
		<div className={styles.indicator({ className })} {...props}>
			{children ?? <DefaultIcon />}
		</div>
	);
};

const AlertContent = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => {
	const { variant } = useAlert();
	const styles = alertVariants({ variant });

	return <div className={styles.content({ className })} {...props} />;
};

const AlertTitle = ({
	className,
	...props
}: HTMLAttributes<HTMLSpanElement>) => {
	const { titleId, variant, setHasTitle } = useAlert();
	const styles = alertVariants({ variant });

	useEffect(() => {
		setHasTitle(true);
		return () => setHasTitle(false);
	}, [setHasTitle]);

	return (
		<span id={titleId} className={styles.title({ className })} {...props} />
	);
};

const AlertDescription = ({
	className,
	...props
}: HTMLAttributes<HTMLParagraphElement>) => {
	const { descriptionId, variant, setHasDescription } = useAlert();
	const styles = alertVariants({ variant });

	useEffect(() => {
		setHasDescription(true);
		return () => setHasDescription(false);
	}, [setHasDescription]);

	return (
		<p
			id={descriptionId}
			className={styles.description({ className })}
			{...props}
		/>
	);
};

const alertActionVariants = tv({
	base: "self-center",
	variants: {
		variant: {
			success: [
				"[&>*]:bg-green-100 [&>*]:text-green-900",
				"[&>*]:pressed:bg-green-300/75",
				"[&>*]:hover:bg-green-200 [&>*]:hover:text-green-950",
			],
			danger: [
				"[&>*]:bg-red-100 [&>*]:text-red-900",
				"[&>*]:pressed:bg-red-300/75",
				"[&>*]:hover:bg-red-200 [&>*]:hover:text-red-950",
			],
			warning: [
				"[&>*]:bg-yellow-100 [&>*]:text-yellow-900",
				"[&>*]:pressed:bg-yellow-300/75",
				"[&>*]:hover:bg-yellow-200 [&>*]:hover:text-yellow-950",
			],
			info: [
				"[&>*]:bg-blue-100 [&>*]:text-blue-900",
				"[&>*]:pressed:bg-blue-300/75",
				"[&>*]:hover:bg-blue-200 [&>*]:hover:text-blue-950",
			],
		},
	},
	defaultVariants: {
		variant: "info",
	},
});

const AlertAction = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => {
	const { variant } = useAlert();
	return (
		<div className={alertActionVariants({ variant, className })} {...props} />
	);
};

export const Alert = Object.assign(AlertRoot, {
	Indicator: AlertIndicator,
	Content: AlertContent,
	Title: AlertTitle,
	Description: AlertDescription,
	Action: AlertAction,
});
