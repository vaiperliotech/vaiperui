"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { makeT } from "@/data/samples";

import { Confetti } from "../apps/Confetti";
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

const W = 480;
const H = 440;
const PADDLE_W = 84;
const PADDLE_H = 10;
const PADDLE_Y = H - 36;
const BALL = 9;
const BRICK = 12;
const BRICK_GAP = 2;
const BRICK_W = 34;
const BRICK_H = 16;
const BASE_SPEED = 5;
const MAX_SPEED = 9;
const DROP_CHANCE = 0.14;
const POWER_TIME = 600; // 10s in 1/60s frames
const WIDE_W = 132;
const SLOW_FACTOR = 0.6;
const MAX_LIVES = 5;
const CAPSULE_W = 22;
const CAPSULE_H = 14;
const TOP = 52;

// "vaiperui" in a 5-row pixel font: every lit pixel is a brick
const GLYPHS: Record<string, string[]> = {
    v: ["X..X", "X..X", "X..X", ".XX.", ".XX."],
    a: [".XX.", "...X", ".XXX", "X..X", ".XXX"],
    i: ["X", ".", "X", "X", "X"],
    p: ["XXX.", "X..X", "XXX.", "X...", "X..."],
    e: [".XX.", "X..X", "XXXX", "X...", ".XXX"],
    r: ["X.XX", "XX..", "X...", "X...", "X..."],
    u: ["X..X", "X..X", "X..X", "X..X", ".XXX"],
};

// levels 2+: 'X' is a brick, 'H' a hard brick (2 hits), '.' is empty; the patterns cycle
const PATTERNS: string[][] = [
    // pyramid
    [
        ".....XX.....",
        "....XXXX....",
        "...XXXXXX...",
        "..XXXXXXXX..",
        ".XXXXXXXXXX.",
        "XXXXXXXXXXXX",
    ],
    // checkerboard with hard bricks
    ["XHXHXHXHXHXH", "HXHXHXHXHXHX", "XHXHXHXHXHXH", "HXHXHXHXHXHX", "XHXHXHXHXHXH"],
    // full wall, hard bottom rows
    ["XXXXXXXXXXXX", "XXXXXXXXXXXX", "XXXXXXXXXXXX", "HHHHHHHHHHHH", "HHHHHHHHHHHH"],
    // hollow diamond made of hard bricks
    [
        ".....HH.....",
        "....HXXH....",
        "...HXXXXH...",
        "..HXXHHXXH..",
        "...HXXXXH...",
        "....HXXH....",
        ".....HH.....",
    ],
];
const ROW_COLORS = [PALETTE.red, PALETTE.yellow, PALETTE.green, PALETTE.blue, PALETTE.violet];

type Brick = {
    x: number;
    y: number;
    w: number;
    h: number;
    hp: number;
    hard: boolean;
    color: string;
    alive: boolean;
};
type Ball = { x: number; y: number; vx: number; vy: number };
type PowerKind = "W" | "M" | "S" | "+";
type Capsule = { x: number; y: number; kind: PowerKind };
type Status = "ready" | "running" | "paused" | "over" | "won";

const POWER_COLORS: Record<PowerKind, string> = {
    W: PALETTE.blue,
    M: PALETTE.violet,
    S: PALETTE.green,
    "+": PALETTE.red,
};
const POWER_KINDS: PowerKind[] = ["W", "M", "S", "W", "M", "S", "+"];

function buildWord(): Brick[] {
    const word = "vaiperui";
    const widths = [...word].map((letter) => GLYPHS[letter]?.[0]?.length ?? 0);
    const columns = widths.reduce((sum, w) => sum + w, 0) + (word.length - 1);
    const left = (W - columns * (BRICK + BRICK_GAP)) / 2;
    const bricks: Brick[] = [];
    let cursor = 0;
    [...word].forEach((letter, index) => {
        const glyph = GLYPHS[letter] ?? [];
        glyph.forEach((row, r) => {
            [...row].forEach((cell, c) => {
                if (cell !== "X") return;
                bricks.push({
                    x: left + (cursor + c) * (BRICK + BRICK_GAP),
                    y: TOP + r * (BRICK + BRICK_GAP) * 1.7,
                    w: BRICK,
                    h: BRICK * 1.7,
                    hp: 1,
                    hard: false,
                    // "ui" is the accent of the logo, the rest is white
                    color:
                        index >= word.length - 2 ? PALETTE.blue : r < 2 ? PALETTE.ink : PALETTE.dim,
                    alive: true,
                });
            });
        });
        cursor += (glyph[0]?.length ?? 0) + 1;
    });
    return bricks;
}

