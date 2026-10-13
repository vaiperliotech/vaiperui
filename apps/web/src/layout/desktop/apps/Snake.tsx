"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SnakeLabels = {
    score: string;
    best: string;
    start: string;
    paused: string;
    over: string;
    maps: { small: string; large: string };
};

type MapSize = "small" | "large";
type Point = { x: number; y: number };
type Status = "ready" | "running" | "paused" | "over";

// The board is always 360px: a small map has big cells, a large one has many small ones.
const BOARD = 360;
const MAPS: Record<MapSize, { grid: number; baseDelay: number }> = {
    small: { grid: 12, baseDelay: 135 },
    large: { grid: 24, baseDelay: 95 },
};
const MAP_KEY = "vaiperui:snake-map";
const bestKey = (map: MapSize) => `vaiperui:snake-best:${map}`;

const DIRECTIONS: Record<string, Point> = {
    ArrowUp: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    d: { x: 1, y: 0 },
};

function read(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function write(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // private mode: it just won't persist
    }
}

function randomFood(snake: Point[], grid: number): Point {
    for (;;) {
        const food = { x: Math.floor(Math.random() * grid), y: Math.floor(Math.random() * grid) };
        if (!snake.some((part) => part.x === food.x && part.y === food.y)) return food;
    }
}

function freshGame(grid: number) {
    const row = Math.floor(grid / 2);
    const snake = [
        { x: 4, y: row },
        { x: 3, y: row },
        { x: 2, y: row },
    ];
    return { snake, dir: { x: 1, y: 0 }, queued: [] as Point[], food: randomFood(snake, grid) };
}

