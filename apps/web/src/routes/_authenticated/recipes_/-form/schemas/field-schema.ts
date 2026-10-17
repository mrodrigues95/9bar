import { fromDateToLocal, toCalendarDateTime } from "@internationalized/date";
import z from "zod";
import type { TInputGroupSelectFieldValue } from "@9bar/toolkit/components/composed";
import type { TBrewSnapshot, TMethod } from "../../../../../utils/data";

export interface TBasicInformationFields {
	method: TMethod;
	beans: string;
	grinder: string;
	machine: string;
}

export interface TBrewParametersFields {
	grindSize: string;
	dose: number;
	yield: number;
	brewTime: TInputGroupSelectFieldValue<number, "s" | "m">;
	temperature: TInputGroupSelectFieldValue<number, "C" | "F">;
	pressure: number;
}

export interface TAdditionalDetailsFields {
	notes: string;
}

export type TBrewFormFields = TBasicInformationFields &
	TBrewParametersFields &
	TAdditionalDetailsFields;

/**
 * Coerces a string (from an HTML input) to a number while preserving the `number`
 * input type for StandardSchema compatibility.
 */
export const coercedNumber = (checks: (n: z.ZodNumber) => z.ZodNumber = (n) => n) =>
	z.pipe(
		z.transform<number, number>((val) => Number(val)),
		checks(z.number()),
	);

export const inputGroupSelectValue = <const T extends readonly [string, ...Array<string>]>(
	selectValue: T,
	message: string,
) =>
	z
		.object({
			inputValue: coercedNumber(),
			selectValue: z.enum(selectValue),
		})
		.refine(({ inputValue }) => inputValue >= 0, { message });

export const toFormDateTime = (date: Date) => {
	return toCalendarDateTime(fromDateToLocal(date)).set({ millisecond: 0 });
};

export const nowAsCalendarDateTime = () => {
	return toFormDateTime(new Date());
};

export const snapshotToFormFields = (snapshot: TBrewSnapshot): TBrewFormFields => {
	return {
		method: snapshot.method,
		beans: snapshot.beans,
		grinder: snapshot.grinder,
		machine: snapshot.machine,
		grindSize: snapshot.grindSize,
		dose: snapshot.dose,
		yield: snapshot.yield,
		brewTime: {
			inputValue: snapshot.brewTime,
			selectValue: snapshot.brewTimeUnit,
		},
		temperature: {
			inputValue: snapshot.temperature,
			selectValue: snapshot.temperatureUnit,
		},
		pressure: snapshot.pressure,
		notes: snapshot.notes ?? "",
	};
};
