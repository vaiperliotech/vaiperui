"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { type GameProps, GameShell, Overlay, StatBar, useBest, useGameKeys } from "./shared";

const W = 380;
const H = 380;
const BUG = 34;

// the "editor" the bugs crawl out of: just dressed-up text, nothing runs
const CODE: Array<Array<[string, string]>> = [
    [
        ["import", "text-accent-purple"],
        [" { Button } ", "text-ink-dim"],
        ["from", "text-accent-purple"],
        [' "vaiperui"', "text-[#28c840]"],
    ],
    [],
    [
        ["export function", "text-accent-purple"],
        [" App() {", "text-ink-dim"],
    ],
    [
        ["  const", "text-accent-purple"],
        [" [count, setCount] = ", "text-ink-dim"],
        ["useState", "text-accent-blue"],
        ["(0)", "text-ink-dim"],
    ],
    [
        ["  const", "text-accent-purple"],
        [" user = ", "text-ink-dim"],
        ["await", "text-accent-purple"],
        [" fetch(url)", "text-accent-blue"],
    ],
    [
        ["  if", "text-accent-purple"],
        [" (user.name == null) {", "text-ink-dim"],
    ],
    [
        ["    return", "text-accent-purple"],
        [" <Spinner />", "text-ink-dim"],
    ],
    [["  }", "text-ink-dim"]],
    [
        ["  return", "text-accent-purple"],
        [" (", "text-ink-dim"],
    ],
    [
        ["    <Button", "text-accent-blue"],
        [" onClick", "text-ink-dim"],
        ["={() => setCount(count + 1)}", "text-ink-dim"],
        [">", "text-accent-blue"],
    ],
    [["      {count}", "text-ink-dim"]],
    [["    </Button>", "text-accent-blue"]],
    [["  )", "text-ink-dim"]],
    [["}", "text-ink-dim"]],
    [],
    [["// TODO: remove this before shipping", "text-ink-faint"]],
    [
        ["console.log", "text-accent-blue"],
        ['("here")', "text-[#28c840]"],
    ],
    [
        ["setTimeout", "text-accent-blue"],
        ["(() => retry(), 0)", "text-ink-dim"],
    ],
];

type Bug = { id: number; x: number; y: number; born: number; ttl: number };
type Status = "ready" | "running" | "over";

function BugIcon() {
    return (
        <svg viewBox="0 0 32 32" className="size-full" aria-hidden="true">
            <g stroke="#ff5f57" strokeWidth="2" strokeLinecap="round">
                <path d="M6 10l5 4M26 10l-5 4M4 17h7M28 17h-7M6 25l5-4M26 25l-5-4M13 5l2 4M19 5l-2 4" />
            </g>
            <ellipse cx="16" cy="18" rx="7" ry="9" fill="#ff5f57" />
            <path d="M16 9v18" stroke="#05070d" strokeWidth="1.4" />
            <circle cx="13.5" cy="13" r="1.3" fill="#05070d" />
            <circle cx="18.5" cy="13" r="1.3" fill="#05070d" />
        </svg>
    );
}

