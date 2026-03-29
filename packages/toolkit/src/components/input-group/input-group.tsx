import type { ComponentProps } from "react";
import {
	Group as AriaGroup,
	type GroupProps as AriaGroupProps,
	Input as AriaInput,
	type InputProps as AriaInputProps,
	composeRenderProps,
	InputContext,
	Provider,
	SelectContext,
} from "react-aria-components";
import { cn, tv, type VariantProps } from "tailwind-variants";
import {
	inputContainer,
	inputDensity,
	inputDisabled,
	inputFocusRing,
	inputText,
} from "../field/input";

const inputGroupVariants = tv({
	slots: {
		root: [
			inputFocusRing({ variant: "focusWithin" }),
			inputDisabled(),
			inputContainer(),
			"flex items-center gap-1",
			"has-[[data-slot$=addon]_[data-focused]]:ring-0",
			"not-data-[invalid]:has-[[data-slot$=addon]_[data-focused]]:border-border",
		],
		input: [
			inputText(),
			"min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none outline-none ring-0",
		],
		text: "line-clamp-1 whitespace-nowrap text-muted text-sm",
	},
	variants: {
		density: {
			loose: { root: inputDensity({ density: "loose" }) },
			compact: { root: inputDensity({ density: "compact" }) },
		},
	},
	defaultVariants: {
		density: "loose",
	},
});

export interface InputGroupProps
	extends AriaGroupProps,
		VariantProps<typeof inputGroupVariants> {}

/** A container that groups an input with addons such as icons, text, or inline selects into a single composite field. */
export const InputGroup = ({ density, ...props }: InputGroupProps) => {
	const styles = inputGroupVariants({ density });
	return (
		<AriaGroup
			data-slot="input-group"
			{...props}
			className={composeRenderProps(props.className, (className) =>
				styles.root({ className }),
			)}
		>
			{composeRenderProps(
				props.children,
				(children, { isDisabled, isInvalid }) => (
					<Provider
						values={[
							[InputContext, { disabled: isDisabled }],
							[SelectContext, { isInvalid }],
						]}
					>
						{children}
					</Provider>
				),
			)}
		</AriaGroup>
	);
};

export interface InputGroupInputProps extends AriaInputProps {}

/** The text input rendered inside an {@link InputGroup}. */
export const InputGroupInput = (props: InputGroupInputProps) => {
	const styles = inputGroupVariants();
	return (
		<AriaInput
			data-slot="input-group-input"
			{...props}
			className={composeRenderProps(props.className, (className) =>
				styles.input({ className }),
			)}
		/>
	);
};

const inputGroupAddonVariants = tv({
	base: [
		"flex h-auto shrink-0 select-none items-center justify-center",
		"[&_svg:not([class*='size-'])]:size-4",
	],
	variants: {
		align: {
			start: "has-[[data-slot^=select],[data-slot^=button]]:-ml-0.5",
			end: "has-[[data-slot^=select],[data-slot^=button]]:-mr-0.5",
		},
	},
	defaultVariants: {
		align: "start",
	},
});

export interface InputGroupAddonProps
	extends ComponentProps<"div">,
		VariantProps<typeof inputGroupAddonVariants> {}

/** A slot for supplementary content (icons, buttons, or inline selects) placed at the start or end of an {@link InputGroup}. */
export const InputGroupAddon = ({
	align = "start",
	...props
}: InputGroupAddonProps) => {
	return (
		<div
			data-slot="input-group-addon"
			role="none"
			{...props}
			onMouseDown={(e) => {
				const target = e.target as HTMLElement;
				const isInteractive = target.closest(
					[
						"button",
						"a",
						"input",
						"select",
						"textarea",
						"[role='button']",
						"[role='combobox']",
						"[role='listbox']",
						"[data-slot='select-trigger']",
					].join(","),
				);
				if (isInteractive) {
					return;
				}

				e.preventDefault();
				const parent = e.currentTarget.parentElement;
				const input = parent?.querySelector<
					HTMLInputElement | HTMLTextAreaElement
				>("input, textarea");
				if (input && !parent?.querySelector("input:focus, textarea:focus")) {
					input.focus();
				}
			}}
			className={inputGroupAddonVariants({ align, className: props.className })}
		/>
	);
};

export interface InputGroupTextProps extends ComponentProps<"span"> {}

/** A short inline text label (e.g. a currency symbol or unit) displayed inside an {@link InputGroupAddon}. */
export const InputGroupText = (props: InputGroupTextProps) => {
	const styles = inputGroupVariants();
	return (
		<span
			data-slot="input-group-text"
			{...props}
			className={cn(styles.text(), props.className) ?? ""}
		/>
	);
};
