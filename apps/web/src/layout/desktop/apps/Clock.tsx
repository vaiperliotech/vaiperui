"use client";

import { useEffect, useRef, useState } from "react";

import { makeT } from "@/data/samples";
import { htmlLang } from "@/i18n/config";
import { PillButton, Pills } from "../games/shared";
import { type AppProps, Pane } from "./kit";

type Tab = "world" | "stopwatch" | "timer";

export const CITIES: Array<{ zone: string; names: [string, string, string] }> = [
    { zone: "America/Sao_Paulo", names: ["São Paulo", "São Paulo", "São Paulo"] },
    { zone: "America/New_York", names: ["New York", "Nova York", "Nueva York"] },
    { zone: "Europe/London", names: ["London", "Londres", "Londres"] },
    { zone: "Europe/Madrid", names: ["Madrid", "Madri", "Madrid"] },
    { zone: "Asia/Tokyo", names: ["Tokyo", "Tóquio", "Tokio"] },
    { zone: "Australia/Sydney", names: ["Sydney", "Sydney", "Sídney"] },
];

const pad = (n: number) => String(n).padStart(2, "0");
const clock = (ms: number, hundredths = false) => {
    const total = Math.max(0, ms);
    const base = `${pad(Math.floor(total / 60000))}:${pad(Math.floor(total / 1000) % 60)}`;
    return hundredths ? `${base}.${pad(Math.floor((total % 1000) / 10))}` : base;
};

function Analog({ now }: { now: Date }) {
    const s = now.getSeconds();
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    return (
        <svg
            viewBox="0 0 100 100"
            className="size-32"
            role="img"
            aria-label={now.toLocaleTimeString()}
        >
            <circle cx="50" cy="50" r="46" fill="#05070d" stroke="#3a4560" strokeWidth="2" />
            {Array.from({ length: 12 }, (_, i) => (
                <path
                    // biome-ignore lint/suspicious/noArrayIndexKey: twelve fixed ticks
                    key={i}
                    d="M50 8v6"
                    stroke={i % 3 === 0 ? "#eef2fb" : "#7d8fac"}
                    strokeWidth={i % 3 === 0 ? 2 : 1}
                    transform={`rotate(${i * 30} 50 50)`}
                />
            ))}
            <path
                d="M50 50V28"
                stroke="#eef2fb"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${h * 30} 50 50)`}
            />
            <path
                d="M50 50V18"
                stroke="#4da3ff"
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${m * 6} 50 50)`}
            />
            <path
                d="M50 56V14"
                stroke="#ff5f57"
                strokeWidth="1"
                strokeLinecap="round"
                transform={`rotate(${s * 6} 50 50)`}
            />
            <circle cx="50" cy="50" r="2.6" fill="#ff5f57" />
        </svg>
    );
}