function buildPattern(pattern: string[]): Brick[] {
    const columns = pattern[0]?.length ?? 0;
    const left = (W - columns * (BRICK_W + BRICK_GAP) + BRICK_GAP) / 2;
    const bricks: Brick[] = [];
    pattern.forEach((row, r) => {
        [...row].forEach((cell, c) => {
            if (cell !== "X" && cell !== "H") return;
            bricks.push({
                x: left + c * (BRICK_W + BRICK_GAP),
                y: TOP + r * (BRICK_H + BRICK_GAP),
                w: BRICK_W,
                h: BRICK_H,
                hp: cell === "H" ? 2 : 1,
                hard: cell === "H",
                color: ROW_COLORS[r % ROW_COLORS.length] ?? PALETTE.blue,
                alive: true,
            });
        });
    });
    return bricks;
}

function buildBricks(level: number): Brick[] {
    if (level <= 1) return buildWord();
    return buildPattern(PATTERNS[(level - 2) % PATTERNS.length] ?? []);
}

const baseSpeed = (level: number) => Math.min(7, BASE_SPEED + (level - 1) * 0.4);

function freshGame(level: number, score = 0, lives = 3, paddle = W / 2) {
    return {
        paddle,
        balls: [{ x: paddle, y: PADDLE_Y - BALL, vx: 0, vy: 0 }] as Ball[],
        bricks: buildBricks(level),
        capsules: [] as Capsule[],
        wide: 0,
        slow: 0,
        level,
        score,
        lives,
        launched: false,
    };
}

