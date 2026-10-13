"use client";

import { useEffect, useRef, useState } from "react";

import { COMPONENT_NAMES } from "@/data/guides";
import { isLocale, type Locale, locales } from "@/i18n/config";
import { RECORDS, readRecord } from "../records";
import { APP_SLUGS, type AppId, GAME_SLUGS } from "../registry";

type Line = { kind: "in" | "out" | "err"; text: string };
type BatteryInfo = {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
};

export type TerminalActions = {
    openApp: (app: AppId) => void;
    /** Goes to a page of the site and brings the page window back. */
    openPage: (path: string) => void;
    switchLocale: (locale: Locale) => void;
    /** `rm -rf /`: switches the whole page off, for real. */
    nuke: () => void;
    exit: () => void;
};

const GAMES = Object.keys(GAME_SLUGS);
const APPS = Object.keys(APP_SLUGS);
const COMMANDS = [
    "help",
    "ls",
    "open",
    "install",
    "lang",
    "neofetch",
    "games",
    "play",
    "scores",
    "battery",
    "apps",
    "run",
    ...GAMES,
    ...APPS,
    "clear",
    "exit",
];
const PAGES = ["docs", "home", ...Object.keys(COMPONENT_NAMES)];
const MASKS = 9;

function describeRecord(key: string): string {
    const raw = readRecord(key);
    if (raw === null) return "–";
    if (key === "tictactoe-score") {
        const [you, draw, cpu] = raw.split("-");
        return `you ${you} · draw ${draw} · cpu ${cpu}`;
    }
    if (key === "wordle-stats") {
        const stats = JSON.parse(localStorage.getItem("vaiperui:wordle-stats") ?? "{}") as {
            played?: number;
            wins?: number;
            streak?: number;
            bestStreak?: number;
        };
        return `${stats.wins ?? 0}/${stats.played ?? 0} won · streak ${stats.streak ?? 0} (best ${stats.bestStreak ?? 0})`;
    }
    return raw;
}

const HELP = [
    "help                 this list",
    "ls                   list the components",
    "open <page>          docs, button, input, select",
    "install              copy the install command",
    "lang <en|pt|es>      switch the language",
    "neofetch             about this site",
    "games                list the games, easiest first",
    "scores               your records (scores clear: wipe them)",
    "battery              what this browser reports about the battery",
    "apps                 list the apps (playground, notes, clock…)",
    "run <app>            open one (or just type its name)",
    "play <game>          launch one (or just type its name)",
    "clear, exit",
];

