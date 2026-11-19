import type { Page } from "playwright-core";
import { booleanFlag, numberFlag, stringFlag } from "./flags.ts";
import { fail } from "./output.ts";
import type { Flags } from "./types.ts";

type AriaRole = Parameters<Page["getByRole"]>[0];

const ariaRoles = [
	"alert",
	"alertdialog",
	"application",
	"article",
	"banner",
	"blockquote",
	"button",
	"caption",
	"cell",
	"checkbox",
	"code",
	"columnheader",
	"combobox",
	"complementary",
	"contentinfo",
	"definition",
	"deletion",
	"dialog",
	"directory",
	"document",
	"emphasis",
	"feed",
	"figure",
	"form",
	"generic",
	"grid",
	"gridcell",
	"group",
	"heading",
	"img",
	"insertion",
	"link",
	"list",
	"listbox",
	"listitem",
	"log",
	"main",
	"marquee",
	"math",
	"meter",
	"menu",
	"menubar",
	"menuitem",
	"menuitemcheckbox",
	"menuitemradio",
	"navigation",
	"none",
	"note",
	"option",
	"paragraph",
	"presentation",
	"progressbar",
	"radio",
	"radiogroup",
	"region",
	"row",
	"rowgroup",
	"rowheader",
	"scrollbar",
	"search",
	"searchbox",
	"separator",
	"slider",
	"spinbutton",
	"status",
	"strong",
	"subscript",
	"superscript",
	"switch",
	"tab",
	"table",
	"tablist",
	"tabpanel",
	"term",
	"textbox",
	"time",
	"timer",
	"toolbar",
	"tooltip",
	"tree",
	"treegrid",
	"treeitem",
] as const satisfies ReadonlyArray<AriaRole>;

const toAriaRole = (role: string) => {
	const match = ariaRoles.find((candidate) => candidate === role);
	if (match === undefined) {
		return fail(
			`Unknown ARIA role "${role}".`,
			"Use a role from `snapshot` output, e.g. button, link, textbox, combobox.",
		);
	}
	return match;
};

const describeLocator = (flags: Flags) =>
	["role", "name", "label", "text", "placeholder", "testid", "selector"]
		.map((name) => [name, stringFlag(flags, name)] as const)
		.filter(([, value]) => value !== undefined)
		.map(([name, value]) => `${name}=${JSON.stringify(value)}`)
		.join(" ");

export const buildLocator = (page: Page, flags: Flags) => {
	const exact = booleanFlag(flags, "exact");
	const role = stringFlag(flags, "role");
	const name = stringFlag(flags, "name");
	const label = stringFlag(flags, "label");
	const text = stringFlag(flags, "text");
	const placeholder = stringFlag(flags, "placeholder");
	const testid = stringFlag(flags, "testid");
	const selector = stringFlag(flags, "selector");
	if (role !== undefined) {
		return page.getByRole(toAriaRole(role), name === undefined ? {} : { name, exact });
	}
	if (label !== undefined) {
		return page.getByLabel(label, { exact });
	}
	if (text !== undefined) {
		return page.getByText(text, { exact });
	}
	if (placeholder !== undefined) {
		return page.getByPlaceholder(placeholder, { exact });
	}
	if (testid !== undefined) {
		return page.getByTestId(testid);
	}
	if (selector !== undefined) {
		return page.locator(selector);
	}
	return undefined;
};

export const hasLocator = (flags: Flags) => describeLocator(flags) !== "";

export const resolveLocator = async (page: Page, flags: Flags, target: string) => {
	const locator = buildLocator(page, flags);
	if (locator === undefined) {
		return fail(
			"No element given.",
			"Pass --role with --name (preferred), or --label, --text, --placeholder, --testid, --selector.",
		);
	}
	const description = describeLocator(flags);
	const timeout = numberFlag(flags, "timeout") ?? 5000;
	try {
		await locator.first().waitFor({ state: "attached", timeout });
	} catch {
		return fail(
			`No element matches ${description} after ${timeout}ms.`,
			`Run \`pnpm control ${target} snapshot\` to list roles and accessible names on the page.`,
		);
	}
	const count = await locator.count();
	const nth = numberFlag(flags, "nth");
	if (nth !== undefined) {
		if (nth >= count) {
			return fail(
				`--nth ${nth} is out of range: ${count} element(s) match ${description}.`,
				"Pick an index below the match count.",
			);
		}
		return { locator: locator.nth(nth), description: `${description} nth=${nth}` };
	}
	if (count > 1) {
		return fail(
			`${count} elements match ${description}.`,
			"Add --exact, a more specific --name, or --nth <index>.",
		);
	}
	return { locator, description };
};
