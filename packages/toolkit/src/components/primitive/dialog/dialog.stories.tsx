import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button";
import {
	Dialog,
	DialogCloseButton,
	DialogCloseIconButton,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

const meta = {
	component: Dialog,
	title: "Primitives/Dialog",
	parameters: {
		controls: {
			include: ["isDismissable", "isKeyboardDismissDisabled"],
		},
		docs: {
			controls: {
				include: ["isDismissable", "isKeyboardDismissDisabled"],
			},
			argTypes: {
				include: ["isDismissable", "isKeyboardDismissDisabled"],
			},
		},
	},
	argTypes: {
		isDismissable: { control: { type: "boolean" } },
		isKeyboardDismissDisabled: { control: { type: "boolean" } },
	},
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof Dialog>;

/** A dialog opened from a trigger button, with a title, description, and close button. */
export const Default: Story = {
	render: (props) => (
		<DialogTrigger>
			<Button variant="outline">Log a shot</Button>
			<Dialog {...props}>
				<DialogHeader>
					<DialogTitle>Log a shot</DialogTitle>
					<DialogDescription>
						Record the details of this shot. A recipe is optional.
					</DialogDescription>
					<DialogCloseIconButton />
				</DialogHeader>
			</Dialog>
		</DialogTrigger>
	),
};

/** A confirmation dialog with cancel and destructive footer actions. */
export const WithFooterActions: Story = {
	render: (props) => (
		<DialogTrigger>
			<Button variant="outline">Delete shot</Button>
			<Dialog {...props}>
				<DialogHeader>
					<DialogTitle>Delete this shot?</DialogTitle>
					<DialogDescription>
						This permanently removes the shot from your brew log.
					</DialogDescription>
					<DialogCloseIconButton />
				</DialogHeader>
				<DialogFooter>
					<DialogCloseButton>Cancel</DialogCloseButton>
					<Button variant="destructive">Delete</Button>
				</DialogFooter>
			</Dialog>
		</DialogTrigger>
	),
};

/** A dialog that stays open until a footer action closes it, so it omits the close button. */
export const NonDismissable: Story = {
	args: { isDismissable: false },
	render: (props) => (
		<DialogTrigger>
			<Button variant="outline">Finish brew</Button>
			<Dialog {...props}>
				<DialogHeader>
					<DialogTitle>Finish this brew?</DialogTitle>
					<DialogDescription>
						Finishing locks the recipe and starts a new brew session.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogCloseButton>Not yet</DialogCloseButton>
					<Button>Finish brew</Button>
				</DialogFooter>
			</Dialog>
		</DialogTrigger>
	),
};

/** Long dialog content scrolls inside the dialog surface instead of overflowing the viewport. */
export const ScrollingContent: Story = {
	render: (props) => (
		<DialogTrigger>
			<Button variant="outline">Read brew notes</Button>
			<Dialog {...props} className="max-h-[85vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Brew notes</DialogTitle>
					<DialogDescription>Everything recorded for this shot.</DialogDescription>
					<DialogCloseIconButton />
				</DialogHeader>
				<div className="flex flex-col gap-2 text-xs/relaxed">
					{Array.from({ length: 14 }, (_, index) => (
						<p key={index}>
							Step {index + 1}: keep the puck level, tamp straight, and watch the pressure ramp
							settle before the first drops.
						</p>
					))}
				</div>
			</Dialog>
		</DialogTrigger>
	),
};

/**
 * A sticky footer for tall content: only the body between the header and the
 * footer scrolls, so the actions stay visible while the content scrolls under
 * them. Give the body a capped height and the overflow.
 */
export const StickyFooter: Story = {
	render: (props) => (
		<DialogTrigger>
			<Button variant="outline">Log a shot</Button>
			<Dialog {...props}>
				<DialogHeader>
					<DialogTitle>Log a shot</DialogTitle>
					<DialogDescription>Record the details of this shot.</DialogDescription>
					<DialogCloseIconButton />
				</DialogHeader>
				<div className="-mx-4 flex max-h-[50vh] flex-col gap-2 overflow-y-auto px-4 text-xs/relaxed">
					{Array.from({ length: 14 }, (_, index) => (
						<p key={index}>
							Step {index + 1}: keep the puck level, tamp straight, and watch the pressure ramp
							settle before the first drops.
						</p>
					))}
				</div>
				<DialogFooter>
					<DialogCloseButton>Cancel</DialogCloseButton>
					<Button>Save shot</Button>
				</DialogFooter>
			</Dialog>
		</DialogTrigger>
	),
};
