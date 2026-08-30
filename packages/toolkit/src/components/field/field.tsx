import { cva, type VariantProps } from "class-variance-authority";
import { useMemo } from "react";
import { Label } from "#components/label";
import { Separator } from "#components/separator";
import { cn } from "#lib/utils";

/** Props for the {@link FieldSet} component. */
export type FieldSetProps = React.ComponentProps<"fieldset">;

/** A fieldset that groups related form fields (such as a checkbox or radio group) under a shared legend. */
export const FieldSet = ({ className, ...props }: FieldSetProps) => {
	return (
		<fieldset
			data-slot="field-set"
			className={cn(
				"flex flex-col gap-4",
				"has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link FieldLegend} component. */
export type FieldLegendProps = React.ComponentProps<"legend"> & {
	variant?: "legend" | "label";
};

/** A caption for a {@link FieldSet}, rendered as a `<legend>`. */
export const FieldLegend = ({
	className,
	variant = "legend",
	...props
}: FieldLegendProps) => {
	return (
		<legend
			data-slot="field-legend"
			data-variant={variant}
			className={cn(
				"mb-2 font-medium data-[variant=label]:text-xs/relaxed data-[variant=legend]:text-sm",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link FieldGroup} component. */
export type FieldGroupProps = React.ComponentProps<"div">;

/** A vertical stack of fields, used to group related inputs or checkboxes with consistent spacing. */
export const FieldGroup = ({ className, ...props }: FieldGroupProps) => {
	return (
		<div
			data-slot="field-group"
			className={cn(
				"group/field-group @container/field-group flex w-full flex-col gap-4",
				"data-[slot=checkbox-group]:gap-3",
				"*:data-[slot=field-group]:gap-4",
				className,
			)}
			{...props}
		/>
	);
};

const fieldVariants = cva(
	"group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
	{
		variants: {
			orientation: {
				vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
				horizontal: [
					"flex-row items-center",
					"has-[>[data-slot=field-content]]:items-start",
					"has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
					"*:data-[slot=field-label]:flex-auto",
				],
				responsive: [
					"flex-col",
					"*:w-full [&>.sr-only]:w-auto",
					"@md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto",
					"@md/field-group:has-[>[data-slot=field-content]]:items-start",
					"@md/field-group:*:data-[slot=field-label]:flex-auto",
					"@md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
				],
			},
		},
		defaultVariants: {
			orientation: "vertical",
		},
	},
);

/** Props for the {@link Field} component. */
export type FieldProps = React.ComponentProps<"div"> &
	VariantProps<typeof fieldVariants>;

/** A layout wrapper that associates a label, control, description, and error message for a single form field. */
export const Field = ({
	className,
	orientation = "vertical",
	...props
}: FieldProps) => {
	return (
		<div
			data-slot="field"
			data-orientation={orientation}
			className={cn(fieldVariants({ orientation }), className)}
			{...props}
		/>
	);
};

/** Props for the {@link FieldContent} component. */
export type FieldContentProps = React.ComponentProps<"div">;

/** A wrapper for the label and description side of a horizontally-oriented {@link Field}. */
export const FieldContent = ({ className, ...props }: FieldContentProps) => {
	return (
		<div
			data-slot="field-content"
			className={cn(
				"group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link FieldLabel} component. */
export type FieldLabelProps = React.ComponentProps<typeof Label>;

/** A label rendered for a {@link Field}, visually distinct from a standalone {@link Label}. */
export const FieldLabel = ({ className, ...props }: FieldLabelProps) => {
	return (
		<Label
			data-slot="field-label"
			className={cn(
				"group/field-label peer/field-label flex w-fit gap-2 leading-snug",
				"has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border",
				"has-data-selected:bg-primary/5",
				"*:data-[slot=field]:p-2",
				"group-data-[disabled=true]/field:opacity-50",
				"dark:has-data-selected:bg-primary/10",
				"has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link FieldTitle} component. */
export type FieldTitleProps = React.ComponentProps<"div">;

/** A plain-text heading used to label a {@link Field} when the label is not interactive. */
export const FieldTitle = ({ className, ...props }: FieldTitleProps) => {
	return (
		<div
			data-slot="field-label"
			className={cn(
				"flex w-fit items-center gap-2 font-medium text-xs/relaxed",
				"group-data-[disabled=true]/field:opacity-50",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link FieldDescription} component. */
export type FieldDescriptionProps = React.ComponentProps<"p">;

/** Help text that describes a field, displayed below the control. */
export const FieldDescription = ({
	className,
	...props
}: FieldDescriptionProps) => {
	return (
		<p
			data-slot="field-description"
			className={cn(
				"text-left font-normal text-muted-foreground text-xs/relaxed leading-normal",
				"group-has-data-horizontal/field:text-balance",
				"[[data-variant=legend]+&]:-mt-1.5",
				"nth-last-2:-mt-1 last:mt-0",
				"[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
				className,
			)}
			{...props}
		/>
	);
};

/** Props for the {@link FieldSeparator} component. */
export type FieldSeparatorProps = React.ComponentProps<"div"> & {
	children?: React.ReactNode;
};

/** A horizontal divider with optional centered text, used to split groups of fields. */
export const FieldSeparator = ({
	children,
	className,
	...props
}: FieldSeparatorProps) => {
	return (
		<div
			data-slot="field-separator"
			data-content={!!children}
			className={cn(
				"relative -my-2 h-5 text-xs/relaxed group-data-[variant=outline]/field-group:-mb-2",
				className,
			)}
			{...props}
		>
			<Separator className="absolute inset-0 top-1/2" />
			{children && (
				<span
					className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
					data-slot="field-separator-content"
				>
					{children}
				</span>
			)}
		</div>
	);
};

/** A single validation error entry, compatible with TanStack Form's `field.state.meta.errors`. */
export type FieldErrorItem = { message?: string } | string | undefined;

/** Extracts a human-readable message from an error value (string, `{ message }` object, or any other object). */
export const toErrorMessage = (error: unknown): string | undefined => {
	if (typeof error === "string") {
		return error.length ? error : undefined;
	}

	if (error !== null && typeof error === "object" && "message" in error) {
		const message = (error as { message?: unknown }).message;
		if (typeof message === "string" && message.length) {
			return message;
		}
	}

	if (error === null || error === undefined) {
		return undefined;
	}

	const stringified = String(error);
	return stringified.length ? stringified : undefined;
};

/** Props for the {@link FieldError} component. */
export type FieldErrorProps = React.ComponentProps<"div"> & {
	errors?: Array<FieldErrorItem>;
};

/** Props shared by composed field components: content, validity state, and description/error slot pass-throughs. */
export interface FieldComponentProps {
	/** The label text displayed for the field. */
	label?: string;
	/** Help text displayed below the control. */
	description?: string;
	/** Validation errors to display when the field is invalid. Takes precedence over `errorMessage`. */
	errors?: Array<FieldErrorItem>;
	/** A single error message displayed when the field is invalid. */
	errorMessage?: string;
	/** Whether the control is invalid. */
	isInvalid?: boolean;
	/** Whether a value is required. */
	isRequired?: boolean;
	/** Whether the control is disabled. */
	isDisabled?: boolean;
	/** Whether the control is read-only. */
	isReadOnly?: boolean;
	/** Additional props forwarded to the `FieldDescription` component. */
	descriptionProps?: FieldDescriptionProps;
	/** Additional props forwarded to the `FieldError` component. */
	fieldErrorProps?: FieldErrorProps;
}

/** An error message for a form field, rendered when validation fails. Accepts an `errors` array from a form library such as TanStack Form. */
export const FieldError = ({
	className,
	children,
	errors,
	...props
}: FieldErrorProps) => {
	const content = useMemo(() => {
		if (children) {
			return children;
		}

		if (!errors?.length) {
			return null;
		}

		const uniqueErrors = [
			...new Map(
				errors
					.map((error) => toErrorMessage(error))
					.filter((message): message is string => !!message)
					.map((message) => [message, message] as const),
			).values(),
		];

		if (uniqueErrors.length === 1) {
			return uniqueErrors[0];
		}

		return (
			<ul className="ml-4 flex list-disc flex-col gap-1">
				{uniqueErrors.map((message) => (
					<li key={message}>{message}</li>
				))}
			</ul>
		);
	}, [children, errors]);

	if (!content) {
		return null;
	}

	return (
		<div
			role="alert"
			data-slot="field-error"
			className={cn("font-normal text-destructive text-xs/relaxed", className)}
			{...props}
		>
			{content}
		</div>
	);
};

/** Builds an `aria-describedby` value from the description and error element ids. */
export const getFieldDescribedBy = (
	hasDescription: boolean,
	descriptionId: string,
	showError: boolean,
	errorId: string,
) => {
	const ids = [hasDescription && descriptionId, showError && errorId].filter(
		Boolean,
	);
	return ids.length ? ids.join(" ") : undefined;
};
