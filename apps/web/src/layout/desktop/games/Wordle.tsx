"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { type GameProps, GameShell, PillButton, useGameKeys, usePersistedState } from "./shared";
import { normalize, WORDS } from "./wordlists";

const LENGTH = 5;
const TRIES = 6;
type State = "hit" | "near" | "miss";

// two passes, so repeated letters are colored the way the real game does
function evaluate(guess: string, answer: string): State[] {
    const result: State[] = Array(LENGTH).fill("miss");
    const pool = answer.split("");
    for (let i = 0; i < LENGTH; i++) {
        if (guess[i] === answer[i]) {
            result[i] = "hit";
            pool[i] = "";
        }
    }
    for (let i = 0; i < LENGTH; i++) {
        if (result[i] === "hit") continue;
        const at = pool.indexOf(guess[i] ?? "");
        if (at >= 0) {
            result[i] = "near";
            pool[at] = "";
        }
    }
    return result;
}

const TILE: Record<State, string> = {
    hit: "border-[#28c840] bg-[#28c840]/80 text-[#05070d]",
    near: "border-[#febc2e] bg-[#febc2e]/80 text-[#05070d]",
    miss: "border-line-strong bg-bg-3 text-ink-dim",
};
const KEYBOARD = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

const pick = (locale: GameProps["locale"]) => {
    const list = WORDS[locale].map(normalize).filter((word) => word.length === LENGTH);
    return list[Math.floor(Math.random() * list.length)] ?? "react";
};

