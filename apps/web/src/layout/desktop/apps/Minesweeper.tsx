"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useBest } from "../games/shared";
import { Confetti } from "./Confetti";

export type MinesLabels = {
    mines: string;
    time: string;
    best: string;
    newGame: string;
    flag: string;
    won: string;
    lost: string;
    levels: { easy: string; medium: string; hard: string; veryHard: string };
};

type Level = "easy" | "medium" | "hard" | "veryHard";
type Config = { rows: number; cols: number; mines: number; cell: number };
type Cell = { mine: boolean; adj: number; revealed: boolean; flagged: boolean };
type Board = Cell[];
type Status = "ready" | "playing" | "won" | "lost";

const LEVELS: Record<Level, Config> = {
    easy: { rows: 9, cols: 9, mines: 10, cell: 32 },
    medium: { rows: 14, cols: 14, mines: 30, cell: 28 },
    hard: { rows: 18, cols: 18, mines: 55, cell: 24 },
    veryHard: { rows: 22, cols: 22, mines: 100, cell: 21 },
};
const LEVEL_ORDER: Level[] = ["easy", "medium", "hard", "veryHard"];
const LEVEL_KEY = "vaiperui:mines-level";

// the window grows with the board: the board plus the title bar, toolbar and footer around it
export const minesWindowSize = (level: Level): [number, number] => {
    const { cols, rows, cell } = LEVELS[level];
    return [Math.max(380, cols * cell + 70), rows * cell + 232];
};

const emptyBoard = ({ rows, cols }: Config): Board =>
    Array.from({ length: rows * cols }, () => ({
        mine: false,
        adj: 0,
        revealed: false,
        flagged: false,
    }));

function neighbours(index: number, { rows, cols }: Config): number[] {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const out: number[] = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr;
            const c = col + dc;
            if ((dr || dc) && r >= 0 && r < rows && c >= 0 && c < cols) out.push(r * cols + c);
        }
    }
    return out;
}

// mines are placed after the first click, so that click (and its ring) is always safe
function seed(board: Board, safe: number, config: Config): Board {
    const next = board.map((cell) => ({ ...cell }));
    const forbidden = new Set([safe, ...neighbours(safe, config)]);
    let placed = 0;
    while (placed < config.mines) {
        const index = Math.floor(Math.random() * next.length);
        const cell = next[index];
        if (cell && !cell.mine && !forbidden.has(index)) {
            cell.mine = true;
            placed++;
        }
    }
    next.forEach((cell, index) => {
        cell.adj = neighbours(index, config).filter((n) => next[n]?.mine).length;
    });
    return next;
}

function reveal(board: Board, start: number, config: Config): Board {
    const next = board.map((cell) => ({ ...cell }));
    const queue = [start];
    while (queue.length > 0) {
        const index = queue.pop();
        const cell = index === undefined ? undefined : next[index];
        if (index === undefined || !cell || cell.revealed || cell.flagged) continue;
        cell.revealed = true;
        if (cell.adj === 0 && !cell.mine) queue.push(...neighbours(index, config));
    }
    return next;
}

const NUMBER_COLOR = [
    "",
    "text-accent-blue",
    "text-[#28c840]",
    "text-[#ff5f57]",
    "text-accent-purple",
    "text-[#febc2e]",
    "text-[#4de0d0]",
    "text-ink",
    "text-ink-dim",
];

function FlagIcon() {
    return (
        <svg viewBox="0 0 16 16" className="size-[60%]" aria-hidden="true">
            <path d="M4 14V2" stroke="#9fb0c9" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4 2.5 12 5.5 4 8.5Z" fill="#ff5f57" />
        </svg>
    );
}

function MineIcon() {
    return (
        <svg viewBox="0 0 16 16" className="size-[60%]" aria-hidden="true">
            <g stroke="#eef2fb" strokeWidth="1.4" strokeLinecap="round">
                <path d="M8 1.5v13M1.5 8h13M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2" />
            </g>
            <circle cx="8" cy="8" r="4" fill="#eef2fb" />
        </svg>
    );
}

