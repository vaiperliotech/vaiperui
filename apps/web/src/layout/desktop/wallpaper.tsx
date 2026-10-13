"use client";

import { readStored, writeStored } from "./games/shared";

export type WallpaperId = "blueprint" | "aurora" | "violet" | "stars" | "plain";
export const WALLPAPERS: WallpaperId[] = ["blueprint", "aurora", "violet", "stars", "plain"];

const KEY = "vaiperui:wallpaper";
let current: WallpaperId = "blueprint";
let loaded = false;
const listeners = new Set<() => void>();

export const getWallpaper = () => current;

export function subscribeWallpaper(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

/** Reads the saved choice once; called when the desktop opens (never during the server render). */
export function loadWallpaper() {
    if (loaded) return;
    loaded = true;
    const saved = readStored(KEY);
    if (saved && (WALLPAPERS as string[]).includes(saved)) {
        current = saved as WallpaperId;
        for (const listener of listeners) listener();
    }
}

export function setWallpaper(next: WallpaperId) {
    current = next;
    writeStored(KEY, next);
    for (const listener of listeners) listener();
}

const star = (x: number, y: number, r: number, o: number) =>
    `radial-gradient(${r}px ${r}px at ${x}% ${y}%, rgba(255,255,255,${o}), transparent)`;

// the picture behind the windows; `scale` shrinks the grid and the stars for thumbnails
export function Wallpaper({ id, scale = 1 }: { id: WallpaperId; scale?: number }) {
    const glow = (a: string, b: string) =>
        `radial-gradient(60% 55% at 78% 8%, color-mix(in oklab, ${a} 18%, transparent), transparent 70%), radial-gradient(50% 50% at 8% 92%, color-mix(in oklab, ${b} 15%, transparent), transparent 70%)`;
    switch (id) {
        case "blueprint":
            return (
                <>
                    <div
                        aria-hidden="true"
                        className="blueprint absolute inset-0 opacity-70"
                        style={{ backgroundSize: `${72 * scale}px ${72 * scale}px` }}
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{ background: glow("var(--accent-blue)", "var(--accent-purple)") }}
                    />
                </>
            );
        case "violet":
            return (
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(70% 60% at 20% 15%, rgba(167,139,250,0.35), transparent 70%), radial-gradient(60% 55% at 85% 90%, rgba(77,163,255,0.18), transparent 70%), #080a14",
                    }}
                />
            );
        case "aurora":
            return (
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(45% 50% at 15% 85%, rgba(40,200,64,0.30), transparent 70%), radial-gradient(55% 55% at 55% 20%, rgba(77,163,255,0.32), transparent 70%), radial-gradient(50% 55% at 92% 75%, rgba(167,139,250,0.30), transparent 70%), #05070d",
                    }}
                />
            );
        case "stars":
            return (
                <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                        backgroundColor: "#04060c",
                        backgroundImage: [
                            star(12, 18, 1.2 * scale, 0.9),
                            star(28, 62, 1 * scale, 0.7),
                            star(41, 9, 1.4 * scale, 0.85),
                            star(55, 44, 1 * scale, 0.6),
                            star(67, 80, 1.3 * scale, 0.8),
                            star(78, 26, 1 * scale, 0.7),
                            star(90, 58, 1.5 * scale, 0.9),
                            star(8, 88, 1 * scale, 0.6),
                            star(34, 34, 0.9 * scale, 0.5),
                            star(60, 12, 0.9 * scale, 0.5),
                            star(86, 90, 1 * scale, 0.6),
                            star(48, 72, 0.9 * scale, 0.5),
                        ].join(","),
                    }}
                />
            );
        default:
            return <div aria-hidden="true" className="absolute inset-0 bg-bg-0" />;
    }
}
