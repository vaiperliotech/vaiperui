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

const FAR_STARS: Array<[number, number, number, number]> = [
    [12, 18, 1.1, 0.8],
    [41, 9, 1.2, 0.8],
    [67, 80, 1.1, 0.7],
    [90, 58, 1.2, 0.8],
    [34, 34, 0.9, 0.5],
    [86, 90, 1, 0.6],
];
const NEAR_STARS: Array<[number, number, number, number]> = [
    [28, 62, 1.5, 0.9],
    [55, 44, 1.4, 0.85],
    [78, 26, 1.6, 0.9],
    [8, 88, 1.4, 0.8],
    [60, 12, 1.3, 0.75],
    [48, 72, 1.5, 0.85],
];

const layer = (stars: Array<[number, number, number, number]>, scale: number) =>
    stars.map(([x, y, r, o]) => star(x, y, r * scale, o)).join(",");

// The picture behind the windows. `scale` shrinks the grid and the stars for thumbnails, which
// also stand still (`animated={false}`); on the desktop the pictures move slowly, unless the
// visitor asked for less motion (see the wp-* rules in globals.css).
export function Wallpaper({
    id,
    scale = 1,
    animated = true,
}: {
    id: WallpaperId;
    scale?: number;
    animated?: boolean;
}) {
    const move = (name: string) => (animated ? name : "");
    const glow = (a: string, b: string) =>
        `radial-gradient(60% 55% at 78% 8%, color-mix(in oklab, ${a} 18%, transparent), transparent 70%), radial-gradient(50% 50% at 8% 92%, color-mix(in oklab, ${b} 15%, transparent), transparent 70%)`;

    switch (id) {
        case "blueprint":
            return (
                <>
                    <div
                        aria-hidden="true"
                        className={`blueprint absolute inset-0 opacity-70 ${move("wp-grid")}`}
                        style={{ backgroundSize: `${72 * scale}px ${72 * scale}px` }}
                    />
                    <div
                        aria-hidden="true"
                        className={`absolute inset-0 ${move("wp-breathe")}`}
                        style={{ background: glow("var(--accent-blue)", "var(--accent-purple)") }}
                    />
                </>
            );
        case "violet":
            return (
                <>
                    <div aria-hidden="true" className="absolute inset-0 bg-[#080a14]" />
                    <div
                        aria-hidden="true"
                        className={`absolute inset-0 ${move("wp-breathe")}`}
                        style={{
                            background:
                                "radial-gradient(70% 60% at 20% 15%, rgba(167,139,250,0.38), transparent 70%), radial-gradient(60% 55% at 85% 90%, rgba(77,163,255,0.2), transparent 70%)",
                        }}
                    />
                </>
            );
        case "aurora":
            return (
                <>
                    <div aria-hidden="true" className="absolute inset-0 bg-[#05070d]" />
                    {[
                        [
                            "wp-blob-a",
                            "radial-gradient(45% 50% at 15% 85%, rgba(40,200,64,0.32), transparent 70%)",
                        ],
                        [
                            "wp-blob-b",
                            "radial-gradient(55% 55% at 55% 20%, rgba(77,163,255,0.34), transparent 70%)",
                        ],
                        [
                            "wp-blob-c",
                            "radial-gradient(50% 55% at 92% 75%, rgba(167,139,250,0.32), transparent 70%)",
                        ],
                    ].map(([name, background]) => (
                        <div
                            key={name}
                            aria-hidden="true"
                            className={`absolute inset-[-10%] ${move(name as string)}`}
                            style={{ background }}
                        />
                    ))}
                </>
            );
        case "stars":
            return (
                <>
                    <div aria-hidden="true" className="absolute inset-0 bg-[#04060c]" />
                    <div
                        aria-hidden="true"
                        className={`absolute inset-0 ${move("wp-stars-far")}`}
                        style={{
                            backgroundImage: layer(FAR_STARS, scale),
                            backgroundSize: "100% 100%",
                        }}
                    />
                    <div
                        aria-hidden="true"
                        className={`absolute inset-0 ${move("wp-stars-near")}`}
                        style={{
                            backgroundImage: layer(NEAR_STARS, scale),
                            backgroundSize: "100% 100%",
                        }}
                    />
                </>
            );
        default:
            return <div aria-hidden="true" className="absolute inset-0 bg-bg-0" />;
    }
}
