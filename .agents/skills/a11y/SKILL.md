---
name: a11y
description: Accessibility judgment for building UI in this repo on top of React Aria Components. Use when creating or reviewing UI, interactive elements, form fields, or components; when choosing accessible names, labels, landmarks, or live regions; or when wiring ARIA by hand for a compound field. Axe runs on every story (`pnpm test`) and on app pages (`pnpm control web a11y`), so this skill covers what axe cannot judge.
---

# Accessibility

[React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html) is the foundation. Axe fails a story test on any violation it can detect (`a11y.test: "error"`), and `pnpm control <target> a11y` audits a live page. These rules cover what a machine can't check.

## Principles

- **Lean on React Aria.** Don't add ARIA roles, states, or keyboard handlers it already provides, and don't override its keyboard patterns. For custom widgets, follow the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/).
- **Names make sense out of context.** A button that reads "Edit" in a row of recipes gets `aria-label="Edit recipe"` or names the row ("Actions for House Espresso").
- **Every form field has a visible label.** Toolkit form fields take `label`; pass one even though the type allows leaving it out. Put help text in the field's description so it is linked through `aria-describedby`.
- **Hide what is decorative, label what carries meaning.** lucide icons are `aria-hidden` by default; an icon that is the only content of a control needs the control's `aria-label`. Layout-only wrappers get `role="presentation"`.
- **Color is never the only signal.** Pair it with text, an icon, or a pattern (verdict badges carry their label).
- **Use semantic elements** (`button`, `a`, `nav`, `main`, `header`, `fieldset`) over generic `div`s.

## Compound fields

When a field doesn't map to one React Aria field context (e.g. `InputGroupSelectField`), wire it by hand: `useId()` for stable ids, `aria-labelledby` on the group pointing at the visible label, `aria-describedby` for description and error.

## Grouped content

- `fieldset` + `legend` for related fields. If a visible heading already names the group, make the `legend` `sr-only` and the heading `aria-hidden="true"`.
- Give `Alert` an `aria-labelledby` when it has a title element.

## Announcements and structure

- `Alert` is `role="alert"` (assertive): use it for errors that need attention now.
- Status updates and confirmations ("Logged at 8:50 PM") go in a polite live region (`<output>` or `aria-live="polite"`).
- One `main` per page, a labelled `nav` for each navigation (unique labels when there are several), `aria-current="page"` on the active link (toolkit `Link`, breadcrumb, and pagination support it).
- Focus follows the spec's Feedback rules after save, delete, and validation (`research/recipes-and-logs-flows.md#feedback`); verify it with `focused` in `pnpm control` output.
