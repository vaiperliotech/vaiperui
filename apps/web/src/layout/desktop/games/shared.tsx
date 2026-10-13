"use client";

import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export type GamesLabels = Dictionary["header"]["window"]["desktop"]["games"];
export type GameProps = { active: boolean; t: GamesLabels; locale: Locale };

// site palette, for the canvases that cannot read CSS variables
export const PALETTE = {
    bg: "#0a0e18",
    bg0: "#05070d",
    bg2: "#111726",
    bg3: "#1a2234",
    line: "rgba(255,255,255,0.08)",
    ink: "#eef2fb",
    dim: "#9fb0c9",
    faint: "#7d8fac",
    blue: "#4da3ff",
    violet: "#a78bfa",
    green: "#28c840",
    yellow: "#febc2e",
    red: "#ff5f57",
} as const;

export function readStored(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

export function writeStored(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // private mode: it just won't persist
    }
}

/** A record kept in the browser. `report` returns true when the score is a new record. */
export function useBest(key: string, lowerIsBetter = false) {
    const [best, setBest] = useState<number | null>(null);

    useEffect(() => {
        const saved = readStored(`vaiperui:${key}`);
        setBest(saved === null ? null : Number(saved));
    }, [key]);

    const report = useCallback(
        (score: number) => {
            const stored = readStored(`vaiperui:${key}`);
            const current = stored === null ? null : Number(stored);
            const better = current === null || (lowerIsBetter ? score < current : score > current);
            if (better) {
                writeStored(`vaiperui:${key}`, String(score));
                setBest(score);
            }
            return better;
        },
        [key, lowerIsBetter],
    );

    return [best, report] as const;
}

/** State that survives a reload: JSON in the browser's storage, read after the first render. */
export function usePersistedState<T>(key: string, initial: T) {
    const [value, setValue] = useState<T>(initial);

    useEffect(() => {
        const raw = readStored(`vaiperui:${key}`);
        if (raw === null) return;
        try {
            setValue(JSON.parse(raw) as T);
        } catch {
            // a corrupted value is ignored and overwritten by the next change
        }
    }, [key]);

    const update = useCallback(
        (next: T | ((current: T) => T)) => {
            setValue((current) => {
                const resolved =
                    typeof next === "function" ? (next as (current: T) => T)(current) : next;
                writeStored(`vaiperui:${key}`, JSON.stringify(resolved));
                return resolved;
            });
        },
        [key],
    );

    return [value, update] as const;
}

/** Keyboard input, only while the game's window has the focus. */
export function useGameKeys(active: boolean, handler: (event: KeyboardEvent) => void) {
    useEffect(() => {
        if (!active) return;
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [active, handler]);
}

/** Keys the games use must not scroll the page or trigger browser shortcuts. */
export const GAME_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

export function GameShell({ children, gap = "gap-3" }: { children: ReactNode; gap?: string }) {
    return (
        <div
            className={`flex h-full select-none flex-col items-center justify-center bg-bg-1 p-4 ${gap}`}
        >
            {children}
        </div>
    );
}

export function StatBar({
    items,
    width,
}: {
    items: Array<[string, string | number]>;
    width: number;
}) {
    return (
        <div
            style={{ width }}
            className="flex items-center justify-between font-mono text-xs text-ink-dim"
        >
            {items.map(([label, value]) => (
                <span key={label}>
                    {label} <b className="text-ink tabular-nums">{value}</b>
                </span>
            ))}
        </div>
    );
}

export function Pills<T extends string>({
    value,
    options,
    onChange,
}: {
    value: T;
    options: Array<{ id: T; label: string }>;
    onChange: (next: T) => void;
}) {
    return (
        <fieldset className="m-0 flex flex-wrap justify-center gap-1 border-0 p-0 font-mono text-[11px]">
            {options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    aria-pressed={value === option.id}
                    onClick={() => onChange(option.id)}
                    className={`cursor-pointer rounded-full border px-2.5 py-0.5 transition-colors ${
                        value === option.id
                            ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                            : "border-line-strong text-ink-faint hover:text-ink"
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </fieldset>
    );
}

export function PillButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="cursor-pointer rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-ink-dim transition-colors hover:border-accent-blue/60 hover:text-ink"
        >
            {children}
        </button>
    );
}

/** The text that sits over a board while it waits, pauses or ends. */
export function Overlay({ children }: { children: ReactNode }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-0/70 px-6 text-center font-mono text-xs text-ink backdrop-blur-[2px]">
            {children}
        </div>
    );
}

/** A frame loop for canvas games. `frame` gets the time since the last frame in units of 1/60s. */
export function useRaf(run: boolean, frame: (dt: number) => void) {
    const latest = useRef(frame);
    latest.current = frame;
    useEffect(() => {
        if (!run) return;
        let id = 0;
        let last = performance.now();
        const loop = (now: number) => {
            // a hidden tab or a long pause must not teleport everything
            const dt = Math.min(3, (now - last) / (1000 / 60));
            last = now;
            latest.current(dt);
            id = requestAnimationFrame(loop);
        };
        id = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(id);
    }, [run]);
}

/** Sizes a canvas for the screen's pixel density and returns its 2D context. */
export function prepareCanvas(canvas: HTMLCanvasElement | null, width: number, height: number) {
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return null;
    const ratio = window.devicePixelRatio || 1;
    if (canvas.width !== width * ratio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return ctx;
}
