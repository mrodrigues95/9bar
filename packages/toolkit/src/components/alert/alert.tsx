import {
	CheckCircleIcon,
	ExclamationTriangleIcon,
	InformationCircleIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";
import {
	type ComponentProps,
	createContext,
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
		root: "relative flex items-start gap-2 rounded-xl border p-3",
		indicator: "size-4 flex-shrink-0",
		content: "flex flex-1 flex-col gap-1",
		title: "font-medium text-slate-900 text-sm leading-4.5",
		description: "text-slate-700 text-sm",
	},
	variants: {
		variant: {
			success: {
				root: "border-green-200 bg-green-50/75",
				indicator: "text-green-600",
			},
			danger: {
				root: "border-red-200 bg-red-50/75",
				indicator: "text-red-600",
			},
			warning: {
				root: "border-yellow-200 bg-yellow-50/75",
				indicator: "text-yellow-600",
			},
			info: {
				root: "border-blue-200 bg-blue-50/75",
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
	extends ComponentProps<"div">,
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
				data-slot="alert"
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

export interface AlertIndicatorProps extends ComponentProps<"div"> {
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
		<div
			data-slot="alert-indicator"
			className={styles.indicator({ className })}
			{...props}
		>
			{children ?? <DefaultIcon />}
		</div>
	);
};

const AlertContent = ({ className, ...props }: ComponentProps<"div">) => {
	const { variant } = useAlert();
	const styles = alertVariants({ variant });

	return (
		<div
			data-slot="alert-content"
			className={styles.content({ className })}
			{...props}
		/>
	);
};

const AlertTitle = ({ className, ...props }: ComponentProps<"span">) => {
	const { titleId, variant, setHasTitle } = useAlert();
	const styles = alertVariants({ variant });

	useEffect(() => {
		setHasTitle(true);
		return () => setHasTitle(false);
	}, [setHasTitle]);

	return (
		<span
			id={titleId}
			data-slot="alert-title"
			className={styles.title({ className })}
			{...props}
		/>
	);
};

const AlertDescription = ({ className, ...props }: ComponentProps<"p">) => {
	const { descriptionId, variant, setHasDescription } = useAlert();
	const styles = alertVariants({ variant });

	useEffect(() => {
		setHasDescription(true);
		return () => setHasDescription(false);
	}, [setHasDescription]);

	return (
		<p
			id={descriptionId}
			data-slot="alert-description"
			className={styles.description({ className })}
			{...props}
		/>
	);
};

const alertActionVariants = tv({
	base: "self-center [&>*]:bg-inherit [&>*]:p-0 [&>*]:hover:bg-inherit",
	variants: {
		variant: {
			success: ["[&>*]:text-green-900", "[&>*]:hover:text-green-950"],
			danger: ["[&>*]:text-red-900", "[&>*]:hover:text-red-950"],
			warning: ["[&>*]:text-yellow-900", "[&>*]:hover:text-yellow-950"],
			info: ["[&>*]:text-blue-900", "[&>*]:hover:text-blue-950"],
		},
	},
	defaultVariants: {
		variant: "info",
	},
});

const AlertAction = ({ className, ...props }: ComponentProps<"div">) => {
	const { variant } = useAlert();
	return (
		<div
			data-slot="alert-action"
			className={alertActionVariants({ variant, className })}
			{...props}
		/>
	);
};

export const Alert = Object.assign(AlertRoot, {
	Indicator: AlertIndicator,
	Content: AlertContent,
	Title: AlertTitle,
	Description: AlertDescription,
	Action: AlertAction,
});
