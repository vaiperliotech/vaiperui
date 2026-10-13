"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
    GAME_KEYS,
    type GameProps,
    GameShell,
    Overlay,
    PillButton,
    StatBar,
    useBest,
    useGameKeys,
} from "./shared";

const N = 4;
const CELL = 76;
const GAP = 8;
const STEP = CELL + GAP;

type Tile = {
    id: number;
    value: number;
    r: number;
    c: number;
    fresh?: boolean;
    merged?: boolean;
    gone?: boolean;
};
type Dir = "left" | "right" | "up" | "down";

const TILE_STYLE: Record<number, string> = {
    2: "bg-[#1f2a44] text-ink",
    4: "bg-[#27365a] text-ink",
    8: "bg-[#2f6fd1] text-white",
    16: "bg-[#3a86f0] text-white",
    32: "bg-[#6b7df5] text-white",
    64: "bg-[#8b6cf0] text-white",
    128: "bg-[#a78bfa] text-[#0a0e18]",
    256: "bg-[#28c840] text-[#0a0e18]",
    512: "bg-[#7fd957] text-[#0a0e18]",
    1024: "bg-[#febc2e] text-[#0a0e18]",
    2048: "bg-[#ff5f57] text-white",
};

function addTile(tiles: Tile[], nextId: () => number): Tile[] {
    const live = tiles.filter((tile) => !tile.gone);
    const free: Array<[number, number]> = [];
    for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
            if (!live.some((tile) => tile.r === r && tile.c === c)) free.push([r, c]);
        }
    }
    const spot = free[Math.floor(Math.random() * free.length)];
    if (!spot) return tiles;
    return [
        ...tiles,
        { id: nextId(), value: Math.random() < 0.9 ? 2 : 4, r: spot[0], c: spot[1], fresh: true },
    ];
}

// slides every line toward `dir`, merging equal neighbours once; the merged-away tiles slide into
// place too (marked `gone`) so the motion reads, and are dropped right after
function slide(tiles: Tile[], dir: Dir, nextId: () => number) {
    const live = tiles
        .filter((tile) => !tile.gone)
        .map((tile) => ({ ...tile, fresh: false, merged: false }));
    const out: Tile[] = [];
    let gained = 0;
    let moved = false;
    const horizontal = dir === "left" || dir === "right";
    const forward = dir === "left" || dir === "up";

    for (let line = 0; line < N; line++) {
        const inLine = live
            .filter((tile) => (horizontal ? tile.r : tile.c) === line)
            .sort((a, b) => {
                const pa = horizontal ? a.c : a.r;
                const pb = horizontal ? b.c : b.r;
                return forward ? pa - pb : pb - pa;
            });
        let slot = 0;
        let previous: Tile | null = null;
        for (const tile of inLine) {
            const pos = forward ? slot : N - 1 - slot;
            if (previous && previous.value === tile.value && !previous.merged) {
                const at = forward ? slot - 1 : N - 1 - (slot - 1);
                const mergedTile: Tile = {
                    id: nextId(),
                    value: tile.value * 2,
                    r: horizontal ? line : at,
                    c: horizontal ? at : line,
                    merged: true,
                };
                gained += mergedTile.value;
                // both parents slide onto the merge spot and vanish
                out.push({ ...tile, r: mergedTile.r, c: mergedTile.c, gone: true });
                const parentIndex = out.findIndex((o) => o.id === previous?.id);
                const parent = out[parentIndex];
                if (parent)
                    out[parentIndex] = { ...parent, r: mergedTile.r, c: mergedTile.c, gone: true };
                out.push(mergedTile);
                previous = mergedTile;
                moved = true;
                continue;
            }
            const r = horizontal ? line : pos;
            const c = horizontal ? pos : line;
            if (r !== tile.r || c !== tile.c) moved = true;
            const placed = { ...tile, r, c };
            out.push(placed);
            previous = placed;
            slot += 1;
        }
    }
    return { tiles: out, gained, moved };
}

function canMove(tiles: Tile[]): boolean {
    const live = tiles.filter((tile) => !tile.gone);
    if (live.length < N * N) return true;
    return live.some((tile) =>
        live.some(
            (other) =>
                other.value === tile.value &&
                Math.abs(other.r - tile.r) + Math.abs(other.c - tile.c) === 1,
        ),
    );
}

