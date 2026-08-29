import { Gauge, MoreHorizontal } from "lucide-react";
import { DialogTrigger } from "react-aria-components";
import {
	Button,
	IconButton,
	Listbox,
	ListboxItem,
	Menu,
	MenuGroup,
	MenuItem,
	MenuLabel,
	MenuSeparator,
	MenuShortcut,
	MenuTrigger,
	Popover,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	Select,
	SelectContent,
	SelectItem,
	SelectList,
	SelectTrigger,
	SelectValue,
	Text,
} from "../../components";

/** A recipe row action trigger with its menu, opened and closed by interaction. */
const MenuDemo = () => (
	<div className="flex flex-col items-start gap-3">
		<Text variant="label" color="secondary">
			Menu
		</Text>
		<MenuTrigger>
			<Button variant="outline" size="sm">
				<MoreHorizontal />
				Actions
			</Button>
			<Menu>
				<MenuLabel>Shot actions</MenuLabel>
				<MenuGroup>
					<MenuItem onAction={() => {}}>
						Log shot
						<MenuShortcut>⌘L</MenuShortcut>
					</MenuItem>
					<MenuItem onAction={() => {}}>
						Edit recipe
						<MenuShortcut>⌘E</MenuShortcut>
					</MenuItem>
				</MenuGroup>
				<MenuSeparator />
				<MenuItem variant="destructive" onAction={() => {}}>
					Delete recipe
					<MenuShortcut>⌫</MenuShortcut>
				</MenuItem>
			</Menu>
		</MenuTrigger>
	</div>
);

/** A brew-parameters popover anchored to an icon button trigger. */
const PopoverDemo = () => (
	<div className="flex flex-col items-start gap-3">
		<Text variant="label" color="secondary">
			Popover
		</Text>
		<DialogTrigger>
			<IconButton aria-label="Brew parameters" variant="outline">
				<Gauge />
			</IconButton>
			<Popover>
				<PopoverHeader>
					<PopoverTitle>Last shot</PopoverTitle>
					<PopoverDescription>Measured 12 minutes ago</PopoverDescription>
				</PopoverHeader>
				<div className="flex flex-col gap-1 px-4 pb-4 text-sm">
					<span>Dose: 18 g</span>
					<span>Yield: 36 g</span>
					<span>Time: 28 s</span>
					<span>Temp: 93 °C</span>
				</div>
			</Popover>
		</DialogTrigger>
	</div>
);

/** A select over grind-size options, with a selected value shown in the trigger. */
const SelectDemo = () => (
	<div className="flex flex-col items-start gap-3">
		<Text variant="label" color="secondary">
			Select
		</Text>
		<Select aria-label="Grind size" defaultSelectedKey="fine">
			<SelectTrigger className="w-44">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectList>
					<SelectItem id="extra-fine">Extra fine</SelectItem>
					<SelectItem id="fine">Fine</SelectItem>
					<SelectItem id="medium-fine">Medium fine</SelectItem>
					<SelectItem id="medium">Medium</SelectItem>
					<SelectItem id="coarse">Coarse</SelectItem>
				</SelectList>
			</SelectContent>
		</Select>
	</div>
);

/** A multi-selection listbox for tagging flavor notes. */
const ListboxDemo = () => (
	<div className="flex flex-col items-start gap-3">
		<Text variant="label" color="secondary">
			Listbox
		</Text>
		<Listbox
			aria-label="Flavor notes"
			selectionMode="multiple"
			defaultSelectedKeys={["chocolate", "caramel"]}
			className="w-44"
		>
			<ListboxItem id="chocolate">Chocolate</ListboxItem>
			<ListboxItem id="caramel">Caramel</ListboxItem>
			<ListboxItem id="citrus">Citrus</ListboxItem>
			<ListboxItem id="floral">Floral</ListboxItem>
			<ListboxItem id="berry">Berry</ListboxItem>
		</Listbox>
	</div>
);

/**
 * Overlay components rendered as their triggers — menus, popovers, and selects
 * open and close through normal interaction, the way consumers use them.
 *
 * Overlays are intentionally not forced open here: pre-opened React Aria
 * overlays render a modal underlay that blocks interaction with the whole
 * canvas. Review open-state surfaces (popover chrome, menu highlights, etc.)
 * by opening them, or in each component's own stories.
 */
export const OverlaySection = () => (
	<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
		<MenuDemo />
		<PopoverDemo />
		<SelectDemo />
		<ListboxDemo />
	</div>
);