export function Minesweeper({
    labels,
    active,
    onLayout,
}: {
    labels: MinesLabels;
    active: boolean;
    onLayout: (size: [number, number]) => void;
}) {
    const [level, setLevel] = useState<Level>("easy");
    const config = LEVELS[level];
    const [board, setBoard] = useState<Board>(() => emptyBoard(LEVELS.easy));
    const [status, setStatus] = useState<Status>("ready");
    const [flagMode, setFlagMode] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [lastClick, setLastClick] = useState(0);
    const timer = useRef<number | undefined>(undefined);
    const [bestTime, reportTime] = useBest(`mines-best:${level}`, true);

    const stopTimer = useCallback(() => window.clearInterval(timer.current), []);
    useEffect(() => stopTimer, [stopTimer]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(LEVEL_KEY);
            if (saved && saved in LEVELS) setLevel(saved as Level);
        } catch {
            // private mode: starts on easy
        }
    }, []);

    // the window follows the board size
    useEffect(() => onLayout(minesWindowSize(level)), [level, onLayout]);

    // the clock only runs while the window is on top
    useEffect(() => {
        if (status !== "playing" || !active) return;
        timer.current = window.setInterval(
            () => setSeconds((value) => Math.min(999, value + 1)),
            1000,
        );
        return stopTimer;
    }, [status, active, stopTimer]);

    function newGame(next: Level = level) {
        stopTimer();
        setBoard(emptyBoard(LEVELS[next]));
        setStatus("ready");
        setSeconds(0);
    }

    function chooseLevel(next: Level) {
        if (next === level) return;
        try {
            localStorage.setItem(LEVEL_KEY, next);
        } catch {
            // private mode: it just won't persist
        }
        setLevel(next);
        newGame(next);
    }

    function open(index: number) {
        if (status === "won" || status === "lost") return;
        if (flagMode) return toggleFlag(index);
        let current = board;
        if (status === "ready") {
            current = seed(board, index, config);
            setStatus("playing");
        }
        const cell = current[index];
        if (!cell || cell.revealed || cell.flagged) return;
        setLastClick(index);
        const next = reveal(current, index, config);
        if (cell.mine) {
            setBoard(next.map((c) => (c.mine ? { ...c, revealed: true } : c)));
            setStatus("lost");
            return;
        }
        if (next.every((c) => c.mine || c.revealed)) {
            // cleared: the mines left hidden get their flags
            setBoard(next.map((c) => (c.mine ? { ...c, flagged: true } : c)));
            reportTime(Math.max(1, seconds));
            setStatus("won");
            return;
        }
        setBoard(next);
    }

    function toggleFlag(index: number) {
        if (status === "won" || status === "lost") return;
        setBoard((current) =>
            current.map((cell, i) =>
                i === index && !cell.revealed ? { ...cell, flagged: !cell.flagged } : cell,
            ),
        );
    }

    const flags = board.filter((cell) => cell.flagged).length;
    const message = status === "won" ? labels.won : status === "lost" ? labels.lost : "";
    const won = status === "won";
    const winRow = Math.floor(lastClick / config.cols);
    const winCol = lastClick % config.cols;

    return (
        // right click is the flag key on a computer: the browser menu never opens in here
        // biome-ignore lint/a11y/noStaticElementInteractions: only suppresses the browser's context menu
        <div
            onContextMenu={(event) => event.preventDefault()}
            className="relative flex h-full flex-col items-center justify-center gap-3 bg-bg-1 p-4"
        >
            <fieldset className="m-0 flex flex-wrap justify-center gap-1 border-0 p-0 font-mono text-[11px]">
                {LEVEL_ORDER.map((id) => (
                    <button
                        key={id}
                        type="button"
                        aria-pressed={level === id}
                        onClick={() => chooseLevel(id)}
                        className={`cursor-pointer rounded-full border px-2.5 py-0.5 transition-colors ${
                            level === id
                                ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                                : "border-line-strong text-ink-faint hover:text-ink"
                        }`}
                    >
                        {labels.levels[id]}
                    </button>
                ))}
            </fieldset>

            <div
                style={{ width: config.cols * config.cell }}
                className="flex items-center justify-between font-mono text-xs text-ink-dim"
            >
                <span>
                    {labels.mines} <b className="text-ink tabular-nums">{config.mines - flags}</b>
                </span>
                <button
                    type="button"
                    aria-pressed={flagMode}
                    onClick={() => setFlagMode((value) => !value)}
                    className={`cursor-pointer rounded-full border px-2.5 py-1 transition-colors ${
                        flagMode
                            ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                            : "border-line-strong text-ink-faint hover:text-ink"
                    }`}
                >
                    {labels.flag}
                </button>
                <span>
                    {labels.time} <b className="text-ink tabular-nums">{seconds}</b>
                    <span className="text-ink-faint">
                        {" "}
                        · {labels.best} {bestTime ?? "–"}
                    </span>
                </span>
            </div>

            <fieldset
                aria-label={labels.mines}
                className={`m-0 grid gap-px overflow-hidden rounded-lg border bg-line-strong p-0 ${
                    won ? "border-[#28c840]/60" : "border-line-strong"
                }`}
                style={{ gridTemplateColumns: `repeat(${config.cols}, ${config.cell}px)` }}
            >
                {board.map((cell, index) => {
                    const shown = cell.revealed;
                    // on a win the board flashes in a wave that starts from the last click
                    const distance = Math.hypot(
                        Math.floor(index / config.cols) - winRow,
                        (index % config.cols) - winCol,
                    );
                    return (
                        <button
                            // biome-ignore lint/suspicious/noArrayIndexKey: the board is a fixed grid
                            key={index}
                            type="button"
                            aria-label={`${Math.floor(index / config.cols) + 1}:${(index % config.cols) + 1}`}
                            onClick={() => open(index)}
                            onContextMenu={(event) => {
                                event.preventDefault();
                                toggleFlag(index);
                            }}
                            style={{
                                height: config.cell,
                                fontSize: config.cell < 24 ? 11 : 13,
                                animationDelay: won ? `${distance * 45}ms` : undefined,
                            }}
                            className={`flex items-center justify-center font-bold font-mono ${
                                shown
                                    ? cell.mine
                                        ? "bg-[#ff5f57]/25"
                                        : "bg-bg-0"
                                    : "cursor-pointer bg-bg-3 hover:bg-bg-2"
                            } ${shown && !cell.mine ? NUMBER_COLOR[cell.adj] : ""} ${won ? "win-cell" : ""}`}
                        >
                            {shown ? (
                                cell.mine ? (
                                    <MineIcon />
                                ) : cell.adj > 0 ? (
                                    cell.adj
                                ) : null
                            ) : cell.flagged ? (
                                <FlagIcon />
                            ) : null}
                        </button>
                    );
                })}
            </fieldset>

            <div className="flex h-8 items-center gap-3 font-mono text-xs">
                <span
                    aria-live="polite"
                    className={won ? "win-message text-[#28c840]" : "text-ink-dim"}
                >
                    {message}
                </span>
                <button
                    type="button"
                    onClick={() => newGame()}
                    className="cursor-pointer rounded-full border border-line-strong px-3 py-1 text-ink-dim transition-colors hover:border-accent-blue/60 hover:text-ink"
                >
                    {labels.newGame}
                </button>
            </div>

            <Confetti run={won} />
        </div>
    );
}