export function Terminal({
    active,
    version,
    actions,
}: {
    active: boolean;
    version: string;
    actions: TerminalActions;
}) {
    const [lines, setLines] = useState<Line[]>([
        { kind: "out", text: `vaiperui terminal ${version}` },
        { kind: "out", text: 'type "help" to see what it can do' },
    ]);
    const [value, setValue] = useState("");
    const history = useRef<string[]>([]);
    const cursor = useRef(-1);
    const input = useRef<HTMLInputElement>(null);
    const scroller = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (active) input.current?.focus();
    }, [active]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: lines is the scroll trigger
    useEffect(() => {
        scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
    }, [lines]);

    function print(...entries: Line[]) {
        setLines((current) => [...current, ...entries]);
    }
    const out = (text: string): Line => ({ kind: "out", text });
    const err = (text: string): Line => ({ kind: "err", text });

    function launchGame(slug: string) {
        const id = GAME_SLUGS[slug] ?? APP_SLUGS[slug];
        if (!id) return;
        print(out(`launching ${slug}…`));
        actions.openApp(id);
    }

    function run(raw: string) {
        const command = raw.trim();
        print({ kind: "in", text: command });
        if (!command) return;
        history.current.push(command);
        cursor.current = history.current.length;

        const [name = "", ...args] = command.split(/\s+/);
        const first = args[0]?.toLowerCase() ?? "";

        if (command.startsWith("rm -rf /")) {
            print(out("removing everything…"));
            window.setTimeout(actions.nuke, 700);
            return;
        }

        switch (name.toLowerCase()) {
            case "help":
                print(...HELP.map(out));
                break;
            case "ls":
                print(out(Object.values(COMPONENT_NAMES).join("   ")));
                break;
            case "open": {
                if (!PAGES.includes(first)) {
                    print(err(`open: ${first || "?"}: no such page (try: ${PAGES.join(", ")})`));
                    break;
                }
                const path = first === "home" ? "/" : first === "docs" ? "/docs" : `/docs/${first}`;
                print(out(`opening ${path}`));
                actions.openPage(path);
                break;
            }
            case "install": {
                const text = "npm install vaiperui";
                print(out(`$ ${text}`));
                navigator.clipboard
                    ?.writeText(text)
                    .then(() => print(out("copied to the clipboard")))
                    .catch(() => {});
                break;
            }
            case "lang":
                if (isLocale(first)) {
                    print(out(`language → ${first}`));
                    actions.switchLocale(first);
                } else {
                    print(err(`lang: use one of ${locales.join(", ")}`));
                }
                break;
            case "neofetch":
                print(
                    out("  ▌▌▌   vaiperui@docs"),
                    out("  ▌▌▌   ------------"),
                    out(`  ▌▌▌   version     ${version}`),
                    out(`  ▌▌▌   components  ${Object.keys(COMPONENT_NAMES).length}`),
                    out(`  ▌▌▌   masks       ${MASKS}`),
                    out(`  ▌▌▌   languages   ${locales.join(", ")}`),
                    out("  ▌▌▌   license     MIT"),
                );
                break;
            case "scores":
                if (first === "clear") {
                    try {
                        for (const [, key] of RECORDS) localStorage.removeItem(`vaiperui:${key}`);
                    } catch {
                        // storage blocked: nothing to clear
                    }
                    print(out("records cleared"));
                } else {
                    print(
                        ...RECORDS.map(([label, key]) =>
                            out(`${label.padEnd(27)}${describeRecord(key)}`),
                        ),
                    );
                }
                break;
            case "games":
                print(out(GAMES.join("  ")));
                break;
            case "battery": {
                const api = (navigator as Navigator & { getBattery?: () => Promise<BatteryInfo> })
                    .getBattery;
                if (!api) {
                    print(
                        err("navigator.getBattery is not available in this browser."),
                        out("Chrome, Edge and Opera expose it; Safari, Firefox and Brave do not."),
                    );
                    break;
                }
                const brave = (
                    navigator as Navigator & { brave?: { isBrave: () => Promise<boolean> } }
                ).brave;
                Promise.all([api.call(navigator), brave?.isBrave().catch(() => false)])
                    .then(([b, isBrave]) => {
                        const minutes = (seconds: number) =>
                            Number.isFinite(seconds) ? `${Math.round(seconds / 60)} min` : "–";
                        print(
                            out(`level            ${Math.round(b.level * 100)}%`),
                            out(`charging         ${b.charging}`),
                            out(`time to full     ${minutes(b.chargingTime)}`),
                            out(`time to empty    ${minutes(b.dischargingTime)}`),
                        );
                        if (isBrave && b.level === 1 && b.charging && b.chargingTime === 0) {
                            print(
                                err(
                                    "Brave reports a fixed 100% to every site (privacy protection), so the real level stays hidden.",
                                ),
                            );
                        }
                    })
                    .catch(() => print(err("the browser refused to share the battery state.")));
                break;
            }
            case "apps":
                print(out(APPS.join("  ")));
                break;
            case "run":
                if (first in APP_SLUGS) launchGame(first);
                else print(err(`run: ${first || "?"}: no such app (type "apps")`));
                break;
            case "play":
                if (first in GAME_SLUGS) launchGame(first);
                else print(err(`play: ${first || "?"}: no such game (type "games")`));
                break;
            case "clear":
                setLines([]);
                break;
            case "exit":
                actions.exit();
                break;
            case "sudo":
                print(err("nice try. this is a documentation site."));
                break;
            default:
                if (name.toLowerCase() in GAME_SLUGS || name.toLowerCase() in APP_SLUGS)
                    launchGame(name.toLowerCase());
                else print(err(`${name}: command not found`));
        }
    }

    function complete() {
        const [head = "", tail] = value.split(/\s+/, 2);
        if (value.includes(" ")) {
            if (head === "open" || head === "play" || head === "run") {
                const pool = head === "open" ? PAGES : head === "play" ? GAMES : APPS;
                const match = pool.filter((entry) => entry.startsWith(tail ?? ""));
                if (match.length === 1) setValue(`${head} ${match[0]}`);
            }
            return;
        }
        const match = COMMANDS.filter((command) => command.startsWith(head));
        if (match.length === 1) setValue(match[0] ?? value);
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        // the page behind must not react to what is typed here
        event.stopPropagation();
        if (event.key === "Enter") {
            run(value);
            setValue("");
        } else if (event.key === "Tab") {
            event.preventDefault();
            complete();
        } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            const step = event.key === "ArrowUp" ? -1 : 1;
            const next = Math.min(history.current.length, Math.max(0, cursor.current + step));
            cursor.current = next;
            setValue(history.current[next] ?? "");
        } else if (event.key === "l" && event.ctrlKey) {
            event.preventDefault();
            setLines([]);
        }
    }

    return (
        // clicking anywhere in the terminal focuses the prompt
        // biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: the prompt itself is the keyboard target
        <div
            onClick={() => input.current?.focus()}
            className="flex h-full cursor-text flex-col bg-[#05070d] font-mono text-[13px] leading-6"
        >
            <div ref={scroller} className="min-h-0 flex-1 overflow-auto p-3 pb-1">
                {lines.map((line, index) => (
                    <p
                        // biome-ignore lint/suspicious/noArrayIndexKey: an append-only log
                        key={index}
                        className={`whitespace-pre-wrap break-words ${
                            line.kind === "err"
                                ? "text-[#ff5f57]"
                                : line.kind === "in"
                                  ? "text-ink"
                                  : "text-ink-dim"
                        }`}
                    >
                        {line.kind === "in" ? <span className="text-accent-blue">$ </span> : null}
                        {line.text}
                    </p>
                ))}
            </div>
            <label className="flex shrink-0 items-center gap-2 px-3 pb-3 text-ink">
                <span className="text-accent-blue">$</span>
                <input
                    ref={input}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                    aria-label="terminal"
                    className="w-full bg-transparent text-ink outline-none caret-accent-blue"
                />
            </label>
        </div>
    );
}
