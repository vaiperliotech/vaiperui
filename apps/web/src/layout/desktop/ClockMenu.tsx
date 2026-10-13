"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { makeT } from "@/data/samples";
import { htmlLang, type Locale } from "@/i18n/config";
import { CITIES } from "./apps/Clock";
import { MonthCalendar } from "./apps/MonthCalendar";

function WorldClocks({ locale, now }: { locale: Locale; now: Date }) {
    const index = { en: 0, pt: 1, es: 2 }[locale];
    return (
        <ul className="divide-y divide-line rounded-xl border border-line bg-bg-0/70">
            {CITIES.slice(0, 4).map((city) => (
                <li
                    key={city.zone}
                    className="flex items-center justify-between px-3 py-2 font-mono text-xs"
                >
                    <span className="text-ink-dim">{city.names[index]}</span>
                    <span className="text-ink tabular-nums">
                        {new Intl.DateTimeFormat(htmlLang[locale], {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: city.zone,
                        }).format(now)}
                    </span>
                </li>
            ))}
        </ul>
    );
}

function Panel({ locale, now }: { locale: Locale; now: Date }) {
    const lang = htmlLang[locale];
    const [picked, setPicked] = useState(new Date());
    const weekday = new Intl.DateTimeFormat(lang, { weekday: "long" }).format(now);
    const date = new Intl.DateTimeFormat(lang, {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(now);

    return (
        <div className="w-[340px] rounded-2xl border border-white/10 bg-bg-1/80 p-3 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            <div className="px-2 pt-1 pb-3">
                <p className="font-display font-semibold text-ink text-xl capitalize">{weekday}</p>
                <p className="text-ink-dim text-sm">{date}</p>
            </div>
            <div className="flex flex-col gap-2.5">
                <div className="rounded-xl border border-line bg-bg-0/70 p-3">
                    <MonthCalendar locale={locale} picked={picked} onPick={setPicked} compact />
                </div>
                <WorldClocks locale={locale} now={now} />
            </div>
        </div>
    );
}

// The clock in the menu bar. Clicking it opens a panel like macOS's Notification Center, whatever
// system the visitor is on: date, a month calendar and a few world clocks.
export function ClockMenu({ locale, now }: { locale: Locale; now: Date | null }) {
    const t = makeT(locale);
    const [open, setOpen] = useState(false);
    const lang = htmlLang[locale];

    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.stopPropagation();
                setOpen(false);
            }
        };
        document.addEventListener("keydown", onKey, true);
        return () => document.removeEventListener("keydown", onKey, true);
    }, [open]);

    if (!now) return <span />;

    // like macOS: "Tue, Oct 13, 6:17 PM"
    const label = new Intl.DateTimeFormat(lang, {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(now);

    return (
        <>
            <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-label={t("Date and time", "Data e hora", "Fecha y hora")}
                onClick={() => setOpen((value) => !value)}
                className={`cursor-pointer rounded-md px-2 py-0.5 text-ink-dim tabular-nums transition-colors hover:bg-white/10 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent-blue ${
                    open ? "bg-white/10 text-ink" : ""
                }`}
            >
                {label}
            </button>

            {/* in a portal: the menu bar blurs its background, which would make it the frame of a fixed panel */}
            {open
                ? createPortal(
                      <>
                          {/* a click anywhere else closes it, as the real panels do */}
                          <button
                              type="button"
                              aria-label={t("Close", "Fechar", "Cerrar")}
                              tabIndex={-1}
                              onClick={() => setOpen(false)}
                              className="fixed inset-0 z-[5500] cursor-default"
                          />
                          <div
                              role="dialog"
                              aria-label={t("Date and time", "Data e hora", "Fecha y hora")}
                              className="clock-panel fixed top-8 right-2 z-[5600]"
                          >
                              <Panel locale={locale} now={now} />
                          </div>
                      </>,
                      document.body,
                  )
                : null}
        </>
    );
}