export function Wordle({ active, t, locale }: GameProps) {
    const w = t.wordle;
    const ui = t.ui;
    const [answer, setAnswer] = useState(() => pick(locale));
    const [guesses, setGuesses] = useState<string[]>([]);
    const [current, setCurrent] = useState("");
    const [shake, setShake] = useState(false);
    const [stats, setStats] = usePersistedState("wordle-stats", {
        played: 0,
        wins: 0,
        streak: 0,
        bestStreak: 0,
    });
    const shakeTimer = useRef<number | undefined>(undefined);
    const won = guesses[guesses.length - 1] === answer;
    const lost = !won && guesses.length >= TRIES;
    const over = won || lost;

    useEffect(() => () => window.clearTimeout(shakeTimer.current), []);

    // each finished game is counted once
    useEffect(() => {
        if (!over) return;
        setStats((s) => {
            const streak = won ? s.streak + 1 : 0;
            return {
                played: s.played + 1,
                wins: s.wins + (won ? 1 : 0),
                streak,
                bestStreak: Math.max(s.bestStreak, streak),
            };
        });
    }, [over, won, setStats]);

    const restart = useCallback(() => {
        setAnswer(pick(locale));
        setGuesses([]);
        setCurrent("");
    }, [locale]);

    const press = useCallback(
        (key: string) => {
            if (over) {
                if (key === "Enter") restart();
                return;
            }
            if (key === "Backspace") setCurrent((value) => value.slice(0, -1));
            else if (key === "Enter") {
                if (current.length < LENGTH) {
                    setShake(true);
                    window.clearTimeout(shakeTimer.current);
                    shakeTimer.current = window.setTimeout(() => setShake(false), 450);
                    return;
                }
                setGuesses((list) => [...list, current]);
                setCurrent("");
            } else if (/^[a-z]$/.test(key) && current.length < LENGTH) {
                setCurrent((value) => value + key);
            }
        },
        [over, current, restart],
    );

    const onKey = useCallback(
        (event: KeyboardEvent) => {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            const key = event.key.length === 1 ? normalize(event.key) : event.key;
            if (key === "Backspace" || key === "Enter" || /^[a-z]$/.test(key)) {
                event.preventDefault();
                press(key);
            }
        },
        [press],
    );
    useGameKeys(active, onKey);

    // best state seen per letter, for the on-screen keyboard
    const seen = new Map<string, State>();
    for (const guess of guesses) {
        evaluate(guess, answer).forEach((state, i) => {
            const letter = guess[i] ?? "";
            const old = seen.get(letter);
            if (!old || state === "hit" || (state === "near" && old === "miss"))
                seen.set(letter, state);
        });
    }

    return (
        <GameShell gap="gap-3">
            <div className="flex flex-col gap-1.5">
                {Array.from({ length: TRIES }, (_, row) => {
                    const guess = guesses[row];
                    const isCurrent = row === guesses.length && !over;
                    const letters = guess ?? (isCurrent ? current : "");
                    const states = guess ? evaluate(guess, answer) : null;
                    return (
                        <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: fixed rows
                            key={row}
                            className={`flex gap-1.5 ${isCurrent && shake ? "wordle-shake" : ""}`}
                        >
                            {Array.from({ length: LENGTH }, (_, col) => {
                                const letter = letters[col] ?? "";
                                const state = states?.[col];
                                return (
                                    <span
                                        // biome-ignore lint/suspicious/noArrayIndexKey: fixed columns
                                        key={col}
                                        style={
                                            state ? { animationDelay: `${col * 140}ms` } : undefined
                                        }
                                        className={`flex size-11 items-center justify-center rounded-md border font-bold font-mono text-xl uppercase ${
                                            state
                                                ? `wordle-flip ${TILE[state]}`
                                                : letter
                                                  ? "border-ink-faint bg-bg-0 text-ink"
                                                  : "border-line-strong bg-bg-0"
                                        }`}
                                    >
                                        {letter}
                                    </span>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            <div className="flex h-6 items-center font-mono text-xs">
                <span aria-live="polite" className={won ? "text-[#28c840]" : "text-ink-dim"}>
                    {won ? w.won : lost ? w.lost.replace("{word}", answer.toUpperCase()) : w.hint}
                </span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
                {KEYBOARD.map((row, index) => (
                    <div key={row} className="flex gap-1">
                        {index === 2 ? (
                            <button
                                type="button"
                                onClick={() => press("Enter")}
                                className="cursor-pointer rounded-md bg-bg-3 px-2 font-mono text-[10px] text-ink-dim hover:text-ink"
                            >
                                {w.enter}
                            </button>
                        ) : null}
                        {row.split("").map((letter) => {
                            const state = seen.get(letter);
                            return (
                                <button
                                    key={letter}
                                    type="button"
                                    onClick={() => press(letter)}
                                    className={`flex h-9 w-6 cursor-pointer items-center justify-center rounded-md font-mono text-xs uppercase ${
                                        state === "hit"
                                            ? "bg-[#28c840]/80 text-[#05070d]"
                                            : state === "near"
                                              ? "bg-[#febc2e]/80 text-[#05070d]"
                                              : state === "miss"
                                                ? "bg-bg-0 text-ink-faint"
                                                : "bg-bg-3 text-ink"
                                    }`}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                        {index === 2 ? (
                            <button
                                type="button"
                                aria-label="Backspace"
                                onClick={() => press("Backspace")}
                                className="cursor-pointer rounded-md bg-bg-3 px-2 font-mono text-xs text-ink-dim hover:text-ink"
                            >
                                ⌫
                            </button>
                        ) : null}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px] text-ink-faint">
                <span>
                    {ui.played} <b className="text-ink-dim tabular-nums">{stats.played}</b>
                </span>
                <span>
                    {ui.wins} <b className="text-ink-dim tabular-nums">{stats.wins}</b>
                </span>
                <span>
                    {ui.streak} <b className="text-ink-dim tabular-nums">{stats.streak}</b>
                </span>
                <span>
                    {ui.best} <b className="text-ink-dim tabular-nums">{stats.bestStreak}</b>
                </span>
            </div>
            <PillButton onClick={restart}>{ui.newGame}</PillButton>
        </GameShell>
    );
}
