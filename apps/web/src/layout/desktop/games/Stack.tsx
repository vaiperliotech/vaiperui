"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
    GAME_KEYS,
    type GameProps,
    GameShell,
    Overlay,
    PALETTE,
    prepareCanvas,
    StatBar,
    useBest,
    useGameKeys,
    useRaf,
} from "./shared";

const COLS = 10;
const ROWS = 20;
const CELL = 24;
const PANEL = 120;
const W = COLS * CELL + PANEL;
const H = ROWS * CELL;

type Kind = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
type Matrix = number[][];
type Status = "ready" | "running" | "paused" | "over";

const SHAPES: Record<Kind, Matrix> = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    O: [
        [1, 1],
        [1, 1],
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
};
const COLORS: Record<Kind, string> = {
    I: PALETTE.blue,
    O: PALETTE.yellow,
    T: PALETTE.violet,
    S: PALETTE.green,
    Z: PALETTE.red,
    J: "#6b7df5",
    L: "#4de0d0",
};
const KINDS = Object.keys(SHAPES) as Kind[];
const POINTS = [0, 100, 300, 500, 800];

type Piece = { kind: Kind; shape: Matrix; x: number; y: number };
type Board = Array<Kind | null>;
type Ripple = { x: number; y: number; age: number };

// calls `fn` for every filled square of a piece
function eachCell(shape: Matrix, fn: (r: number, c: number) => void) {
    shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell) fn(r, c);
        });
    });
}

const rotate = (shape: Matrix): Matrix =>
    shape[0]?.map((_, c) => shape.map((row) => row[c] ?? 0).reverse()) ?? shape;

function bag(): Kind[] {
    const kinds = [...KINDS];
    for (let i = kinds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const a = kinds[i];
        const b = kinds[j];
        if (a && b) {
            kinds[i] = b;
            kinds[j] = a;
        }
    }
    return kinds;
}

const spawn = (kind: Kind): Piece => {
    const shape = SHAPES[kind];
    return { kind, shape, x: Math.floor((COLS - shape.length) / 2), y: kind === "I" ? -1 : 0 };
};

function collides(board: Board, piece: Piece, dx = 0, dy = 0, shape = piece.shape): boolean {
    return shape.some((row, r) =>
        row.some((cell, c) => {
            if (!cell) return false;
            const x = piece.x + c + dx;
            const y = piece.y + r + dy;
            return x < 0 || x >= COLS || y >= ROWS || (y >= 0 && board[y * COLS + x] !== null);
        }),
    );
}

// each locked block is a little button: a rounded tile with a lit top edge
function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x + 1.5, y + 1.5, CELL - 3, CELL - 3, 6);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.beginPath();
    ctx.roundRect(x + 3.5, y + 3, CELL - 7, 4, 2);
    ctx.fill();
    ctx.globalAlpha = 1;
}

