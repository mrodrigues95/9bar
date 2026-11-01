import { EllipsisVertical, type LucideIcon } from "lucide-react";
import { Fragment } from "react";
import { IconButton, Menu, MenuItem, MenuSeparator, MenuTrigger } from "@9bar/toolkit/components";
import { MenuItemLink } from "../../../components";

type ActionsMenuItemLink =
	| { to: "/recipes/$recipeId/edit"; params: { recipeId: string } }
	| { to: "/recipes/logs/$logId/edit"; params: { logId: string }; search: true }
	| { to: "/recipes/logs/$logId/repeat"; params: { logId: string }; search: true };

export type ActionsMenuItem = {
	id: string;
	label: string;
	icon: LucideIcon;
	section?: "danger";
} & ({ kind: "link"; link: ActionsMenuItemLink } | { kind: "action"; onAction: () => void });

interface ActionsMenuProps {
	label: string;
	items: Array<ActionsMenuItem>;
}

export const ActionsMenu = ({ label, items }: ActionsMenuProps) => {
	return (
		<MenuTrigger>
			<IconButton aria-label={label} size="sm" variant="ghost">
				<EllipsisVertical />
			</IconButton>
			<Menu aria-label={label} placement="bottom end" width="content">
				{items.map((item, index) => (
					<Fragment key={item.id}>
						{index > 0 && item.section === "danger" && <MenuSeparator />}
						{item.kind === "link" ? (
							<MenuItemLink {...item.link} textValue={item.label}>
								<item.icon />
								{item.label}
							</MenuItemLink>
						) : (
							<MenuItem onAction={item.onAction} textValue={item.label}>
								<item.icon />
								{item.label}
							</MenuItem>
						)}
					</Fragment>
				))}
			</Menu>
		</MenuTrigger>
	);
};
