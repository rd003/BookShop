import { dayToStartOfDayUTC, dayToEndOfDayUTC } from "./storeTime";

export interface DateRange {
    from?: Date;
    to?: Date;
}

/** Produces the query params object the backend expects. */
export function dateRangeToQuery(range: DateRange): {
    startingOrderDate?: string;
    endingOrderDate?: string;
} {
    const params: { startingOrderDate?: string; endingOrderDate?: string } = {};
    if (range.from) params.startingOrderDate = dayToStartOfDayUTC(range.from);
    if (range.to) params.endingOrderDate = dayToEndOfDayUTC(range.to);
    return params;
}