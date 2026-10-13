"use client";

import { useState } from "react";

import { makeT } from "@/data/samples";
import { htmlLang, type Locale } from "@/i18n/config";

// A month grid with its own navigation: used by the Calendar app and by the clock's panel.
export function MonthCalendar({
    locale,
    picked,
    onPick,
    compact = false,
}: {
    locale: Locale;
    picked: Date;
    onPick: (date: Date) => void;
    compact?: boolean;
}) {
    const t = makeT(locale);
    const today = new Date();
    const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const lang = htmlLang[locale];

    // the week starts on Sunday in English and Portuguese, on Monday in Spanish
    const firstDay = locale === "es" ? 1 : 0;
    const offset =
        (new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay() - firstDay + 7) % 7;
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells = Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, i) => {
        const day = i - offset + 1;
        return day >= 1 && day <= daysInMonth
            ? new Date(cursor.getFullYear(), cursor.getMonth(), day)
            : null;
    });
    const weekdays = Array.from({ length: 7 }, (_, i) =>
        new Intl.DateTimeFormat(lang, { weekday: "short" }).format(
            new Date(2023, 0, 1 + ((i + firstDay) % 7)),
        ),
    );
    const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
    const move = (months: number) =>
        setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + months, 1));

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <h2
                    className={`font-display font-semibold text-ink capitalize ${compact ? "text-sm" : "text-lg"}`}
                >
                    {new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" }).format(
                        cursor,
                    )}
                </h2>
                <div className="flex items-center gap-1 font-mono text-xs">
                    <button
                        type="button"
                        aria-label="‹"
                        onClick={() => move(-1)}
                        className="size-7 cursor-pointer rounded-md text-ink-dim hover:bg-bg-2 hover:text-ink"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
                            onPick(today);
                        }}
                        className="cursor-pointer rounded-md px-2 py-1 text-ink-dim hover:bg-bg-2 hover:text-ink"
                    >
                        {t("Today", "Hoje", "Hoy")}
                    </button>
                    <button
                        type="button"
                        aria-label="›"
                        onClick={() => move(1)}
                        className="size-7 cursor-pointer rounded-md text-ink-dim hover:bg-bg-2 hover:text-ink"
                    >
                        ›
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-ink-faint uppercase">
                {weekdays.map((name) => (
                    <span key={name}>{name}</span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {cells.map((date, i) =>
                    date ? (
                        <button
                            key={date.getTime()}
                            type="button"
                            aria-current={sameDay(date, today) ? "date" : undefined}
                            aria-pressed={sameDay(date, picked)}
                            onClick={() => onPick(date)}
                            className={`cursor-pointer rounded-lg font-mono transition-colors ${compact ? "h-8 text-xs" : "aspect-square text-sm"} ${
                                sameDay(date, picked)
                                    ? "bg-accent-blue text-[#05070d]"
                                    : sameDay(date, today)
                                      ? "border border-accent-blue text-accent-blue"
                                      : "text-ink hover:bg-bg-2"
                            }`}
                        >
                            {date.getDate()}
                        </button>
                    ) : (
                        // biome-ignore lint/suspicious/noArrayIndexKey: empty cells before and after the month
                        <span key={`empty-${i}`} />
                    ),
                )}
            </div>
        </div>
    );
}
