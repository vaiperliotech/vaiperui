"use client";

import { usePathname, useRouter } from "next/navigation";
import { forwardRef, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import {
    htmlLang,
    LOCALE_COOKIE,
    LOCALE_COOKIE_MAX_AGE,
    type Locale,
    localePath,
    stripLocale,
} from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { AppWindow } from "./AppWindow";
import { Apps } from "./apps/Apps";
import { Arcade } from "./apps/Arcade";
import { Calculator } from "./apps/Calculator";
import { Calendar } from "./apps/Calendar";
import { Changelog } from "./apps/Changelog";
import { Clock } from "./apps/Clock";
import { Converter } from "./apps/Converter";
import { CssLab } from "./apps/CssLab";
import { Installer } from "./apps/Installer";
import { MaskLab } from "./apps/MaskLab";
import { Minesweeper, minesWindowSize } from "./apps/Minesweeper";
import { Notes } from "./apps/Notes";
import { Playground } from "./apps/Playground";
import { Settings } from "./apps/Settings";
import { Snake } from "./apps/Snake";
import { Terminal } from "./apps/Terminal";
import { ThemeStudio } from "./apps/ThemeStudio";
import { Battery } from "./Battery";
import { Breakout } from "./games/Breakout";
import { BugHunt } from "./games/BugHunt";
import { ColorMatch } from "./games/ColorMatch";
import { Dino } from "./games/Dino";
import { Flappy } from "./games/Flappy";
import { Game2048 } from "./games/Game2048";
import { Invaders } from "./games/Invaders";
import { Memory } from "./games/Memory";
import { Pong } from "./games/Pong";
import { Stack } from "./games/Stack";
import { TicTacToe } from "./games/TicTacToe";
import { Wordle } from "./games/Wordle";
import { AppIcon } from "./icons";
import { APP_IDS, type AppId, appName, type UtilityId, WINDOW_SIZES } from "./registry";
import {
    getWallpaper,
    loadWallpaper,
    subscribeWallpaper,
    Wallpaper,
    type WallpaperId,
} from "./wallpaper";

type Win = { open: boolean; minimized: boolean; zoom: boolean; x: number; y: number; z: number };
type Labels = Dictionary["header"]["window"];

const MENU_BAR = 28;
// the dock always shows these two; every other app appears there while it is open
const PINNED: AppId[] = ["terminal", "apps", "arcade"];

const closedWindow = (): Win => ({ open: false, minimized: false, zoom: false, x: 0, y: 0, z: 0 });

// What the page turns into when it is minimized: a tiny desktop with a menu bar, a dock and apps.
export function Desktop({
    locale,
    version,
    labels,
    onRestore,
    onNuke,
}: {
    locale: Locale;
    version: string;
    labels: Labels;
    onRestore: () => void;
    onNuke: () => void;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [wins, setWins] = useState<Record<AppId, Win>>(
        () => Object.fromEntries(APP_IDS.map((id) => [id, closedWindow()])) as Record<AppId, Win>,
    );
    const [focus, setFocus] = useState<AppId | null>(null);
    const [bounce, setBounce] = useState<AppId | null>(null);
    const [now, setNow] = useState<Date | null>(null);
    const wallpaper = useSyncExternalStore(
        subscribeWallpaper,
        getWallpaper,
        () => "blueprint" as WallpaperId,
    );
    // the Minesweeper window grows with the difficulty chosen inside it
    const [minesSize, setMinesSize] = useState<[number, number]>(() => minesWindowSize("easy"));
    const z = useRef(10);
    const dock = useRef<HTMLDivElement>(null);
    const home = useRef<HTMLButtonElement>(null);
    const bounceTimer = useRef<number | undefined>(undefined);
    const d = labels.desktop;

    useEffect(() => {
        home.current?.focus();
        loadWallpaper();
        setNow(new Date());
        const tick = window.setInterval(() => setNow(new Date()), 20_000);
        return () => {
            window.clearInterval(tick);
            window.clearTimeout(bounceTimer.current);
        };
    }, []);

    const anyOpen = APP_IDS.some((id) => wins[id].open && !wins[id].minimized);
    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape" && !anyOpen) onRestore();
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [anyOpen, onRestore]);

    const patch = useCallback((id: AppId, change: Partial<Win>) => {
        setWins((current) => ({ ...current, [id]: { ...current[id], ...change } }));
    }, []);

    const bringToFront = useCallback(
        (id: AppId) => {
            z.current += 1;
            patch(id, { z: z.current });
            setFocus(id);
        },
        [patch],
    );

    const launch = useCallback((id: AppId) => {
        setBounce(id);
        window.clearTimeout(bounceTimer.current);
        bounceTimer.current = window.setTimeout(() => setBounce(null), 700);
        z.current += 1;
        setWins((current) => {
            const win = current[id];
            if (win.open) return { ...current, [id]: { ...win, minimized: false, z: z.current } };
            const [width, height] = WINDOW_SIZES[id];
            const stagger = (APP_IDS.filter((app) => current[app].open).length % 6) * 28;
            // new windows appear where they fit: a tall game on a short screen starts as high as possible
            const room = window.innerHeight - height - 110;
            return {
                ...current,
                [id]: {
                    open: true,
                    minimized: false,
                    zoom: false,
                    z: z.current,
                    x: Math.max(12, (window.innerWidth - width) / 2 - 90 + stagger),
                    y: Math.max(MENU_BAR + 8, Math.min(MENU_BAR + 36 + stagger, room)),
                },
            };
        });
        setFocus(id);
    }, []);

    const dismiss = useCallback(
        (id: AppId, change: Partial<Win>) => {
            patch(id, change);
            // hand the focus to the next window that is still on screen
            setFocus((current) => (current === id ? null : current));
        },
        [patch],
    );

    const openPage = useCallback(
        (path: string) => {
            router.push(localePath(locale, path));
            onRestore();
        },
        [locale, onRestore, router],
    );

    const switchLocale = useCallback(
        (next: Locale) => {
            // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not available in every browser
            document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
            router.push(localePath(next, stripLocale(pathname)));
            onRestore();
        },
        [onRestore, pathname, router],
    );

    // dock magnification: icons grow near the pointer, straight on the DOM (no re-render per move)
    function onDockMove(event: React.MouseEvent<HTMLDivElement>) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        for (const icon of dock.current?.querySelectorAll<HTMLElement>("[data-dock-icon]") ?? []) {
            const rect = icon.getBoundingClientRect();
            const distance = event.clientX - (rect.left + rect.width / 2);
            const scale = 1 + 0.4 * Math.exp(-(distance * distance) / (2 * 54 * 54));
            icon.style.transform = `translateY(${-(scale - 1) * 22}px) scale(${scale})`;
        }
    }

    function onDockLeave() {
        for (const icon of dock.current?.querySelectorAll<HTMLElement>("[data-dock-icon]") ?? []) {
            icon.style.transform = "";
        }
    }

    const titleOf = (id: AppId): string => {
        if (id === "terminal") return d.apps.terminal;
        if (id === "apps") return "Apps";
        if (id === "arcade") return d.games.title;
        if (id in d.games.names) return d.games.names[id as keyof typeof d.games.names];
        return appName(id as UtilityId, locale);
    };
    const isOn = (id: AppId) => focus === id && wins[id].open && !wins[id].minimized;

    // pinned apps, then the games that are open right now (like the running apps of a real dock)
    const dockApps = APP_IDS.filter((id) => PINNED.includes(id) || wins[id].open);
    const focusedTitle = focus ? titleOf(focus) : "vaiperui";
    const clock = now
        ? new Intl.DateTimeFormat(htmlLang[locale], {
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
          }).format(now)
        : "";

    function content(id: AppId): React.ReactNode {
        const game = { active: isOn(id), t: d.games, locale };
        switch (id) {
            case "terminal":
                return (
                    <Terminal
                        active={focus === "terminal"}
                        version={version}
                        actions={{
                            openApp: launch,
                            openPage,
                            switchLocale,
                            nuke: onNuke,
                            exit: () => dismiss("terminal", { open: false }),
                        }}
                    />
                );
            case "arcade":
                return <Arcade labels={d.games} onPlay={launch} />;
            case "apps":
                return <Apps locale={locale} onOpen={launch} />;
            case "playground":
                return <Playground active={isOn(id)} locale={locale} />;
            case "masklab":
                return <MaskLab active={isOn(id)} locale={locale} />;
            case "theme":
                return <ThemeStudio active={isOn(id)} locale={locale} />;
            case "installer":
                return <Installer active={isOn(id)} locale={locale} />;
            case "changelog":
                return <Changelog active={isOn(id)} locale={locale} version={version} />;
            case "notes":
                return <Notes active={isOn(id)} locale={locale} />;
            case "calculator":
                return <Calculator active={isOn(id)} locale={locale} />;
            case "clock":
                return <Clock active={isOn(id)} locale={locale} />;
            case "calendar":
                return <Calendar active={isOn(id)} locale={locale} />;
            case "converter":
                return <Converter active={isOn(id)} locale={locale} />;
            case "cssgen":
                return <CssLab active={isOn(id)} locale={locale} />;
            case "settings":
                return <Settings active={isOn(id)} locale={locale} onSwitchLocale={switchLocale} />;
            case "snake":
                return <Snake labels={d.snake} active={isOn("snake")} />;
            case "mines":
                return (
                    <Minesweeper labels={d.mines} active={isOn("mines")} onLayout={setMinesSize} />
                );
            case "tictactoe":
                return <TicTacToe {...game} />;
            case "memory":
                return <Memory {...game} />;
            case "colormatch":
                return <ColorMatch {...game} />;
            case "g2048":
                return <Game2048 {...game} />;
            case "wordle":
                return <Wordle {...game} />;
            case "bughunt":
                return <BugHunt {...game} />;
            case "flappy":
                return <Flappy {...game} />;
            case "dino":
                return <Dino {...game} />;
            case "pong":
                return <Pong {...game} />;
            case "breakout":
                return <Breakout {...game} />;
            case "stack":
                return <Stack {...game} />;
            case "invaders":
                return <Invaders {...game} />;
        }
    }

    return createPortal(
        <div className="desktop-in fixed inset-0 z-[100] overflow-hidden bg-bg-0 text-ink">
            {/* wallpaper (chosen in Settings) */}
            <Wallpaper id={wallpaper} />

            {/* menu bar */}
            <div
                style={{ height: MENU_BAR }}
                className="absolute inset-x-0 top-0 z-[5000] flex items-center justify-between border-b border-line bg-bg-1/70 px-3 font-mono text-xs backdrop-blur-xl"
            >
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={onRestore}
                        aria-label={d.back}
                        title={d.back}
                        className="cursor-pointer font-display font-semibold text-ink text-sm focus-visible:outline-2 focus-visible:outline-accent-blue"
                    >
                        vaiper<span className="text-accent-blue">ui</span>
                    </button>
                    <span className="font-semibold text-ink">{focusedTitle}</span>
                </div>
                <div className="flex items-center gap-4">
                    <Battery locale={locale} />
                    <time className="text-ink-dim tabular-nums">{clock}</time>
                </div>
            </div>

            {APP_IDS.map((id) => {
                const win = wins[id];
                if (!win.open) return null;
                const [width, height] = id === "mines" ? minesSize : WINDOW_SIZES[id];
                return (
                    <AppWindow
                        key={id}
                        title={titleOf(id)}
                        labels={{
                            close: labels.close,
                            minimize: labels.minimize,
                            zoom: labels.zoom,
                        }}
                        x={win.x}
                        y={win.y}
                        z={win.z}
                        width={width}
                        height={height}
                        focused={focus === id}
                        zoomed={win.zoom}
                        minimized={win.minimized}
                        onFocus={() => bringToFront(id)}
                        onMove={(x, y) => patch(id, { x, y })}
                        onClose={() => dismiss(id, { open: false })}
                        onMinimize={() => dismiss(id, { minimized: true })}
                        onZoom={() => patch(id, { zoom: !win.zoom })}
                    >
                        {content(id)}
                    </AppWindow>
                );
            })}

            {/* dock */}
            <div className="dock-in absolute bottom-3 left-1/2 z-[5000] -translate-x-1/2">
                <div
                    ref={dock}
                    role="toolbar"
                    aria-label="Dock"
                    onMouseMove={onDockMove}
                    onMouseLeave={onDockLeave}
                    className="flex items-end gap-3 rounded-2xl border border-line-strong bg-bg-2/60 px-2.5 pt-2 pb-2.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl"
                >
                    <DockButton
                        ref={home}
                        label={d.back}
                        onClick={onRestore}
                        running={false}
                        icon={<AppIcon id="page" />}
                    />
                    <span aria-hidden="true" className="mb-1 h-10 w-px self-end bg-line-strong" />
                    {dockApps.map((id) => (
                        <DockButton
                            key={id}
                            label={d.open.replace("{app}", titleOf(id))}
                            tooltip={titleOf(id)}
                            onClick={() => launch(id)}
                            running={wins[id].open}
                            bouncing={bounce === id}
                            icon={<AppIcon id={id} />}
                        />
                    ))}
                </div>
            </div>
        </div>,
        document.body,
    );
}

const DockButton = forwardRef<
    HTMLButtonElement,
    {
        label: string;
        tooltip?: string;
        onClick: () => void;
        running: boolean;
        bouncing?: boolean;
        icon: React.ReactNode;
    }
>(function DockButton({ label, tooltip, onClick, running, bouncing, icon }, ref) {
    return (
        <button
            ref={ref}
            type="button"
            aria-label={label}
            onClick={onClick}
            className="group relative flex cursor-pointer flex-col items-center focus-visible:outline-2 focus-visible:outline-accent-blue"
        >
            <span
                data-dock-icon
                className={`origin-bottom transition-transform duration-150 ease-out motion-reduce:transition-none ${
                    bouncing ? "dock-bounce" : ""
                }`}
            >
                {icon}
            </span>
            <span
                aria-hidden="true"
                className={`mt-1 size-1 rounded-full ${running ? "bg-ink-dim" : "bg-transparent"}`}
            />
            {tooltip ? (
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md border border-line-strong bg-bg-1 px-2 py-1 font-mono text-[11px] text-ink opacity-0 transition-opacity group-hover:opacity-100"
                >
                    {tooltip}
                </span>
            ) : null}
        </button>
    );
});
