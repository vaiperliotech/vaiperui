"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { type GameProps, GameShell, PALETTE, PillButton, Pills, StatBar, useBest } from "./shared";

type Size = "small" | "large";
const PAIRS: Record<Size, number> = { small: 8, large: 18 };
const SHAPES = ["circle", "square", "triangle", "diamond", "ring", "plus"] as const;
const SHAPE_COLORS = [PALETTE.blue, PALETTE.violet, PALETTE.green] as const;

// 6 shapes x 3 colors = 18 distinct faces, mixed so the 8 of a small board do not look alike
const FACES = SHAPES.flatMap((shape, i) =>
    SHAPE_COLORS.map((color, j) => ({ shape, color, order: (i * 5 + j * 7) % 18 })),
)
    .sort((a, b) => a.order - b.order)
    .map(({ shape, color }) => ({ shape, color }));

function Face({ shape, color }: { shape: (typeof SHAPES)[number]; color: string }) {
    return (
        <svg viewBox="0 0 24 24" className="size-3/5" aria-hidden="true">
            {shape === "circle" ? <circle cx="12" cy="12" r="8" fill={color} /> : null}
            {shape === "square" ? (
                <rect x="4.5" y="4.5" width="15" height="15" rx="3" fill={color} />
            ) : null}
            {shape === "triangle" ? (
                <path d="M12 4 21 19H3Z" fill={color} strokeLinejoin="round" />
            ) : null}
            {shape === "diamond" ? <path d="M12 3 21 12 12 21 3 12Z" fill={color} /> : null}
            {shape === "ring" ? (
                <circle cx="12" cy="12" r="7" fill="none" stroke={color} strokeWidth="3.5" />
            ) : null}
            {shape === "plus" ? (
                <path d="M12 4v16M4 12h16" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
            ) : null}
        </svg>
    );
}

function deal(size: Size) {
    const faces = FACES.slice(0, PAIRS[size]);
    const cards = [...faces, ...faces].map((_, id) => ({ id, face: id % faces.length }));
    // Fisher-Yates
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const a = cards[i];
        const b = cards[j];
        if (a && b) {
            cards[i] = b;
            cards[j] = a;
        }
    }
    return cards;
}

export function Memory({ active, t }: GameProps) {
    const [size, setSize] = useState<Size>("small");
    const [cards, setCards] = useState(() => deal("small"));
    const [open, setOpen] = useState<number[]>([]);
    const [matched, setMatched] = useState<Set<number>>(new Set());
    const [moves, setMoves] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [started, setStarted] = useState(false);
    const lock = useRef(false);
    const timeout = useRef<number | undefined>(undefined);
    const [best, report] = useBest(`memory-best:${size}`, true);
    const ui = t.ui;
    const won = matched.size === cards.length && cards.length > 0;
    const cols = size === "small" ? 4 : 6;
    const cell = size === "small" ? 64 : 48;

    useEffect(() => () => window.clearTimeout(timeout.current), []);

    useEffect(() => {
        if (!started || won || !active) return;
        const tick = window.setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => window.clearInterval(tick);
    }, [started, won, active]);

    useEffect(() => {
        if (won) report(moves);
    }, [won, moves, report]);

    const reset = useCallback((next: Size) => {
        window.clearTimeout(timeout.current);
        lock.current = false;
        setCards(deal(next));
        setOpen([]);
        setMatched(new Set());
        setMoves(0);
        setSeconds(0);
        setStarted(false);
    }, []);

    function flip(index: number) {
        const card = cards[index];
        if (!card || lock.current || open.includes(index) || matched.has(card.id)) return;
        setStarted(true);
        const next = [...open, index];
        setOpen(next);
        if (next.length < 2) return;
        setMoves((m) => m + 1);
        const [a, b] = next.map((i) => cards[i]) as [
            (typeof cards)[number],
            (typeof cards)[number],
        ];
        lock.current = true;
        timeout.current = window.setTimeout(
            () => {
                if (a.face === b.face) setMatched((set) => new Set([...set, a.id, b.id]));
                setOpen([]);
                lock.current = false;
            },
            a.face === b.face ? 350 : 800,
        );
    }

    const width = cols * cell + (cols - 1) * 6;
    const board = useMemo(() => cards, [cards]);

    return (
        <GameShell>
            <Pills
                value={size}
                options={[
                    { id: "small", label: "4×4" },
                    { id: "large", label: "6×6" },
                ]}
                onChange={(next) => {
                    setSize(next);
                    reset(next);
                }}
            />
            <StatBar
                width={width}
                items={[
                    [ui.moves, moves],
                    [ui.time, seconds],
                    [ui.best, best ?? "–"],
                ]}
            />
            <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${cols}, ${cell}px)` }}
            >
                {board.map((card, index) => {
                    const face = FACES[card.face];
                    const shown = open.includes(index) || matched.has(card.id);
                    return (
                        <button
                            key={card.id}
                            type="button"
                            aria-label={shown && face ? `${face.shape}` : "?"}
                            onClick={() => flip(index)}
                            style={{ width: cell, height: cell, perspective: 400 }}
                            className="cursor-pointer"
                        >
                            <span
                                className="relative block size-full transition-transform duration-300 [transform-style:preserve-3d] motion-reduce:transition-none"
                                style={{ transform: shown ? "rotateY(180deg)" : "none" }}
                            >
                                <span className="absolute inset-0 flex items-center justify-center rounded-lg border border-line-strong bg-bg-3 font-mono text-ink-faint [backface-visibility:hidden]">
                                    ?
                                </span>
                                <span
                                    className={`absolute inset-0 flex items-center justify-center rounded-lg border bg-bg-0 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                                        matched.has(card.id)
                                            ? "border-[#28c840]/60"
                                            : "border-line-strong"
                                    }`}
                                >
                                    {face ? <Face {...face} /> : null}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
            <div className="flex h-8 items-center gap-3">
                <span aria-live="polite" className="font-mono text-xs text-[#28c840]">
                    {won ? ui.win : ""}
                </span>
                <PillButton onClick={() => reset(size)}>{ui.newGame}</PillButton>
            </div>
        </GameShell>
    );
}