export function Game2048({ active, t }: GameProps) {
    const ui = t.ui;
    const ids = useRef(0);
    const nextId = useCallback(() => ++ids.current, []);
    const [tiles, setTiles] = useState<Tile[]>([]);
    const [score, setScore] = useState(0);
    const [over, setOver] = useState(false);
    const [reached, setReached] = useState(false);
    const [best, report] = useBest("2048-best");
    const swipe = useRef<{ x: number; y: number } | null>(null);
    const cleanup = useRef<number | undefined>(undefined);

    const start = useCallback(() => {
        window.clearTimeout(cleanup.current);
        setTiles(addTile(addTile([], nextId), nextId));
        setScore(0);
        setOver(false);
        setReached(false);
    }, [nextId]);

    useEffect(() => start(), [start]);
    useEffect(() => () => window.clearTimeout(cleanup.current), []);

    const move = useCallback(
        (dir: Dir) => {
            if (over) return;
            const result = slide(tiles, dir, nextId);
            if (!result.moved) return;
            const withNew = addTile(result.tiles, nextId);
            setTiles(withNew);
            setScore((value) => value + result.gained);
            if (result.tiles.some((tile) => tile.value >= 2048 && !tile.gone)) setReached(true);
            window.clearTimeout(cleanup.current);
            cleanup.current = window.setTimeout(() => {
                setTiles((current) => current.filter((tile) => !tile.gone));
            }, 140);
            if (!canMove(withNew)) {
                setOver(true);
                report(score + result.gained);
            }
        },
        [over, tiles, nextId, report, score],
    );

    const onKey = useCallback(
        (event: KeyboardEvent) => {
            const dirs: Record<string, Dir> = {
                ArrowLeft: "left",
                a: "left",
                ArrowRight: "right",
                d: "right",
                ArrowUp: "up",
                w: "up",
                ArrowDown: "down",
                s: "down",
            };
            const dir = dirs[event.key.length === 1 ? event.key.toLowerCase() : event.key];
            if (GAME_KEYS.has(event.key)) event.preventDefault();
            if (dir) move(dir);
            else if (event.key === "r") start();
        },
        [move, start],
    );
    useGameKeys(active, onKey);

    function onPointerUp(event: React.PointerEvent) {
        const from = swipe.current;
        swipe.current = null;
        if (!from) return;
        const dx = event.clientX - from.x;
        const dy = event.clientY - from.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
    }

    const size = N * CELL + (N - 1) * GAP;

    return (
        <GameShell>
            <StatBar
                width={size}
                items={[
                    [ui.score, score],
                    [ui.best, Math.max(best ?? 0, score)],
                ]}
            />
            <div
                onPointerDown={(event) => {
                    swipe.current = { x: event.clientX, y: event.clientY };
                }}
                onPointerUp={onPointerUp}
                style={{ width: size + 16, height: size + 16 }}
                className="relative touch-none rounded-xl border border-line-strong bg-bg-0 p-2"
            >
                <div className="relative size-full">
                    {Array.from({ length: N * N }, (_, i) => (
                        <span
                            // biome-ignore lint/suspicious/noArrayIndexKey: static background cells
                            key={i}
                            style={{
                                width: CELL,
                                height: CELL,
                                transform: `translate(${(i % N) * STEP}px, ${Math.floor(i / N) * STEP}px)`,
                            }}
                            className="absolute left-0 top-0 rounded-lg bg-bg-2"
                        />
                    ))}
                    {tiles.map((tile) => (
                        <span
                            key={tile.id}
                            style={{
                                width: CELL,
                                height: CELL,
                                transform: `translate(${tile.c * STEP}px, ${tile.r * STEP}px)`,
                                zIndex: tile.gone ? 1 : 2,
                            }}
                            className="absolute top-0 left-0 transition-transform duration-[120ms] ease-out motion-reduce:transition-none"
                        >
                            <span
                                className={`flex size-full items-center justify-center rounded-lg font-bold font-mono ${
                                    tile.value >= 1024
                                        ? "text-xl"
                                        : tile.value >= 128
                                          ? "text-2xl"
                                          : "text-3xl"
                                } ${TILE_STYLE[tile.value] ?? "bg-[#ff5f57] text-white"} ${
                                    tile.fresh ? "tile-pop" : tile.merged ? "tile-merge" : ""
                                }`}
                            >
                                {tile.value}
                            </span>
                        </span>
                    ))}
                </div>
                {over ? <Overlay>{ui.over}</Overlay> : null}
            </div>
            <div className="flex h-8 items-center gap-3">
                <span aria-live="polite" className="font-mono text-xs text-[#28c840]">
                    {reached && !over ? ui.win : ""}
                </span>
                <PillButton onClick={start}>{ui.newGame}</PillButton>
            </div>
        </GameShell>
    );
}
