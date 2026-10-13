"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
    type GameProps,
    GameShell,
    PillButton,
    Pills,
    StatBar,
    useGameKeys,
    usePersistedState,
} from "./shared";

type Mark = "X" | "O" | null;
const LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function winner(board: Mark[]): { mark: Mark; line: number[] } | null {
    for (const line of LINES) {
        const [a, b, c] = line as [number, number, number];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { mark: board[a], line };
        }
    }
    return null;
}

// perfect play: the O side maximizes, X minimizes
function minimax(board: Mark[], turn: "X" | "O"): number {
    const result = winner(board);
    if (result) return result.mark === "O" ? 1 : -1;
    if (board.every(Boolean)) return 0;
    let best = turn === "O" ? -2 : 2;
    for (let i = 0; i < 9; i++) {
        if (board[i]) continue;
        board[i] = turn;
        const score = minimax(board, turn === "O" ? "X" : "O");
        board[i] = null;
        best = turn === "O" ? Math.max(best, score) : Math.min(best, score);
    }
    return best;
}

function aiMove(board: Mark[], unbeatable: boolean): number {
    const free = board.map((m, i) => (m ? -1 : i)).filter((i) => i >= 0);
    if (!unbeatable) return free[Math.floor(Math.random() * free.length)] ?? 0;
    let bestScore = -2;
    let moves: number[] = [];
    for (const i of free) {
        board[i] = "O";
        const score = minimax(board, "X");
        board[i] = null;
        if (score > bestScore) {
            bestScore = score;
            moves = [i];
        } else if (score === bestScore) moves.push(i);
    }
    return moves[Math.floor(Math.random() * moves.length)] ?? 0;
}

function MarkIcon({ mark }: { mark: "X" | "O" }) {
    return mark === "X" ? (
        <svg viewBox="0 0 24 24" className="size-12" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke="#4da3ff" strokeWidth="3" strokeLinecap="round" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" className="size-12" aria-hidden="true">
            <circle cx="12" cy="12" r="7.5" fill="none" stroke="#a78bfa" strokeWidth="3" />
        </svg>
    );
}

export function TicTacToe({ active, t }: GameProps) {
    const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
    const [unbeatable, setUnbeatable] = useState(false);
    const [score, setScore] = usePersistedState("tictactoe-score", { you: 0, draw: 0, cpu: 0 });
    const timer = useRef<number | undefined>(undefined);
    const result = winner(board);
    const full = board.every(Boolean);
    const over = Boolean(result) || full;
    const ui = t.ui;

    useEffect(() => () => window.clearTimeout(timer.current), []);

    const finish = useCallback(
        (next: Mark[]) => {
            const done = winner(next);
            if (done)
                setScore((s) =>
                    done.mark === "X" ? { ...s, you: s.you + 1 } : { ...s, cpu: s.cpu + 1 },
                );
            else if (next.every(Boolean)) setScore((s) => ({ ...s, draw: s.draw + 1 }));
            return Boolean(done) || next.every(Boolean);
        },
        [setScore],
    );

    function play(index: number) {
        if (over || board[index]) return;
        const next = [...board];
        next[index] = "X";
        setBoard(next);
        if (finish(next)) return;
        timer.current = window.setTimeout(() => {
            const reply = [...next];
            reply[aiMove(reply, unbeatable)] = "O";
            setBoard(reply);
            finish(reply);
        }, 380);
    }

    function reset() {
        window.clearTimeout(timer.current);
        setBoard(Array(9).fill(null));
    }

    // number keys 1-9 mirror the numeric keypad layout; the handler is re-made as the board changes
    useGameKeys(active, (event) => {
        const n = Number(event.key);
        if (n >= 1 && n <= 9) {
            play((2 - Math.floor((n - 1) / 3)) * 3 + ((n - 1) % 3));
        } else if (event.key === "r" || event.key === "Enter") reset();
    });

    const message = result ? (result.mark === "X" ? ui.win : ui.over) : full ? ui.draw : "";

    return (
        <GameShell>
            <Pills
                value={unbeatable ? "hard" : "easy"}
                options={[
                    { id: "easy", label: ui.easy },
                    { id: "hard", label: ui.unbeatable },
                ]}
                onChange={(next) => {
                    setUnbeatable(next === "hard");
                    reset();
                }}
            />
            <StatBar
                width={288}
                items={[
                    [ui.you, score.you],
                    [ui.draw, score.draw],
                    ["CPU", score.cpu],
                ]}
            />
            <div className="grid grid-cols-3 gap-1.5">
                {board.map((mark, index) => {
                    const winning = result?.line.includes(index);
                    return (
                        <button
                            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed 3x3 board
                            key={index}
                            type="button"
                            aria-label={`${Math.floor(index / 3) + 1}:${(index % 3) + 1}${mark ? ` ${mark}` : ""}`}
                            onClick={() => play(index)}
                            className={`flex size-24 items-center justify-center rounded-xl border transition-colors ${
                                winning
                                    ? "border-[#28c840]/70 bg-[#28c840]/15"
                                    : "border-line-strong bg-bg-0 hover:bg-bg-2"
                            } ${mark || over ? "cursor-default" : "cursor-pointer"}`}
                        >
                            {mark ? <MarkIcon mark={mark} /> : null}
                        </button>
                    );
                })}
            </div>
            <div className="flex h-8 items-center gap-3">
                <span aria-live="polite" className="font-mono text-xs text-ink-dim">
                    {message}
                </span>
                <PillButton onClick={reset}>{ui.newGame}</PillButton>
            </div>
        </GameShell>
    );
}
