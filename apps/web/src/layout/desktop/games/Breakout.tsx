"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

type Brick = { x: number; y: number; color: string; alive: boolean };
type Status = "ready" | "running" | "paused" | "over" | "won";

function buildBricks(): Brick[] {
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

export function Breakout({ active, t }: GameProps) {
    const ui = t.ui;
    const canvas = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<Status>("ready");
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [best, report] = useBest("breakout-best");
    const statusRef = useRef<Status>("ready");
    const keys = useRef(new Set<string>());
    const game = useRef({
        paddle: W / 2,
        ball: { x: W / 2, y: PADDLE_Y - BALL, vx: 0, vy: 0 },
        bricks: buildBricks(),
        score: 0,
        lives: 3,
        launched: false,
    });

    const set = useCallback((next: Status) => {
        statusRef.current = next;
        setStatus(next);
    }, []);

    const draw = useCallback(() => {
        const ctx = prepareCanvas(canvas.current, W, H);
        if (!ctx) return;
        const g = game.current;
        ctx.fillStyle = PALETTE.bg0;
        ctx.fillRect(0, 0, W, H);
        for (const brick of g.bricks) {
            if (!brick.alive) continue;
            ctx.fillStyle = brick.color;
            ctx.beginPath();
            ctx.roundRect(brick.x, brick.y, BRICK, BRICK * 1.7, 3);
            ctx.fill();
        }
        ctx.fillStyle = PALETTE.violet;
        ctx.beginPath();
        ctx.roundRect(g.paddle - PADDLE_W / 2, PADDLE_Y, PADDLE_W, PADDLE_H, 5);
        ctx.fill();
        ctx.fillStyle = PALETTE.ink;
        ctx.beginPath();
        ctx.arc(g.ball.x, g.ball.y, BALL / 2, 0, Math.PI * 2);
        ctx.fill();
    }, []);

    const resetBall = useCallback(() => {
        const g = game.current;
        g.launched = false;
        g.ball = { x: g.paddle, y: PADDLE_Y - BALL, vx: 0, vy: 0 };
    }, []);

    const reset = useCallback(() => {
        game.current = {
            paddle: W / 2,
            ball: { x: W / 2, y: PADDLE_Y - BALL, vx: 0, vy: 0 },
            bricks: buildBricks(),
            score: 0,
            lives: 3,
            launched: false,
        };
        setScore(0);
        setLives(3);
        set("ready");
        draw();
    }, [draw, set]);

    useEffect(() => reset(), [reset]);

    const launch = useCallback(() => {
        const g = game.current;
        if (g.launched) return;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.7;
        g.ball.vx = Math.cos(angle) * 5;
        g.ball.vy = Math.sin(angle) * 5;
        g.launched = true;
    }, []);

    useRaf(status === "running" && active, (dt) => {
        const g = game.current;
        const k = keys.current;
        if (k.has("ArrowLeft") || k.has("a")) g.paddle -= 7 * dt;
        if (k.has("ArrowRight") || k.has("d")) g.paddle += 7 * dt;
        g.paddle = Math.max(PADDLE_W / 2, Math.min(W - PADDLE_W / 2, g.paddle));
        const ball = g.ball;

        if (!g.launched) {
            ball.x = g.paddle;
            draw();
            return;
        }
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
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
            Math.abs(ball.x - g.paddle) <= PADDLE_W / 2 + BALL / 2
        ) {
            const offset = (ball.x - g.paddle) / (PADDLE_W / 2);
            const speed = Math.min(9, Math.hypot(ball.vx, ball.vy) * 1.015);
            const angle = -Math.PI / 2 + offset * 1.0;
            ball.vx = Math.cos(angle) * speed;
            ball.vy = Math.sin(angle) * speed;
            ball.y = PADDLE_Y - BALL / 2;
        }

        for (const brick of g.bricks) {
            if (!brick.alive) continue;
            const bh = BRICK * 1.7;
            if (
                ball.x + BALL / 2 > brick.x &&
                ball.x - BALL / 2 < brick.x + BRICK &&
                ball.y + BALL / 2 > brick.y &&
                ball.y - BALL / 2 < brick.y + bh
            ) {
                brick.alive = false;
                // bounce off the side the ball came from
                const fromSide = Math.min(
                    ball.x + BALL / 2 - brick.x,
                    brick.x + BRICK - (ball.x - BALL / 2),
                );
                const fromTop = Math.min(
                    ball.y + BALL / 2 - brick.y,
                    brick.y + bh - (ball.y - BALL / 2),
                );
                if (fromSide < fromTop) ball.vx *= -1;
                else ball.vy *= -1;
                g.score += 10;
                setScore(g.score);
                break;
            }
        }

        if (g.bricks.every((brick) => !brick.alive)) {
            report(g.score);
            set("won");
        } else if (ball.y - BALL / 2 > H) {
            g.lives -= 1;
            setLives(g.lives);
            if (g.lives <= 0) {
                report(g.score);
                set("over");
            } else {
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
            if (statusRef.current === "over" || statusRef.current === "won") reset();
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
        game.current.paddle = Math.max(
            PADDLE_W / 2,
            Math.min(W - PADDLE_W / 2, event.clientX - rect.left),
        );
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
                    else if (statusRef.current === "over" || statusRef.current === "won") reset();
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
                {message ? <Overlay>{message}</Overlay> : null}
                <Confetti run={status === "won"} />
            </div>
        </GameShell>
    );
}
