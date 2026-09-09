import type { ReactNode } from "react";

/**
 * Shared canvas behind every variant. Keeps the gallery preview, compare
 * cards, and isolated view rendering the identical background so a variant
 * never blends into the page chrome in one view but not another.
 */
export const VariantFrame = ({ children }: { children: ReactNode }) => {
	return <div className="rounded-md border border-border bg-white px-4 py-2">{children}</div>;
};
