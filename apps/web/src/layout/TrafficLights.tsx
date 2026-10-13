"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Desktop } from "./desktop/Desktop";

export type WindowLabels = Dictionary["header"]["window"];

// What the page "window" is doing; mirrored on <html data-window-state> so the CSS can animate it.
type Mode = "idle" | "closing" | "closed" | "opening" | "minimizing" | "minimized" | "restoring";

const TIMING: Record<"closing" | "opening" | "minimizing" | "restoring", number> = {
    closing: 520,
    opening: 520,
    minimizing: 620,
    restoring: 520,
};

// The header dots do what macOS window buttons do, to the page itself:
// red switches the "screen" off like a CRT, yellow sends the page to a dock, green goes fullscreen.
export function TrafficLights({
    labels,
    locale,
    version,
}: {
    labels: WindowLabels;
    locale: Locale;
    version: string;
}) {
    const [mode, setMode] = useState<Mode>("idle");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [canFullscreen, setCanFullscreen] = useState(true);
    const [note, setNote] = useState("");
    const timer = useRef<number | undefined>(undefined);
    const noteTimer = useRef<number | undefined>(undefined);

    useEffect(() => {
        setCanFullscreen(document.fullscreenEnabled);
        const sync = () => setIsFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener("fullscreenchange", sync);
        return () => {
            document.removeEventListener("fullscreenchange", sync);
            window.clearTimeout(timer.current);
            window.clearTimeout(noteTimer.current);
            document.documentElement.removeAttribute("data-window-state");
            document.documentElement.style.overflow = "";
            document.querySelector("[data-window]")?.removeAttribute("inert");
        };
    }, []);

    const apply = useCallback((next: Mode) => {
        const root = document.documentElement;
        // the page behind a closed/minimized window can't be focused or read by assistive tech
        document.querySelector("[data-window]")?.toggleAttribute("inert", next !== "idle");
        if (next === "idle") {
            root.removeAttribute("data-window-state");
            root.style.overflow = "";
        } else {
            // the transform origins sit in the middle / bottom of what is on screen right now
            root.style.setProperty("--win-center", `${window.scrollY + window.innerHeight / 2}px`);
            root.style.setProperty("--win-bottom", `${window.scrollY + window.innerHeight - 28}px`);
            root.setAttribute("data-window-state", next);
            root.style.overflow = "hidden";
        }
        setMode(next);
    }, []);

    const run = useCallback(
        (animating: "closing" | "opening" | "minimizing" | "restoring", then: Mode) => {
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.clearTimeout(timer.current);
            if (reduced) {
                apply(then);
                return;
            }
            apply(animating);
            timer.current = window.setTimeout(() => apply(then), TIMING[animating]);
        },
        [apply],
    );

    const reopen = useCallback(() => run("opening", "idle"), [run]);
    const restore = useCallback(() => run("restoring", "idle"), [run]);

    function flash(text: string) {
        setNote(text);
        window.clearTimeout(noteTimer.current);
        noteTimer.current = window.setTimeout(() => setNote(""), 2200);
    }

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            void document.exitFullscreen();
        } else {
            flash("document.requestFullscreen()");
            void document.documentElement.requestFullscreen().catch(() => {});
        }
    }

    const busy = mode !== "idle";
    const dots = [
        {
            id: "close",
            label: labels.close,
            bg: "bg-mac-red",
            glyph: "×",
            pressed: undefined,
            disabled: busy,
            onClick: () => run("closing", "closed"),
        },
        {
            id: "minimize",
            label: labels.minimize,
            bg: "bg-mac-yellow",
            glyph: "−",
            pressed: undefined,
            disabled: busy,
            onClick: () => run("minimizing", "minimized"),
        },
        {
            id: "fullscreen",
            label: isFullscreen ? labels.exitFullscreen : labels.fullscreen,
            bg: "bg-mac-green",
            glyph: "+",
            pressed: isFullscreen,
            disabled: busy || !canFullscreen,
            onClick: toggleFullscreen,
        },
    ];

    return (
        <div className="relative hidden sm:block">
            <fieldset aria-label={labels.group} className="group m-0 flex border-0 p-0">
                {dots.map((dot) => (
                    <button
                        key={dot.id}
                        type="button"
                        aria-label={dot.label}
                        aria-pressed={dot.pressed}
                        disabled={dot.disabled}
                        onClick={dot.onClick}
                        // a 20px target around the 10px dot
                        className="flex size-5 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-accent-blue disabled:cursor-default"
                    >
                        <span
                            className={`flex size-2.5 items-center justify-center rounded-full font-bold text-[9px] text-black/60 leading-none ${dot.bg}`}
                        >
                            <span
                                aria-hidden="true"
                                className="opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
                            >
                                {dot.glyph}
                            </span>
                        </span>
                    </button>
                ))}
            </fieldset>
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute top-1/2 left-full ml-3 -translate-y-1/2 whitespace-nowrap font-mono text-[11px] text-ink-faint transition-opacity duration-300 ${
                    note ? "opacity-100" : "opacity-0"
                }`}
            >
                {note}
            </span>

            {mode === "closed" ? <ClosedScreen labels={labels} onReopen={reopen} /> : null}
            {mode === "minimized" ? (
                <Desktop
                    locale={locale}
                    version={version}
                    labels={labels}
                    onRestore={restore}
                    onNuke={() => run("closing", "closed")}
                />
            ) : null}
        </div>
    );
}

// Any key, click or tap brings the page back, so the easter egg can never trap anyone.
function ClosedScreen({ labels, onReopen }: { labels: WindowLabels; onReopen: () => void }) {
    useEffect(() => {
        // wait a tick so the click that closed the window is not read as "reopen"
        const arm = window.setTimeout(() => {
            document.addEventListener("keydown", onReopen);
            document.addEventListener("pointerdown", onReopen);
        }, 150);
        return () => {
            window.clearTimeout(arm);
            document.removeEventListener("keydown", onReopen);
            document.removeEventListener("pointerdown", onReopen);
        };
    }, [onReopen]);

    return createPortal(
        <div
            role="status"
            className="fixed inset-0 z-[100] flex flex-col justify-center gap-2 bg-black px-8 font-mono text-sm text-ink-dim sm:px-24"
        >
            <p className="text-ink-faint">$ exit</p>
            <p>{labels.exited}</p>
            <p className="text-ink">
                <span className="text-accent-blue">›</span> {labels.reopen}
                <span
                    aria-hidden="true"
                    className="blink ml-1 inline-block h-4 w-2 translate-y-0.5 bg-ink"
                />
            </p>
        </div>,
        document.body,
    );
}