export function Clock({ active, locale }: AppProps) {
    const t = makeT(locale);
    const index = { en: 0, pt: 1, es: 2 }[locale];
    const [tab, setTab] = useState<Tab>("world");
    const [now, setNow] = useState(() => new Date());

    // stopwatch
    const [elapsed, setElapsed] = useState(0);
    const [laps, setLaps] = useState<Array<{ id: number; time: number }>>([]);
    const [running, setRunning] = useState(false);
    const startedAt = useRef(0);
    const base = useRef(0);

    // timer
    const [minutes, setMinutes] = useState(5);
    const [left, setLeft] = useState(5 * 60000);
    const [counting, setCounting] = useState(false);
    const endsAt = useRef(0);

    useEffect(() => {
        if (!active) return;
        const tick = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(tick);
    }, [active]);

    useEffect(() => {
        if (!running) return;
        const tick = window.setInterval(
            () => setElapsed(base.current + Date.now() - startedAt.current),
            40,
        );
        return () => window.clearInterval(tick);
    }, [running]);

    useEffect(() => {
        if (!counting) return;
        const tick = window.setInterval(() => {
            const remaining = endsAt.current - Date.now();
            if (remaining <= 0) {
                setLeft(0);
                setCounting(false);
                navigator.vibrate?.([200, 100, 200]);
            } else setLeft(remaining);
        }, 100);
        return () => window.clearInterval(tick);
    }, [counting]);

    const fmt = (zone?: string) =>
        new Intl.DateTimeFormat(htmlLang[locale], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: zone,
        }).format(now);

    function toggleStopwatch() {
        if (running) {
            base.current = elapsed;
            setRunning(false);
        } else {
            startedAt.current = Date.now();
            setRunning(true);
        }
    }

    function lapOrReset() {
        if (running) {
            setLaps((list) => [{ id: Date.now(), time: elapsed }, ...list]);
        } else {
            base.current = 0;
            setElapsed(0);
            setLaps([]);
        }
    }

    function toggleTimer() {
        if (counting) {
            setCounting(false);
        } else {
            const from = left > 0 ? left : minutes * 60000;
            setLeft(from);
            endsAt.current = Date.now() + from;
            setCounting(true);
        }
    }

    function chooseMinutes(value: number) {
        const clamped = Math.max(1, Math.min(180, Math.round(value) || 1));
        setMinutes(clamped);
        setLeft(clamped * 60000);
        setCounting(false);
    }

    return (
        <Pane className="flex flex-col items-center gap-4">
            <Pills
                value={tab}
                options={[
                    { id: "world", label: t("World", "Mundo", "Mundo") },
                    { id: "stopwatch", label: t("Stopwatch", "Cronômetro", "Cronómetro") },
                    { id: "timer", label: t("Timer", "Timer", "Temporizador") },
                ]}
                onChange={setTab}
            />

            {tab === "world" ? (
                <>
                    <Analog now={now} />
                    <p className="font-mono text-2xl text-ink tabular-nums">{fmt()}</p>
                    <ul className="w-full divide-y divide-line rounded-xl border border-line bg-bg-0">
                        {CITIES.map((city) => (
                            <li
                                key={city.zone}
                                className="flex items-center justify-between px-4 py-2.5 font-mono text-sm"
                            >
                                <span className="text-ink-dim">{city.names[index]}</span>
                                <span className="text-ink tabular-nums">{fmt(city.zone)}</span>
                            </li>
                        ))}
                    </ul>
                </>
            ) : null}

            {tab === "stopwatch" ? (
                <>
                    <p className="my-4 font-light font-mono text-5xl text-ink tabular-nums">
                        {clock(elapsed, true)}
                    </p>
                    <div className="flex gap-2">
                        <PillButton onClick={toggleStopwatch}>
                            {running
                                ? t("Stop", "Parar", "Parar")
                                : t("Start", "Iniciar", "Iniciar")}
                        </PillButton>
                        <PillButton onClick={lapOrReset}>
                            {running
                                ? t("Lap", "Volta", "Vuelta")
                                : t("Reset", "Zerar", "Reiniciar")}
                        </PillButton>
                    </div>
                    <ol className="w-full max-w-xs divide-y divide-line font-mono text-sm">
                        {laps.map((lap, i) => (
                            <li key={lap.id} className="flex justify-between py-1.5 text-ink-dim">
                                <span>{laps.length - i}</span>
                                <span className="text-ink tabular-nums">
                                    {clock(lap.time, true)}
                                </span>
                            </li>
                        ))}
                    </ol>
                </>
            ) : null}

            {tab === "timer" ? (
                <>
                    <p
                        aria-live="polite"
                        className={`my-4 font-light font-mono text-6xl tabular-nums ${left === 0 ? "animate-pulse text-[#ff5f57]" : "text-ink"}`}
                    >
                        {clock(left)}
                    </p>
                    <div className="flex items-center gap-2 font-mono text-xs text-ink-dim">
                        {[5, 10, 25].map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => chooseMinutes(preset)}
                                className={`cursor-pointer rounded-full border px-2.5 py-1 transition-colors ${
                                    minutes === preset
                                        ? "border-accent-blue text-accent-blue"
                                        : "border-line-strong hover:text-ink"
                                }`}
                            >
                                {preset} min
                            </button>
                        ))}
                        <input
                            type="number"
                            min={1}
                            max={180}
                            value={minutes}
                            aria-label="min"
                            onChange={(event) => chooseMinutes(Number(event.target.value))}
                            className="h-7 w-16 rounded-md border border-line-strong bg-bg-0 px-2 text-ink outline-none focus:border-accent-blue"
                        />
                    </div>
                    <div className="flex gap-2">
                        <PillButton onClick={toggleTimer}>
                            {counting
                                ? t("Pause", "Pausar", "Pausar")
                                : t("Start", "Iniciar", "Iniciar")}
                        </PillButton>
                        <PillButton onClick={() => chooseMinutes(minutes)}>
                            {t("Reset", "Zerar", "Reiniciar")}
                        </PillButton>
                    </div>
                </>
            ) : null}
        </Pane>
    );
}
