const DEFAULT_LOCALE =
    typeof navigator !== "undefined" ? navigator.language : undefined;

const toDate = (input: string | Date | null | undefined): Date | null => {
    if (input == null) return null;
    if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : input;

    // Truncate .NET's 7-digit fractional seconds to 3 (ms) if present
    const normalized = input.replace(/(\.\d{3})\d+/, "$1");

    const d = new Date(normalized);
    return Number.isNaN(d.getTime()) ? null : d;
};

export function formatCurrency(amount: number, currency = "INR") {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount);
}

/** "3 September 2026 at 10:52 am" — full date + time, local TZ */
export function formatDateTime(input: string | Date | null | undefined, fallback = "—") {
    const d = toDate(input);
    if (!d) return fallback;
    return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
        dateStyle: "long",
        timeStyle: "short",
    }).format(d);
}

/** "3 Sep 2026, 10:52 am" — compact date + time, local TZ */
export function formatDateTimeShort(input: string | Date | null | undefined, fallback = "—") {
    const d = toDate(input);
    if (!d) return fallback;
    return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(d);
}

/** "3 Sep 2026" — date only */
export function formatDateShort(input: string | Date | null | undefined, fallback = "—") {
    const d = toDate(input);
    if (!d) return fallback;
    return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(d);
}

/** "3 September 2026" — date only, long form */
export function formatDateLong(input: string | Date | null | undefined, fallback = "—") {
    const d = toDate(input);
    if (!d) return fallback;
    return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(d);
}