export function Stack({ active, t }: GameProps) {
    const ui = t.ui;
    const canvas = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<Status>("ready");
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [best, report] = useBest("stack-best");
    const statusRef = useRef<Status>("ready");
    const game = useRef({
        board: Array(COLS * ROWS).fill(null) as Board,
        piece: spawn("T"),
        queue: [] as Kind[],
        timer: 0,
        score: 0,
        lines: 0,
        clearing: null as { rows: number[]; age: number } | null,
        ripples: [] as Ripple[],
    });

    const set = useCallback((next: Status) => {
        statusRef.current = next;
        setStatus(next);
    }, []);

    const nextKind = useCallback((): Kind => {
        const g = game.current;
        if (g.queue.length < 3) g.queue.push(...bag());
        return g.queue.shift() ?? "T";
    }, []);

    const draw = useCallback(() => {
        const ctx = prepareCanvas(canvas.current, W, H);
        if (!ctx) return;
        const g = game.current;
        ctx.fillStyle = PALETTE.bg0;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        for (let c = 1; c < COLS; c++) ctx.fillRect(c * CELL, 0, 1, H);
        for (let r = 1; r < ROWS; r++) ctx.fillRect(0, r * CELL, COLS * CELL, 1);

        g.board.forEach((kind, index) => {
            if (kind)
                drawBlock(
                    ctx,
                    (index % COLS) * CELL,
                    Math.floor(index / COLS) * CELL,
                    COLORS[kind],
                );
        });

        if (g.clearing) {
            const flash = Math.abs(Math.sin(g.clearing.age * 0.5));
            for (const row of g.clearing.rows) {
                ctx.fillStyle = `rgba(255,255,255,${0.25 + flash * 0.55})`;
                ctx.fillRect(0, row * CELL, COLS * CELL, CELL);
            }
        } else {
            // ghost: where the piece would land
            let drop = 0;
            while (!collides(g.board, g.piece, 0, drop + 1)) drop += 1;
            eachCell(g.piece.shape, (r, c) => {
                const y = (g.piece.y + r + drop) * CELL;
                if (y < 0) return;
                ctx.strokeStyle = COLORS[g.piece.kind];
                ctx.globalAlpha = 0.35;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.roundRect((g.piece.x + c) * CELL + 2.5, y + 2.5, CELL - 5, CELL - 5, 5);
                ctx.stroke();
                ctx.globalAlpha = 1;
            });
            eachCell(g.piece.shape, (r, c) => {
                const y = (g.piece.y + r) * CELL;
                if (y >= 0) drawBlock(ctx, (g.piece.x + c) * CELL, y, COLORS[g.piece.kind]);
            });
        }

        // a ripple spreads from every piece that locks in (the Button's `ripple` prop)
        for (const ripple of g.ripples) {
            ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - ripple.age / 22)})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, 6 + ripple.age * 3.2, 0, Math.PI * 2);
            ctx.stroke();
        }

        // side panel
        const px = COLS * CELL;
        ctx.fillStyle = PALETTE.bg2;
        ctx.fillRect(px, 0, PANEL, H);
        ctx.fillStyle = PALETTE.line;
        ctx.fillRect(px, 0, 1.5, H);
        ctx.fillStyle = PALETTE.faint;
        ctx.font = "500 11px ui-monospace, monospace";
        ctx.textAlign = "left";
        ctx.fillText(ui.next.toUpperCase(), px + 16, 28);
        const preview = SHAPES[g.queue[0] ?? "T"];
        const cellSize = 18;
        const offsetX = px + (PANEL - (preview[0]?.length ?? 0) * cellSize) / 2;
        eachCell(preview, (r, c) => {
            ctx.fillStyle = COLORS[g.queue[0] ?? "T"];
            ctx.beginPath();
            ctx.roundRect(
                offsetX + c * cellSize + 1,
                44 + r * cellSize + 1,
                cellSize - 2,
                cellSize - 2,
                4,
            );
            ctx.fill();
        });
        const level = Math.floor(g.lines / 10) + 1;
        ctx.fillStyle = PALETTE.faint;
        [
            [ui.level, level],
            [ui.lines, g.lines],
            [ui.score, g.score],
        ].forEach(([label, value], i) => {
            ctx.fillStyle = PALETTE.faint;
            ctx.fillText(String(label).toUpperCase(), px + 16, 158 + i * 56);
            ctx.fillStyle = PALETTE.ink;
            ctx.font = "700 20px ui-monospace, monospace";
            ctx.fillText(String(value), px + 16, 182 + i * 56);
            ctx.font = "500 11px ui-monospace, monospace";
        });
    }, [ui]);

    const reset = useCallback(() => {
        const g = game.current;
        g.board = Array(COLS * ROWS).fill(null);
        g.queue = [];
        g.piece = spawn(nextKind());
        g.timer = 0;
        g.score = 0;
        g.lines = 0;
        g.clearing = null;
        g.ripples = [];
        setScore(0);
        setLines(0);
        set("ready");
        draw();
    }, [draw, nextKind, set]);

    useEffect(() => reset(), [reset]);

    const lock = useCallback(() => {
        const g = game.current;
        const { piece } = g;
        let cx = 0;
        let cy = 0;
        let n = 0;
        eachCell(piece.shape, (r, c) => {
            const y = piece.y + r;
            if (y >= 0) g.board[y * COLS + piece.x + c] = piece.kind;
            cx += (piece.x + c + 0.5) * CELL;
            cy += (y + 0.5) * CELL;
            n += 1;
        });
        if (n > 0) g.ripples.push({ x: cx / n, y: cy / n, age: 0 });
        const full: number[] = [];
        for (let r = 0; r < ROWS; r++) {
            if (g.board.slice(r * COLS, (r + 1) * COLS).every(Boolean)) full.push(r);
        }
        if (full.length > 0) {
            g.clearing = { rows: full, age: 0 };
            return;
        }
        g.piece = spawn(nextKind());
        if (collides(g.board, g.piece)) {
            report(g.score);
            set("over");
        }
    }, [nextKind, report, set]);

    const moveDown = useCallback(
        (soft: boolean) => {
            const g = game.current;
            if (g.clearing) return;
            if (!collides(g.board, g.piece, 0, 1)) {
                g.piece.y += 1;
                if (soft) g.score += 1;
            } else lock();
        },
        [lock],
    );

    useRaf(status === "running" && active, (dt) => {
        const g = game.current;
        for (const ripple of g.ripples) ripple.age += dt;
        g.ripples = g.ripples.filter((ripple) => ripple.age < 22);

        if (g.clearing) {
            g.clearing.age += dt;
            if (g.clearing.age > 12) {
                const rows = new Set(g.clearing.rows);
                const kept: Board = [];
                for (let r = 0; r < ROWS; r++) {
                    if (!rows.has(r)) kept.push(...g.board.slice(r * COLS, (r + 1) * COLS));
                }
                g.board = [...Array(rows.size * COLS).fill(null), ...kept];
                const level = Math.floor(g.lines / 10) + 1;
                g.score += (POINTS[rows.size] ?? 800) * level;
                g.lines += rows.size;
                g.clearing = null;
                setScore(g.score);
                setLines(g.lines);
                g.piece = spawn(nextKind());
                if (collides(g.board, g.piece)) {
                    report(g.score);
                    set("over");
                }
            }
            draw();
            return;
        }

        const level = Math.floor(g.lines / 10) + 1;
        g.timer += dt;
        if (g.timer >= Math.max(5, 46 - level * 4)) {
            g.timer = 0;
            moveDown(false);
        }
        setScore(g.score);
        draw();
    });

    useEffect(() => {
        if (!active && statusRef.current === "running") set("paused");
    }, [active, set]);

    useGameKeys(active, (event) => {
        const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
        if (GAME_KEYS.has(event.key)) event.preventDefault();
        const g = game.current;
        if (key === "r") return reset();
        if (key === "p" || (key === " " && statusRef.current !== "running")) {
            if (statusRef.current === "over") reset();
            else if (statusRef.current === "running") set("paused");
            else set("running");
            return;
        }
        if (statusRef.current !== "running" || g.clearing) return;
        if (key === "ArrowLeft" || key === "a") {
            if (!collides(g.board, g.piece, -1, 0)) g.piece.x -= 1;
        } else if (key === "ArrowRight" || key === "d") {
            if (!collides(g.board, g.piece, 1, 0)) g.piece.x += 1;
        } else if (key === "ArrowDown" || key === "s") {
            moveDown(true);
        } else if (key === "ArrowUp" || key === "w" || key === "x" || key === "z") {
            let shape = g.piece.shape;
            const turns = key === "z" ? 3 : 1;
            for (let i = 0; i < turns; i++) shape = rotate(shape);
            // a few wall kicks, so a rotation next to a wall still works
            for (const kick of [0, -1, 1, -2, 2]) {
                if (!collides(g.board, g.piece, kick, 0, shape)) {
                    g.piece.shape = shape;
                    g.piece.x += kick;
                    break;
                }
            }
        } else if (key === " ") {
            let drop = 0;
            while (!collides(g.board, g.piece, 0, drop + 1)) drop += 1;
            g.piece.y += drop;
            g.score += drop * 2;
            lock();
        }
        draw();
    });

    const message =
        status === "ready"
            ? ui.start
            : status === "paused"
              ? ui.paused
              : status === "over"
                ? `${ui.over} · ${ui.restart}`
                : "";

    return (
        <GameShell>
            <StatBar
                width={W}
                items={[
                    [ui.score, score],
                    [ui.lines, lines],
                    [ui.best, Math.max(best ?? 0, score)],
                ]}
            />
            <div className="relative overflow-hidden rounded-lg border border-line-strong">
                <canvas
                    ref={canvas}
                    role="img"
                    aria-label="Stack the Buttons"
                    style={{ width: W, height: H }}
                    className="block"
                />
                {message ? <Overlay>{message}</Overlay> : null}
            </div>
            <p className="font-mono text-[11px] text-ink-faint">← → ↓ · ↑ · space · P</p>
        </GameShell>
    );
}