export function Snake({ labels, active }: { labels: SnakeLabels; active: boolean }) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [map, setMap] = useState<MapSize>("small");
    const grid = MAPS[map].grid;
    const game = useRef(freshGame(grid));
    const [status, setStatus] = useState<Status>("ready");
    const [score, setScore] = useState(0);
    const [best, setBest] = useState(0);
    const statusRef = useRef<Status>("ready");
    const scoreRef = useRef(0);

    const changeStatus = useCallback((next: Status) => {
        statusRef.current = next;
        setStatus(next);
    }, []);

    useEffect(() => {
        const saved = read(MAP_KEY);
        if (saved === "small" || saved === "large") setMap(saved);
    }, []);

    useEffect(() => setBest(Number(read(bestKey(map))) || 0), [map]);

    const draw = useCallback(() => {
        const element = canvas.current;
        const ctx = element?.getContext("2d");
        if (!element || !ctx) return;
        const cell = BOARD / grid;
        const ratio = window.devicePixelRatio || 1;
        if (element.width !== BOARD * ratio) {
            element.width = BOARD * ratio;
            element.height = BOARD * ratio;
        }
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.fillStyle = "#0a0e18";
        ctx.fillRect(0, 0, BOARD, BOARD);
        ctx.fillStyle = "rgba(255,255,255,0.045)";
        for (let i = 1; i < grid; i++) {
            ctx.fillRect(i * cell, 0, 1, BOARD);
            ctx.fillRect(0, i * cell, BOARD, 1);
        }
        const { snake, food } = game.current;
        const pad = Math.max(1.5, cell * 0.1);
        // the food is a tiny component: a violet rounded square with a "ring" around it
        ctx.strokeStyle = "rgba(167,139,250,0.35)";
        ctx.lineWidth = Math.max(1.2, cell * 0.08);
        ctx.beginPath();
        ctx.roundRect(food.x * cell + 1, food.y * cell + 1, cell - 2, cell - 2, cell * 0.3);
        ctx.stroke();
        ctx.fillStyle = "#a78bfa";
        ctx.beginPath();
        ctx.roundRect(
            food.x * cell + cell * 0.27,
            food.y * cell + cell * 0.27,
            cell * 0.46,
            cell * 0.46,
            cell * 0.15,
        );
        ctx.fill();
        snake.forEach((part, index) => {
            const fade = Math.max(0.35, 1 - index / (snake.length + 6));
            ctx.fillStyle = index === 0 ? "#7cc0ff" : `rgba(77,163,255,${fade})`;
            ctx.beginPath();
            ctx.roundRect(
                part.x * cell + pad,
                part.y * cell + pad,
                cell - pad * 2,
                cell - pad * 2,
                cell * (index === 0 ? 0.36 : 0.26),
            );
            ctx.fill();
        });
    }, [grid]);

    const restart = useCallback(() => {
        game.current = freshGame(grid);
        scoreRef.current = 0;
        setScore(0);
        changeStatus("ready");
        draw();
    }, [changeStatus, draw, grid]);

    // changing the map starts over on the new grid
    // biome-ignore lint/correctness/useExhaustiveDependencies: map is the trigger, restart already follows grid
    useEffect(() => {
        restart();
    }, [map]);

    const step = useCallback(() => {
        const state = game.current;
        const next = state.queued.shift();
        if (next && !(next.x === -state.dir.x && next.y === -state.dir.y)) state.dir = next;
        const front = state.snake[0];
        if (!front) return;
        // no walls: leaving one side brings the snake back on the opposite one
        const head = {
            x: (front.x + state.dir.x + grid) % grid,
            y: (front.y + state.dir.y + grid) % grid,
        };
        const grows = head.x === state.food.x && head.y === state.food.y;
        // the tail moves away on the same tick, so it is only an obstacle while eating
        const body = grows ? state.snake : state.snake.slice(0, -1);
        if (body.some((part) => part.x === head.x && part.y === head.y)) {
            changeStatus("over");
            if (scoreRef.current > (Number(read(bestKey(map))) || 0)) {
                write(bestKey(map), String(scoreRef.current));
                setBest(scoreRef.current);
            }
            return;
        }
        state.snake.unshift(head);
        if (grows) {
            scoreRef.current += 1;
            setScore(scoreRef.current);
            state.food = randomFood(state.snake, grid);
        } else {
            state.snake.pop();
        }
    }, [changeStatus, grid, map]);

    // fixed-step loop: faster as the snake grows
    useEffect(() => {
        if (status !== "running" || !active) return;
        let raf = 0;
        let last = performance.now();
        const loop = (now: number) => {
            const delay = Math.max(55, MAPS[map].baseDelay - scoreRef.current * 2.5);
            if (now - last >= delay) {
                last = now;
                step();
                draw();
            }
            if (statusRef.current === "running") raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [status, active, step, draw, map]);

    useEffect(() => {
        if (!active && statusRef.current === "running") changeStatus("paused");
    }, [active, changeStatus]);

    useEffect(() => {
        if (!active) return;
        function onKeyDown(event: KeyboardEvent) {
            const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
            const direction = DIRECTIONS[key];
            if (direction) {
                event.preventDefault();
                const state = game.current;
                const last = state.queued[state.queued.length - 1] ?? state.dir;
                if (
                    !(direction.x === -last.x && direction.y === -last.y) &&
                    state.queued.length < 2
                ) {
                    state.queued.push(direction);
                }
                if (statusRef.current === "ready" || statusRef.current === "paused") {
                    changeStatus("running");
                }
            } else if (key === " ") {
                event.preventDefault();
                if (statusRef.current === "running") changeStatus("paused");
                else if (statusRef.current === "paused") changeStatus("running");
            } else if (key === "r" || (key === "Enter" && statusRef.current === "over")) {
                restart();
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [active, changeStatus, restart]);

    function chooseMap(next: MapSize) {
        if (next === map) return;
        write(MAP_KEY, next);
        setMap(next);
    }

    const message =
        status === "ready"
            ? labels.start
            : status === "paused"
              ? labels.paused
              : status === "over"
                ? labels.over
                : "";

    return (
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-bg-1 p-4">
            <div className="flex w-full max-w-[360px] items-center justify-between font-mono text-xs text-ink-dim">
                <span>
                    {labels.score} <b className="text-ink tabular-nums">{score}</b>
                </span>
                <fieldset className="m-0 flex gap-1 border-0 p-0">
                    {(["small", "large"] as const).map((size) => (
                        <button
                            key={size}
                            type="button"
                            aria-pressed={map === size}
                            onClick={() => chooseMap(size)}
                            className={`cursor-pointer rounded-full border px-2.5 py-0.5 transition-colors ${
                                map === size
                                    ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                                    : "border-line-strong text-ink-faint hover:text-ink"
                            }`}
                        >
                            {labels.maps[size]}
                        </button>
                    ))}
                </fieldset>
                <span>
                    {labels.best} <b className="text-ink tabular-nums">{Math.max(best, score)}</b>
                </span>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-line-strong">
                <canvas
                    ref={canvas}
                    role="img"
                    aria-label="Snake"
                    style={{ width: BOARD, height: BOARD }}
                    className="block"
                />
                {message ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-bg-0/70 px-6 text-center font-mono text-xs text-ink backdrop-blur-[2px]">
                        {message}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