export function BugHunt({ active, t }: GameProps) {
    const ui = t.ui;
    const b = t.bughunt;
    const [status, setStatus] = useState<Status>("ready");
    const [bugs, setBugs] = useState<Bug[]>([]);
    const [fixed, setFixed] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [combo, setCombo] = useState(0);
    const [best, report] = useBest("bughunt-best");
    const ids = useRef(0);
    const spawnAt = useRef(0);
    const stats = useRef({ score: 0, lives: 3, combo: 0, squashed: 0 });
    const statusRef = useRef<Status>("ready");

    const set = useCallback((next: Status) => {
        statusRef.current = next;
        setStatus(next);
    }, []);

    const start = useCallback(() => {
        stats.current = { score: 0, lives: 3, combo: 0, squashed: 0 };
        spawnAt.current = 0;
        setBugs([]);
        setFixed([]);
        setScore(0);
        setLives(3);
        setCombo(0);
        set("running");
    }, [set]);

    // a 60ms tick: bugs that stay too long escape and cost a life, new ones appear faster over time
    useEffect(() => {
        if (status !== "running" || !active) return;
        const tick = window.setInterval(() => {
            const now = performance.now();
            const s = stats.current;
            const level = Math.min(1, s.squashed / 40);
            setBugs((current) => {
                const alive: Bug[] = [];
                let escaped = 0;
                for (const bug of current) {
                    if (now - bug.born > bug.ttl) escaped += 1;
                    else alive.push(bug);
                }
                if (escaped > 0) {
                    s.lives -= escaped;
                    s.combo = 0;
                    setLives(Math.max(0, s.lives));
                    setCombo(0);
                    if (s.lives <= 0) {
                        report(s.score);
                        set("over");
                        return [];
                    }
                }
                if (now >= spawnAt.current) {
                    spawnAt.current = now + 950 - level * 560;
                    alive.push({
                        id: ++ids.current,
                        x: 8 + Math.random() * (W - BUG - 16),
                        y: 8 + Math.random() * (H - BUG - 16),
                        born: now,
                        ttl: 1700 - level * 900,
                    });
                }
                return alive;
            });
        }, 60);
        return () => window.clearInterval(tick);
    }, [status, active, report, set]);

    function squash(bug: Bug) {
        const s = stats.current;
        s.combo += 1;
        s.squashed += 1;
        s.score += 10 * Math.min(5, s.combo);
        setScore(s.score);
        setCombo(s.combo);
        setBugs((current) => current.filter((item) => item.id !== bug.id));
        setFixed((list) => [...list, { id: bug.id, x: bug.x, y: bug.y }]);
        window.setTimeout(() => setFixed((list) => list.filter((item) => item.id !== bug.id)), 600);
    }

    // a click on empty code is a miss: it breaks the combo
    function missed() {
        if (statusRef.current !== "running") return;
        stats.current.combo = 0;
        setCombo(0);
    }

    useGameKeys(active, (event) => {
        if ((event.key === " " || event.key === "r") && statusRef.current !== "running") {
            event.preventDefault();
            start();
        }
    });

    useEffect(() => {
        if (!active && statusRef.current === "running") set("ready");
    }, [active, set]);

    return (
        <GameShell>
            <StatBar
                width={W}
                items={[
                    [ui.score, score],
                    [ui.lives, "♥".repeat(Math.max(0, lives)) || "–"],
                    [ui.best, Math.max(best ?? 0, score)],
                ]}
            />
            {/* the board only reacts to the pointer: the bugs themselves are real buttons */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: a miss is a pointer-only event */}
            <div
                onClick={missed}
                style={{ width: W, height: H }}
                className="relative cursor-crosshair overflow-hidden rounded-lg border border-line-strong bg-bg-0 font-mono text-[11px] leading-[21px]"
            >
                <div className="absolute inset-0 flex">
                    <div className="w-8 shrink-0 select-none border-line border-r bg-bg-2/60 pt-2 text-right text-ink-faint">
                        {CODE.map((_, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: static code listing
                            <div key={index} className="pr-2">
                                {index + 1}
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 overflow-hidden whitespace-pre pt-2 pl-2">
                        {CODE.map((line, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: static code listing
                            <div key={index}>
                                {line.map(([text, color]) => (
                                    <span key={text} className={color}>
                                        {text}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {bugs.map((bug) => (
                    <button
                        key={bug.id}
                        type="button"
                        aria-label="bug"
                        onClick={(event) => {
                            event.stopPropagation();
                            squash(bug);
                        }}
                        style={{ left: bug.x, top: bug.y, width: BUG, height: BUG }}
                        className="bug-in absolute cursor-pointer"
                    >
                        <BugIcon />
                    </button>
                ))}
                {fixed.map((item) => (
                    <span
                        key={item.id}
                        style={{ left: item.x, top: item.y }}
                        className="bug-fixed pointer-events-none absolute font-bold text-[#28c840] text-xs"
                    >
                        ✓ fixed
                    </span>
                ))}

                {status !== "running" ? (
                    <Overlay>
                        {status === "over" ? (
                            <div className="flex flex-col gap-1">
                                <span>{ui.over}</span>
                                <span className="text-ink-dim">{ui.restart}</span>
                            </div>
                        ) : (
                            b.hint
                        )}
                    </Overlay>
                ) : null}
            </div>
            <div className="flex h-8 items-center gap-3 font-mono text-xs">
                <span className="text-ink-dim">
                    {combo > 1 ? `${b.combo} ×${Math.min(5, combo)}` : ""}
                </span>
                {status !== "running" ? (
                    <button
                        type="button"
                        onClick={start}
                        className="cursor-pointer rounded-full border border-line-strong px-3 py-1 text-ink-dim transition-colors hover:border-accent-blue/60 hover:text-ink"
                    >
                        {status === "over" ? ui.newGame : ui.start}
                    </button>
                ) : null}
            </div>
        </GameShell>
    );
}
