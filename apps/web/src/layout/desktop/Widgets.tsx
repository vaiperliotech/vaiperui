"use client";

import { useEffect, useState } from "react";

import { makeT } from "@/data/samples";
import { htmlLang, type Locale } from "@/i18n/config";
import { STORAGE_EVENT } from "./games/shared";
import { RECORDS, readRecord } from "./records";
import { type Note, notesStore, useStore } from "./stores";

const GAME_OF: Record<string, string> = {
    "tictactoe-score": "tictactoe",
    "memory-best:small": "memory",
    "memory-best:large": "memory",
    "colormatch-best": "colormatch",
    "2048-best": "g2048",
    "wordle-stats": "wordle",
    "snake-best:small": "snake",
    "snake-best:large": "snake",
    "mines-best:easy": "mines",
    "mines-best:medium": "mines",
    "mines-best:hard": "mines",
    "mines-best:veryHard": "mines",
    "bughunt-best": "bughunt",
    "flappy-best": "flappy",
    "dino-best": "dino",
    "pong-wins": "pong",
    "breakout-best": "breakout",
    "stack-best": "stack",
    "invaders-best": "invaders",
};

const card = "w-60 rounded-2xl border border-white/10 bg-bg-1/55 p-3.5 backdrop-blur-xl";

function ClockWidget({ locale }: { locale: Locale }) {
    const [now, setNow] = useState<Date | null>(null);
    useEffect(() => {
        setNow(new Date());
        const tick = window.setInterval(() => setNow(new Date()), 15_000);
        return () => window.clearInterval(tick);
    }, []);
    if (!now) return <div className={`${card} h-[92px]`} />;
    const lang = htmlLang[locale];
    return (
        <div className={card}>
            <p className="font-light font-mono text-4xl text-ink tabular-nums">
                {new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(now)}
            </p>
            <p className="mt-1 font-mono text-ink-dim text-xs capitalize">
                {new Intl.DateTimeFormat(lang, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                }).format(now)}
            </p>
        </div>
    );
}

// Your best result of each game that has one, up to five, updated as you play.
function ScoreWidget({ locale, names }: { locale: Locale; names: Record<string, string> }) {
    const t = makeT(locale);
    const [rows, setRows] = useState<Array<[string, string]>>([]);

    useEffect(() => {
        const read = () => {
            const seen = new Set<string>();
            const next: Array<[string, string]> = [];
            for (const [, key] of RECORDS) {
                const game = GAME_OF[key];
                const value = readRecord(key);
                if (!game || value === null || seen.has(game)) continue;
                seen.add(game);
                next.push([names[game] ?? game, value]);
            }
            setRows(next.slice(0, 5));
        };
        read();
        window.addEventListener(STORAGE_EVENT, read);
        window.addEventListener("storage", read);
        return () => {
            window.removeEventListener(STORAGE_EVENT, read);
            window.removeEventListener("storage", read);
        };
    }, [names]);

    return (
        <div className={card}>
            <p className="mb-2 font-mono text-[10px] text-ink-faint uppercase tracking-wider">
                {t("Scoreboard", "Placar", "Marcador")}
            </p>
            {rows.length === 0 ? (
                <p className="font-mono text-ink-dim text-xs leading-5">
                    {t(
                        "Play a game to set your first record.",
                        "Jogue um jogo para marcar seu primeiro recorde.",
                        "Juega para marcar tu primer récord.",
                    )}
                </p>
            ) : (
                <ul className="flex flex-col gap-1.5">
                    {rows.map(([name, value]) => (
                        <li
                            key={name}
                            className="flex items-center justify-between gap-3 font-mono text-xs"
                        >
                            <span className="truncate text-ink-dim">{name}</span>
                            <span className="shrink-0 text-ink tabular-nums">{value}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// A sticky note that is the first note of the Notes app: the same text, edited from either place.
function StickyWidget({ locale }: { locale: Locale }) {
    const t = makeT(locale);
    const notes = useStore(notesStore);
    const first: Note | undefined = notes[0];

    function change(text: string) {
        notesStore.set((list) =>
            list.length === 0
                ? [{ id: Date.now(), text }]
                : list.map((note, index) => (index === 0 ? { ...note, text } : note)),
        );
    }

    return (
        <div className="w-60 -rotate-1 rounded-sm bg-[#febc2e] p-3 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.7)]">
            <p className="mb-1 font-mono text-[10px] text-[#05070d]/55 uppercase tracking-wider">
                {t("Quick note", "Nota rápida", "Nota rápida")}
            </p>
            <textarea
                value={first?.text ?? ""}
                onChange={(event) => change(event.target.value)}
                placeholder={t("Jot something down…", "Anote alguma coisa…", "Anota algo…")}
                aria-label={t("Quick note", "Nota rápida", "Nota rápida")}
                spellCheck={false}
                className="h-28 w-full resize-none bg-transparent font-mono text-[#05070d] text-xs leading-5 outline-none placeholder:text-[#05070d]/45"
            />
        </div>
    );
}

export function Widgets({ locale, names }: { locale: Locale; names: Record<string, string> }) {
    return (
        <div className="absolute top-9 right-3 z-[1] flex flex-col gap-3">
            <ClockWidget locale={locale} />
            <ScoreWidget locale={locale} names={names} />
            <StickyWidget locale={locale} />
        </div>
    );
}
