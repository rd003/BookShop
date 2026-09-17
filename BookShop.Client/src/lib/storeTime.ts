/**
 * The user's timezone as reported by the browser.
 * e.g. "Asia/Kolkata", "America/New_York", "Europe/London"
 * Falls back to UTC if the runtime doesn't expose it.
 */
export const USER_TIME_ZONE =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

/**
 * Given a Date picked from a calendar (which represents a local calendar day),
 * return the UTC ISO string for the START of that day in the user's timezone.
 *
 * Example (Asia/Kolkata):
 *   picked: 2026-09-03 (local midnight)
 *   returns: "2026-09-02T18:30:00.000Z"   // = 2026-09-03 00:00 IST
 */
export function dayToStartOfDayUTC(day: Date): string {
    const { year, month, day: d } = getLocalYMD(day);
    return zonedMidnightToUTCISO(year, month, d, USER_TIME_ZONE);
}

/**
 * Return the UTC ISO string for the END of the picked local day (23:59:59.999 local).
 * We send this inclusive-end value so the backend's `<=` comparison works.
 *
 * Example (Asia/Kolkata):
 *   picked: 2026-09-03
 *   returns: "2026-09-03T18:29:59.999Z"   // = 2026-09-03 23:59:59.999 IST
 */
export function dayToEndOfDayUTC(day: Date): string {
    const { year, month, day: d } = getLocalYMD(day);
    return zonedEndOfDayToUTCISO(year, month, d, USER_TIME_ZONE);
}

/* ---------------- internals ---------------- */

function getLocalYMD(day: Date) {
    return {
        year: day.getFullYear(),
        month: day.getMonth() + 1, // 1-12
        day: day.getDate(),        // 1-31
    };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Compute the UTC instant corresponding to `YYYY-MM-DD 00:00:00.000` in `timeZone`,
 * and return it as an ISO string ending in Z.
 *
 * Technique: guess a UTC moment, ask Intl what wall-clock time that instant
 * represents in `timeZone`, and use the difference to correct the guess.
 */
function zonedMidnightToUTCISO(
    year: number,
    month: number,
    day: number,
    timeZone: string
): string {
    return zonedWallClockToUTCISO(year, month, day, 0, 0, 0, 0, timeZone);
}

function zonedEndOfDayToUTCISO(
    year: number,
    month: number,
    day: number,
    timeZone: string
): string {
    return zonedWallClockToUTCISO(year, month, day, 23, 59, 59, 999, timeZone);
}

/**
 * Given a wall-clock time in `timeZone`, return the corresponding UTC instant as ISO.
 *
 * The trick: `Date.UTC(year, month, day, h, m, s, ms)` gives us the instant as if
 * the wall-clock were UTC. We then ask Intl what wall-clock *that same instant*
 * represents in `timeZone`. The difference tells us the timezone offset at that moment,
 * which we subtract to get the true UTC instant.
 */
function zonedWallClockToUTCISO(
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    ms: number,
    timeZone: string
): string {
    // Instant treating wall-clock as if it were UTC
    const fakeUTC = Date.UTC(year, month - 1, day, hour, minute, second, ms);

    // What does that instant look like in the target timezone?
    const wallClockInTZ = getWallClockParts(new Date(fakeUTC), timeZone);

    // Reconstruct that wall-clock as a UTC instant
    const wallClockAsUTC = Date.UTC(
        wallClockInTZ.year,
        wallClockInTZ.month - 1,
        wallClockInTZ.day,
        wallClockInTZ.hour,
        wallClockInTZ.minute,
        wallClockInTZ.second,
        wallClockInTZ.ms
    );

    // offset = (what we asked for as UTC) - (what the TZ thought it was)
    const offset = fakeUTC - wallClockAsUTC;

    const realUTC = fakeUTC + offset;
    return new Date(realUTC).toISOString();
}

function getWallClockParts(date: Date, timeZone: string) {
    const fmt = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
    });

    const parts = fmt.formatToParts(date);
    const get = (type: Intl.DateTimeFormatPartTypes) =>
        Number(parts.find((p) => p.type === type)?.value ?? 0);

    return {
        year: get("year"),
        month: get("month"),
        day: get("day"),
        hour: get("hour"),
        minute: get("minute"),
        second: get("second"),
        ms: get("fractionalSecond"),
    };
}