/** A selected interval. `to` is missing while only the start was picked. */
export type DateRange = { from?: Date; to?: Date };

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
export const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
export const addDays = (d: Date, n: number) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Moves by whole months, keeping the day when it exists (Jan 31 + 1 month = Feb 28/29). */
export function addMonths(d: Date, n: number): Date {
    const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
    const lastDay = endOfMonth(target).getDate();
    return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay));
}

export const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const dayValue = (d: Date) => startOfDay(d).getTime();
export const isBeforeDay = (a: Date, b: Date) => dayValue(a) < dayValue(b);
export const isAfterDay = (a: Date, b: Date) => dayValue(a) > dayValue(b);

export function clampDay(d: Date, min?: Date, max?: Date): Date {
    if (min && isBeforeDay(d, min)) return startOfDay(min);
    if (max && isAfterDay(d, max)) return startOfDay(max);
    return d;
}

/** The weeks that cover a month, as arrays of 7 days starting on `weekStartsOn` (0 = Sunday). */
export function monthWeeks(month: Date, weekStartsOn: number): Date[][] {
    const first = startOfMonth(month);
    const offset = (first.getDay() - weekStartsOn + 7) % 7;
    const count = Math.ceil((offset + endOfMonth(month).getDate()) / 7);
    return Array.from({ length: count }, (_, week) =>
        Array.from({ length: 7 }, (_, day) => addDays(first, week * 7 + day - offset)),
    );
}

const pad = (n: number) => String(n).padStart(2, "0");

/** `yyyy-mm-dd` in local time, the format forms expect. */
export const toISODate = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const toISODateTime = (d: Date) =>
    `${toISODate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const formatDay = (d: Date, locale: string) =>
    new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(
        d,
    );

/** "mm/dd/yyyy", "dd/mm/yyyy"... in the order and separators of the locale. */
export function datePlaceholder(locale: string): string {
    return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" })
        .formatToParts(new Date(2000, 0, 1))
        .map((part) => {
            if (part.type === "day") return "dd";
            if (part.type === "month") return "mm";
            if (part.type === "year") return "yyyy";
            return part.value;
        })
        .join("");
}

export const monthTitle = (d: Date, locale: string) =>
    new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(d);

export const fullDayLabel = (d: Date, locale: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(d);

/** Short weekday names starting on `weekStartsOn`. */
export function weekdayNames(locale: string, weekStartsOn: number): string[] {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    // 2024-01-07 is a Sunday.
    return Array.from({ length: 7 }, (_, i) =>
        fmt.format(new Date(2024, 0, 7 + ((i + weekStartsOn) % 7))),
    );
}

/** "HH:mm" (24h) -> hours and minutes, or undefined when it is not a valid time. */
export function parseTime(value?: string): { h: number; m: number } | undefined {
    const match = value?.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return undefined;
    const h = Number(match[1]);
    const m = Number(match[2]);
    return h < 24 && m < 60 ? { h, m } : undefined;
}

export const toTimeString = (h: number, m: number) => `${pad(h)}:${pad(m)}`;

/** "14:05" or "2:05 PM". */
export function formatTime(h: number, m: number, hour12: boolean, labels = { am: "AM", pm: "PM" }) {
    if (!hour12) return toTimeString(h, m);
    return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? labels.pm : labels.am}`;
}
