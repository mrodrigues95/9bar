import { X } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "@9bar/toolkit/components";

/**
 * Throwaway dialog frame for the recipe-modal variants only. It renders an
 * open modal over a dimmed fake page so the direction reads in the gallery.
 * Not a toolkit candidate — it dies with the variants.
 */
export const RecipeModalShell = ({
	labelledBy,
	children,
}: {
	labelledBy: string;
	children: ReactNode;
}) => {
	return (
		<div className="relative flex min-h-[680px] items-center justify-center overflow-hidden rounded-lg bg-muted p-4 sm:p-10">
			<div aria-hidden="true" className="absolute inset-0 flex flex-col gap-2 p-6 opacity-60">
				<div className="h-6 w-40 rounded bg-muted-foreground/20" />
				<div className="h-4 w-64 rounded bg-muted-foreground/15" />
				<div className="mt-2 h-10 w-full rounded bg-muted-foreground/10" />
				<div className="h-10 w-full rounded bg-muted-foreground/10" />
				<div className="h-10 w-full rounded bg-muted-foreground/10" />
			</div>
			<div aria-hidden="true" className="absolute inset-0 bg-black/45" />
			<dialog
				open
				aria-labelledby={labelledBy}
				className="relative z-10 max-h-[620px] w-full max-w-2xl overflow-y-auto rounded-xl bg-card p-5 text-card-foreground shadow-xl ring-1 ring-foreground/10"
			>
				<IconButton
					aria-label="Close recipe details"
					size="sm"
					variant="ghost"
					className="absolute top-3 right-3"
				>
					<X aria-hidden="true" />
				</IconButton>
				{children}
			</dialog>
		</div>
	);
};
