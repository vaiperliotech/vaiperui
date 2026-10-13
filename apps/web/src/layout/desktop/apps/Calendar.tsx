"use client";

import { useState } from "react";

import { makeT } from "@/data/samples";
import { htmlLang } from "@/i18n/config";
import { PillButton } from "../games/shared";
import { type AppProps, Pane } from "./kit";

const DAY = 86400000;

export function Calendar({ locale }: AppProps) {
    const t = makeT(locale);
    const today = new Date();
    const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [picked, setPicked] = useState(today);
    const lang = htmlLang[locale];

    // the week starts on Sunday in English and Portuguese, on Monday in Spanish
    const firstDay = locale === "es" ? 1 : 0;
    const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const offset = (monthStart.getDay() - firstDay + 7) % 7;
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
    const dayOfYear = Math.floor(
        (picked.getTime() - new Date(picked.getFullYear(), 0, 0).getTime()) / DAY,
    );
    const move = (months: number) =>
        setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + months, 1));

    return (
        <Pane className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-ink text-lg capitalize">
                    {new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" }).format(
                        cursor,
                    )}
                </h2>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="‹"
                        onClick={() => move(-1)}
                        className="size-8 cursor-pointer rounded-md font-mono text-ink-dim hover:bg-bg-2 hover:text-ink"
                    >
                        ‹
                    </button>
                    <PillButton
                        onClick={() => {
                            setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
                            setPicked(today);
                        }}
                    >
                        {t("Today", "Hoje", "Hoy")}
                    </PillButton>
                    <button
                        type="button"
                        aria-label="›"
                        onClick={() => move(1)}
                        className="size-8 cursor-pointer rounded-md font-mono text-ink-dim hover:bg-bg-2 hover:text-ink"
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
                            onClick={() => setPicked(date)}
                            className={`aspect-square cursor-pointer rounded-lg font-mono text-sm transition-colors ${
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

            <p className="rounded-lg border border-line bg-bg-0 px-3 py-2 font-mono text-xs text-ink-dim">
                <span className="text-ink capitalize">
                    {new Intl.DateTimeFormat(lang, { dateStyle: "full" }).format(picked)}
                </span>
                {" · "}
                {t("day", "dia", "día")} {dayOfYear}/
                {(picked.getFullYear() % 4 === 0 && picked.getFullYear() % 100 !== 0) ||
                picked.getFullYear() % 400 === 0
                    ? 366
                    : 365}
            </p>
        </Pane>
    );
}
