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

const W = 340;
const H = 500;
const GROUND = 44;
const BIRD = 28;
const BIRD_X = 90;
const GRAVITY = 0.42;
const FLAP = -6.9;
const PIPE_W = 58;
const GAP = 138;
const SPACING = 200;

type Status = "ready" | "running" | "over";
type Pipe = { x: number; top: number; passed: boolean };

function newPipe(x: number): Pipe {
    return { x, top: 70 + Math.random() * (H - GROUND - GAP - 140), passed: false };
}

export function Flappy({ active, t }: GameProps) {
    const ui = t.ui;
    const canvas = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<Status>("ready");
    const [score, setScore] = useState(0);
    const [best, report] = useBest("flappy-best");
    const statusRef = useRef<Status>("ready");
    const game = useRef({ y: H / 2, vy: 0, pipes: [] as Pipe[], offset: 0, score: 0 });

    const set = useCallback((next: Status) => {
        statusRef.current = next;
        setStatus(next);
    }, []);

    const draw = useCallback(() => {
        const ctx = prepareCanvas(canvas.current, W, H);
        if (!ctx) return;
        const g = game.current;
        ctx.fillStyle = PALETTE.bg;
        ctx.fillRect(0, 0, W, H);
        // faint grid, like the site's blueprint backdrop
        ctx.fillStyle = "rgba(255,255,255,0.035)";
        for (let x = -(g.offset % 36); x < W; x += 36) ctx.fillRect(x, 0, 1, H);
        for (let y = 0; y < H; y += 36) ctx.fillRect(0, y, W, 1);

        for (const pipe of g.pipes) {
            for (const [y, h] of [
                [0, pipe.top],
                [pipe.top + GAP, H - GROUND - pipe.top - GAP],
            ] as const) {
                ctx.fillStyle = PALETTE.bg3;
                ctx.beginPath();
                ctx.roundRect(pipe.x, y, PIPE_W, h, 6);
                ctx.fill();
                ctx.strokeStyle = "rgba(77,163,255,0.55)";
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
            // each column ends in a lip, like a component's header bar
            ctx.fillStyle = PALETTE.blue;
            ctx.fillRect(pipe.x - 4, pipe.top - 10, PIPE_W + 8, 10);
            ctx.fillRect(pipe.x - 4, pipe.top + GAP, PIPE_W + 8, 10);
        }

        ctx.fillStyle = PALETTE.bg2;
        ctx.fillRect(0, H - GROUND, W, GROUND);
        ctx.fillStyle = PALETTE.line;
        ctx.fillRect(0, H - GROUND, W, 1.5);
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        for (let x = -(g.offset % 28); x < W; x += 28) ctx.fillRect(x, H - GROUND + 14, 14, 2);

        // the bird is the logo: a rounded tile with "ui" on it, tilting with its speed
        ctx.save();
        ctx.translate(BIRD_X + BIRD / 2, g.y + BIRD / 2);
        ctx.rotate(Math.max(-0.5, Math.min(1.1, g.vy * 0.07)));
        const fill = ctx.createLinearGradient(-BIRD / 2, -BIRD / 2, BIRD / 2, BIRD / 2);
        fill.addColorStop(0, PALETTE.blue);
        fill.addColorStop(1, PALETTE.violet);
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.roundRect(-BIRD / 2, -BIRD / 2, BIRD, BIRD, 9);
        ctx.fill();
        ctx.fillStyle = PALETTE.bg0;
        ctx.font = "700 15px ui-sans-serif, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("ui", 0, 1);
        ctx.restore();

        ctx.fillStyle = PALETTE.ink;
        ctx.font = "700 34px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(String(g.score), W / 2, 62);
    }, []);

    const reset = useCallback(() => {
        game.current = {
            y: H / 2,
            vy: 0,
            pipes: [newPipe(W + 60), newPipe(W + 60 + SPACING), newPipe(W + 60 + SPACING * 2)],
            offset: 0,
            score: 0,
        };
        setScore(0);
        set("ready");
        draw();
    }, [draw, set]);

    useEffect(() => reset(), [reset]);

    const flap = useCallback(() => {
        if (statusRef.current === "over") return;
        if (statusRef.current === "ready") set("running");
        game.current.vy = FLAP;
    }, [set]);

    useRaf(status === "running" && active, (dt) => {
        const g = game.current;
        const speed = 2.3 + Math.min(1.6, g.score * 0.06);
        g.vy += GRAVITY * dt;
        g.y += g.vy * dt;
        g.offset += speed * dt;
        for (const pipe of g.pipes) pipe.x -= speed * dt;
        const first = g.pipes[0];
        if (first && first.x < -PIPE_W - 10) {
            g.pipes.shift();
            const last = g.pipes[g.pipes.length - 1];
            g.pipes.push(newPipe((last?.x ?? W) + SPACING));
        }
        let dead = g.y + BIRD > H - GROUND || g.y < -20;
        for (const pipe of g.pipes) {
            const overlapX = BIRD_X + BIRD - 4 > pipe.x && BIRD_X + 4 < pipe.x + PIPE_W;
            if (overlapX && (g.y + 4 < pipe.top || g.y + BIRD - 4 > pipe.top + GAP)) dead = true;
            if (!pipe.passed && pipe.x + PIPE_W < BIRD_X) {
                pipe.passed = true;
                g.score += 1;
                setScore(g.score);
            }
        }
        draw();
        if (dead) {
            g.y = Math.min(g.y, H - GROUND - BIRD);
            report(g.score);
            set("over");
            draw();
        }
    });

    useEffect(() => {
        if (!active && statusRef.current === "running") reset();
    }, [active, reset]);

    useGameKeys(active, (event) => {
        if (GAME_KEYS.has(event.key)) event.preventDefault();
        if (event.key === " " || event.key === "ArrowUp" || event.key === "w") {
            if (statusRef.current === "over") reset();
            else flap();
        } else if (event.key === "r") reset();
    });

    return (
        <GameShell>
            <StatBar
                width={W}
                items={[
                    [ui.score, score],
                    [ui.best, Math.max(best ?? 0, score)],
                ]}
            />
            {/* a click anywhere on the board flaps, like a tap; the keyboard has Space */}
            <div
                onPointerDown={() => (statusRef.current === "over" ? reset() : flap())}
                className="relative cursor-pointer overflow-hidden rounded-lg border border-line-strong"
            >
                <canvas
                    ref={canvas}
                    role="img"
                    aria-label="Flappy"
                    style={{ width: W, height: H }}
                    className="block"
                />
                {status === "ready" ? <Overlay>{ui.start}</Overlay> : null}
                {status === "over" ? (
                    <Overlay>
                        <div className="flex flex-col gap-1">
                            <span>{ui.over}</span>
                            <span className="text-ink-dim">{ui.restart}</span>
                        </div>
                    </Overlay>
                ) : null}
            </div>
        </GameShell>
    );
}
