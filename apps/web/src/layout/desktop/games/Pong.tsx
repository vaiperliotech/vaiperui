"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
    GAME_KEYS,
    type GameProps,
    GameShell,
    Overlay,
    PALETTE,
    Pills,
    prepareCanvas,
    StatBar,
    useGameKeys,
    usePersistedState,
    useRaf,
} from "./shared";

const W = 480;
const H = 320;
const PADDLE_W = 10;
const PADDLE_H = 66;
const BALL = 10;
const MARGIN = 16;
const WIN_AT = 7;

type Mode = "1p" | "2p";
type Status = "ready" | "running" | "paused" | "over";

function serve(toRight: boolean) {
    const angle = (Math.random() - 0.5) * 0.7;
    const speed = 4.4;
    return {
        x: W / 2,
        y: H / 2,
        vx: Math.cos(angle) * speed * (toRight ? 1 : -1),
        vy: Math.sin(angle) * speed,
    };
}

export function Pong({ active, t }: GameProps) {
    const ui = t.ui;
    const canvas = useRef<HTMLCanvasElement>(null);
    const [mode, setMode] = useState<Mode>("1p");
    const [status, setStatus] = useState<Status>("ready");
    const [scores, setScores] = useState<[number, number]>([0, 0]);
    // matches won against the computer, kept between visits
    const [wins, setWins] = usePersistedState("pong-wins", 0);
    const statusRef = useRef<Status>("ready");
    const keys = useRef(new Set<string>());
    const game = useRef({ ball: serve(true), left: H / 2, right: H / 2, wait: 0 });

    const set = useCallback((next: Status) => {
        statusRef.current = next;
        setStatus(next);
    }, []);

    const draw = useCallback((current: [number, number]) => {
        const ctx = prepareCanvas(canvas.current, W, H);
        if (!ctx) return;
        const g = game.current;
        ctx.fillStyle = PALETTE.bg0;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        for (let y = 6; y < H; y += 22) ctx.fillRect(W / 2 - 1, y, 2, 12);
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.font = "700 56px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillText(String(current[0]), W / 2 - 64, 64);
        ctx.fillText(String(current[1]), W / 2 + 64, 64);

        ctx.fillStyle = PALETTE.blue;
        ctx.beginPath();
        ctx.roundRect(MARGIN, g.left - PADDLE_H / 2, PADDLE_W, PADDLE_H, 5);
        ctx.fill();
        ctx.fillStyle = PALETTE.violet;
        ctx.beginPath();
        ctx.roundRect(W - MARGIN - PADDLE_W, g.right - PADDLE_H / 2, PADDLE_W, PADDLE_H, 5);
        ctx.fill();
        ctx.fillStyle = PALETTE.ink;
        ctx.beginPath();
        ctx.roundRect(g.ball.x - BALL / 2, g.ball.y - BALL / 2, BALL, BALL, 3);
        ctx.fill();
    }, []);

    const reset = useCallback(() => {
        game.current = { ball: serve(Math.random() < 0.5), left: H / 2, right: H / 2, wait: 0 };
        setScores([0, 0]);
        set("ready");
        draw([0, 0]);
    }, [draw, set]);

    // changing the mode starts a fresh match
    // biome-ignore lint/correctness/useExhaustiveDependencies: mode is the trigger, reset does not read it
    useEffect(() => reset(), [mode]);

    useRaf(status === "running" && active, (dt) => {
        const g = game.current;
        const k = keys.current;
        const speed = 5.2 * dt;
        const clamp = (v: number) => Math.max(PADDLE_H / 2, Math.min(H - PADDLE_H / 2, v));

        // left: W/S (and the arrows when playing alone); right: arrows, or the computer
        if (k.has("w") || (mode === "1p" && k.has("ArrowUp"))) g.left = clamp(g.left - speed);
        if (k.has("s") || (mode === "1p" && k.has("ArrowDown"))) g.left = clamp(g.left + speed);
        if (mode === "2p") {
            if (k.has("ArrowUp")) g.right = clamp(g.right - speed);
            if (k.has("ArrowDown")) g.right = clamp(g.right + speed);
        } else if (g.ball.vx > 0 || Math.abs(g.ball.x - W / 2) < W / 4) {
            // the computer follows the ball, a little slower than the ball's speed so it can lose
            const target = g.ball.y + Math.sin(g.ball.x / 40) * 14;
            const step = Math.min(3.5 * dt, Math.abs(target - g.right));
            g.right = clamp(g.right + Math.sign(target - g.right) * step);
        }

        if (g.wait > 0) {
            g.wait -= dt;
            draw(scores);
            return;
        }

        const ball = g.ball;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        if (ball.y < BALL / 2 || ball.y > H - BALL / 2) {
            ball.vy *= -1;
            ball.y = Math.max(BALL / 2, Math.min(H - BALL / 2, ball.y));
        }

        const hit = (paddleY: number, side: "left" | "right") => {
            const edge = side === "left" ? MARGIN + PADDLE_W : W - MARGIN - PADDLE_W;
            const crossing =
                side === "left"
                    ? ball.x - BALL / 2 <= edge && ball.vx < 0
                    : ball.x + BALL / 2 >= edge && ball.vx > 0;
            if (!crossing || Math.abs(ball.y - paddleY) > PADDLE_H / 2 + BALL / 2) return;
            const offset = (ball.y - paddleY) / (PADDLE_H / 2);
            const next = Math.min(11, Math.hypot(ball.vx, ball.vy) * 1.07);
            const angle = offset * 0.95;
            ball.vx = Math.cos(angle) * next * (side === "left" ? 1 : -1);
            ball.vy = Math.sin(angle) * next;
            ball.x = side === "left" ? edge + BALL / 2 : edge - BALL / 2;
        };
        hit(g.left, "left");
        hit(g.right, "right");

        if (ball.x < -BALL || ball.x > W + BALL) {
            const next: [number, number] =
                ball.x < 0 ? [scores[0], scores[1] + 1] : [scores[0] + 1, scores[1]];
            setScores(next);
            if (next[0] >= WIN_AT || next[1] >= WIN_AT) {
                if (mode === "1p" && next[0] >= WIN_AT) setWins((count) => count + 1);
                set("over");
            } else {
                g.ball = serve(ball.x < 0);
                g.wait = 40;
            }
            draw(next);
            return;
        }
        draw(scores);
    });

    useEffect(() => {
        if (!active && statusRef.current === "running") set("paused");
    }, [active, set]);

    useGameKeys(active, (event) => {
        const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
        if (GAME_KEYS.has(event.key)) event.preventDefault();
        if (key === " ") {
            if (statusRef.current === "over") reset();
            else set(statusRef.current === "running" ? "paused" : "running");
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

    const winner = scores[0] >= WIN_AT ? 1 : 2;
    const message =
        status === "ready"
            ? ui.start
            : status === "paused"
              ? ui.paused
              : status === "over"
                ? mode === "1p"
                    ? winner === 1
                        ? ui.win
                        : ui.over
                    : `${ui.player} ${winner} · ${ui.win}`
                : "";

    return (
        <GameShell>
            <Pills
                value={mode}
                options={[
                    { id: "1p", label: ui.players1 },
                    { id: "2p", label: ui.players2 },
                ]}
                onChange={setMode}
            />
            <StatBar
                width={W}
                items={[
                    [mode === "1p" ? ui.you : `${ui.player} 1`, scores[0]],
                    [mode === "1p" ? "CPU" : `${ui.player} 2`, scores[1]],
                ]}
            />
            <div className="relative overflow-hidden rounded-lg border border-line-strong">
                <canvas
                    ref={canvas}
                    role="img"
                    aria-label="Pong"
                    style={{ width: W, height: H }}
                    className="block"
                />
                {message ? <Overlay>{message}</Overlay> : null}
            </div>
            <p className="font-mono text-[11px] text-ink-faint">
                {mode === "1p"
                    ? `W / S · ↑ / ↓ · ${ui.wins} ${wins}`
                    : `${ui.player} 1: W / S · ${ui.player} 2: ↑ / ↓`}
            </p>
        </GameShell>
    );
}