export function Breakout({ active, t, locale }: GameProps) {
    const ui = t.ui;
    const tr = makeT(locale);
    const levelLabel = tr("Level", "Nível", "Nivel");
    const canvas = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<Status>("ready");
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [best, report] = useBest("breakout-best");
    const statusRef = useRef<Status>("ready");
    const keys = useRef(new Set<string>());
    const game = useRef(freshGame(1));

    const set = useCallback((next: Status) => {
        statusRef.current = next;
        setStatus(next);
    }, []);

    const draw = useCallback(() => {
        const ctx = prepareCanvas(canvas.current, W, H);
        if (!ctx) return;
        const g = game.current;
        const pw = g.wide > 0 ? WIDE_W : PADDLE_W;
        ctx.fillStyle = PALETTE.bg0;
        ctx.fillRect(0, 0, W, H);
        for (const brick of g.bricks) {
            if (!brick.alive) continue;
            ctx.beginPath();
            ctx.roundRect(brick.x, brick.y, brick.w, brick.h, 3);
            if (brick.hard) {
                // a hard brick is gold and framed; after the first hit it turns grey
                ctx.fillStyle = brick.hp > 1 ? PALETTE.yellow : PALETTE.faint;
                ctx.fill();
                if (brick.hp > 1) {
                    ctx.strokeStyle = PALETTE.ink;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            } else {
                ctx.fillStyle = brick.color;
                ctx.fill();
            }
        }
        ctx.fillStyle = g.wide > 0 ? PALETTE.blue : PALETTE.violet;
        ctx.beginPath();
        ctx.roundRect(g.paddle - pw / 2, PADDLE_Y, pw, PADDLE_H, 5);
        ctx.fill();
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const capsule of g.capsules) {
            ctx.fillStyle = POWER_COLORS[capsule.kind];
            ctx.beginPath();
            ctx.roundRect(
                capsule.x - CAPSULE_W / 2,
                capsule.y - CAPSULE_H / 2,
                CAPSULE_W,
                CAPSULE_H,
                7,
            );
            ctx.fill();
            ctx.fillStyle = PALETTE.bg0;
            ctx.fillText(capsule.kind, capsule.x, capsule.y + 1);
        }
        ctx.fillStyle = PALETTE.ink;
        for (const ball of g.balls) {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, BALL / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        // active timed powerups, top-right
        ctx.textAlign = "right";
        const badges: Array<[PowerKind, number]> = [];
        if (g.wide > 0) badges.push(["W", g.wide]);
        if (g.slow > 0) badges.push(["S", g.slow]);
        badges.forEach(([kind, left], i) => {
            ctx.fillStyle = POWER_COLORS[kind];
            ctx.fillText(`${kind} ${Math.ceil(left / 60)}s`, W - 8, 12 + i * 14);
        });
    }, []);

    const resetBall = useCallback(() => {
        const g = game.current;
        g.launched = false;
        g.balls = [{ x: g.paddle, y: PADDLE_Y - BALL, vx: 0, vy: 0 }];
    }, []);

    const reset = useCallback(() => {
        game.current = freshGame(1);
        setScore(0);
        setLives(3);
        setLevel(1);
        set("ready");
        draw();
    }, [draw, set]);

    // score and lives carry over; powerups, timers and capsules do not
    const nextLevel = useCallback(() => {
        const g = game.current;
        const next = g.level + 1;
        game.current = freshGame(next, g.score, g.lives, g.paddle);
        setLevel(next);
        set("ready");
        draw();
    }, [draw, set]);

    useEffect(() => reset(), [reset]);

    const launch = useCallback(() => {
        const g = game.current;
        const ball = g.balls[0];
        if (g.launched || !ball) return;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.7;
        const speed = baseSpeed(g.level);
        ball.vx = Math.cos(angle) * speed;
        ball.vy = Math.sin(angle) * speed;
        g.launched = true;
    }, []);

    useRaf(status === "running" && active, (dt) => {
        const g = game.current;
        const k = keys.current;
        const pw = g.wide > 0 ? WIDE_W : PADDLE_W;
        if (k.has("ArrowLeft") || k.has("a")) g.paddle -= 7 * dt;
        if (k.has("ArrowRight") || k.has("d")) g.paddle += 7 * dt;
        g.paddle = Math.max(pw / 2, Math.min(W - pw / 2, g.paddle));

        if (!g.launched) {
            const ball = g.balls[0];
            if (ball) ball.x = g.paddle;
            draw();
            return;
        }
        g.wide = Math.max(0, g.wide - dt);
        g.slow = Math.max(0, g.slow - dt);
        const bdt = g.slow > 0 ? dt * SLOW_FACTOR : dt;

        for (const ball of g.balls) {
            ball.x += ball.vx * bdt;
            ball.y += ball.vy * bdt;
            if (ball.x < BALL / 2 || ball.x > W - BALL / 2) {
                ball.vx *= -1;
                ball.x = Math.max(BALL / 2, Math.min(W - BALL / 2, ball.x));
            }
            if (ball.y < BALL / 2) {
                ball.vy = Math.abs(ball.vy);
                ball.y = BALL / 2;
            }

            // the angle off the paddle depends on where it lands
            if (
                ball.vy > 0 &&
                ball.y + BALL / 2 >= PADDLE_Y &&
                ball.y - BALL / 2 <= PADDLE_Y + PADDLE_H &&
                Math.abs(ball.x - g.paddle) <= pw / 2 + BALL / 2
            ) {
                const offset = (ball.x - g.paddle) / (pw / 2);
                const speed = Math.min(MAX_SPEED, Math.hypot(ball.vx, ball.vy) * 1.015);
                const angle = -Math.PI / 2 + offset * 1.0;
                ball.vx = Math.cos(angle) * speed;
                ball.vy = Math.sin(angle) * speed;
                ball.y = PADDLE_Y - BALL / 2;
            }

            for (const brick of g.bricks) {
                if (!brick.alive) continue;
                if (
                    ball.x + BALL / 2 > brick.x &&
                    ball.x - BALL / 2 < brick.x + brick.w &&
                    ball.y + BALL / 2 > brick.y &&
                    ball.y - BALL / 2 < brick.y + brick.h
                ) {
                    brick.hp -= 1;
                    // bounce off the side the ball came from
                    const fromSide = Math.min(
                        ball.x + BALL / 2 - brick.x,
                        brick.x + brick.w - (ball.x - BALL / 2),
                    );
                    const fromTop = Math.min(
                        ball.y + BALL / 2 - brick.y,
                        brick.y + brick.h - (ball.y - BALL / 2),
                    );
                    if (fromSide < fromTop) ball.vx *= -1;
                    else ball.vy *= -1;
                    if (brick.hp <= 0) {
                        brick.alive = false;
                        g.score += brick.hard ? 20 : 10;
                        if (Math.random() < DROP_CHANCE) {
                            const kind =
                                POWER_KINDS[Math.floor(Math.random() * POWER_KINDS.length)];
                            if (kind) {
                                g.capsules.push({
                                    x: brick.x + brick.w / 2,
                                    y: brick.y + brick.h / 2,
                                    kind,
                                });
                            }
                        }
                    } else g.score += 5;
                    setScore(g.score);
                    break;
                }
            }
        }

        // capsules fall; the paddle catches them
        g.capsules = g.capsules.filter((capsule) => {
            capsule.y += 2 * dt;
            const caught =
                capsule.y + CAPSULE_H / 2 >= PADDLE_Y &&
                capsule.y - CAPSULE_H / 2 <= PADDLE_Y + PADDLE_H &&
                Math.abs(capsule.x - g.paddle) <= pw / 2 + CAPSULE_W / 2;
            if (caught) {
                if (capsule.kind === "W") g.wide = POWER_TIME;
                else if (capsule.kind === "S") g.slow = POWER_TIME;
                else if (capsule.kind === "+") {
                    g.lives = Math.min(MAX_LIVES, g.lives + 1);
                    setLives(g.lives);
                } else {
                    // multi-ball: split the first ball in 3
                    const src = g.balls[0];
                    if (src) {
                        const speed = Math.hypot(src.vx, src.vy);
                        const base = Math.atan2(src.vy, src.vx);
                        g.balls = [-0.45, 0, 0.45].map((turn) => ({
                            x: src.x,
                            y: src.y,
                            vx: Math.cos(base + turn) * speed,
                            vy: Math.sin(base + turn) * speed,
                        }));
                    }
                }
            }
            return !caught && capsule.y - CAPSULE_H / 2 <= H;
        });

        g.balls = g.balls.filter((ball) => ball.y - BALL / 2 <= H);
        if (g.bricks.every((brick) => !brick.alive)) {
            report(g.score);
            set("won");
        } else if (g.balls.length === 0) {
            g.lives -= 1;
            setLives(g.lives);
            if (g.lives <= 0) {
                report(g.score);
                set("over");
            } else {
                g.capsules = [];
                g.wide = 0;
                g.slow = 0;
                resetBall();
            }
        }
        draw();
    });

    useEffect(() => {
        if (!active && statusRef.current === "running") set("paused");
    }, [active, set]);

    useGameKeys(active, (event) => {
        const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
        if (GAME_KEYS.has(event.key)) event.preventDefault();
        if (key === " ") {
            if (statusRef.current === "over") reset();
            else if (statusRef.current === "won") nextLevel();
            else if (statusRef.current === "ready") {
                set("running");
                launch();
            } else if (statusRef.current === "paused") set("running");
            else if (!game.current.launched) launch();
            else set("paused");
        } else if (key === "r") reset();
        else keys.current.add(key);
    });

    useEffect(() => {
        if (!active) return;
        const up = (event: KeyboardEvent) => {
            keys.current.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key);
        };
        document.addEventListener("keyup", up);
        return () => {
            document.removeEventListener("keyup", up);
            keys.current.clear();
        };
    }, [active]);

    function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const half = (game.current.wide > 0 ? WIDE_W : PADDLE_W) / 2;
        game.current.paddle = Math.max(half, Math.min(W - half, event.clientX - rect.left));
        if (statusRef.current !== "running") draw();
    }

    const message =
        status === "ready"
            ? ui.start
            : status === "paused"
              ? ui.paused
              : status === "over"
                ? `${ui.over} · ${ui.restart}`
                : status === "won"
                  ? ui.win
                  : "";

    return (
        <GameShell>
            <StatBar
                width={W}
                items={[
                    [levelLabel, level],
                    [ui.score, score],
                    [ui.lives, "♥".repeat(Math.max(0, lives)) || "–"],
                    [ui.best, Math.max(best ?? 0, score)],
                ]}
            />
            {/* the mouse moves the paddle and a click serves; the keyboard has the arrows and Space */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: pointer shortcut, keys handled on the document */}
            <div
                onPointerMove={onPointerMove}
                onClick={() => {
                    if (statusRef.current === "ready") {
                        set("running");
                        launch();
                    } else if (statusRef.current === "running") launch();
                    else if (statusRef.current === "over") reset();
                    else if (statusRef.current === "won") nextLevel();
                }}
                className="relative cursor-none overflow-hidden rounded-lg border border-line-strong"
            >
                <canvas
                    ref={canvas}
                    role="img"
                    aria-label="Breakout"
                    style={{ width: W, height: H }}
                    className="block"
                />
                {message ? (
                    <Overlay>
                        <div className="flex flex-col gap-1">
                            {status === "ready" || status === "won" ? (
                                <b className="text-accent-blue">
                                    {levelLabel} {status === "won" ? level + 1 : level}
                                </b>
                            ) : null}
                            <span>{message}</span>
                        </div>
                    </Overlay>
                ) : null}
                <Confetti run={status === "won"} />
            </div>
        </GameShell>
    );
}
