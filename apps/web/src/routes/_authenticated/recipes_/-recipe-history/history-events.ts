import {
	BREW_FIELDS,
	formatBrewField,
	isSameBrewField,
	type BrewField,
} from "../../../../utils/brew-fields";
import { getRecipeSnapshots } from "../../../../utils/data";

interface HistoryChange {
	field: BrewField;
	previous: string;
	next: string;
}

export interface HistoryEvent {
	id: number;
	dateTime: string;
	changes: Array<HistoryChange>;
}

/**
 * Groups each recipe save's setting changes into newest-first events. Saves with no
 * tracked field changes (e.g. notes-only edits) produce no event.
 */
export const getRecipeHistoryEvents = (recipeId: number) => {
	const snapshots = getRecipeSnapshots(recipeId);
	const events: Array<HistoryEvent> = [];

	for (let index = 0; index < snapshots.length - 1; index += 1) {
		const next = snapshots[index];
		const previous = snapshots[index + 1];
		if (!next || !previous) {
			continue;
		}
		const changes: Array<HistoryChange> = [];
		for (const field of BREW_FIELDS) {
			if (isSameBrewField(previous, next, field)) {
				continue;
			}
			changes.push({
				field,
				previous: formatBrewField(previous, field),
				next: formatBrewField(next, field),
			});
		}
		if (changes.length === 0) {
			continue;
		}
		events.push({ id: next.id, dateTime: next.createdAt, changes });
	}

	return events;
};
