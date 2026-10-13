"use client";

import { useState } from "react";

import { makeT } from "@/data/samples";
import { htmlLang } from "@/i18n/config";
import { type AppProps, Pane } from "./kit";
import { MonthCalendar } from "./MonthCalendar";

const DAY = 86400000;

export function Calendar({ locale }: AppProps) {
    const t = makeT(locale);
    const [picked, setPicked] = useState(new Date());
    const lang = htmlLang[locale];
    const year = picked.getFullYear();
    const dayOfYear = Math.floor((picked.getTime() - new Date(year, 0, 0).getTime()) / DAY);
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    return (
        <Pane className="flex flex-col gap-3">
            <MonthCalendar locale={locale} picked={picked} onPick={setPicked} />
            <p className="rounded-lg border border-line bg-bg-0 px-3 py-2 font-mono text-xs text-ink-dim">
                <span className="text-ink capitalize">
                    {new Intl.DateTimeFormat(lang, { dateStyle: "full" }).format(picked)}
                </span>
                {" · "}
                {t("day", "dia", "día")} {dayOfYear}/{leap ? 366 : 365}
            </p>
        </Pane>
    );
}
