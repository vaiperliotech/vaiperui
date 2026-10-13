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

const W = 560;
const H = 200;
const GROUND = 160;
const RUN_X = 56;
const GRAVITY = 0.68;
const JUMP = -11.6;

type Status = "ready" | "running" | "over";
type Obstacle = { x: number; w: number; h: number; lift: number; text: string; color: string };

// what the `$` has to get past: the things that break a build
const GROUND_KINDS = [
    { text: "{}", w: 28, h: 30, color: PALETTE.violet },
    { text: "</>", w: 42, h: 26, color: PALETTE.blue },
    { text: "404", w: 38, h: 26, color: PALETTE.red },
    { text: ";", w: 14, h: 32, color: PALETTE.green },
];
// a flyer sits at head height: ducking slides under it, standing up does not
const FLYER = { text: "NaN", w: 40, h: 22, lift: 22, color: PALETTE.yellow };

export function Dino({ active, t }: GameProps) {
    const ui = t.ui;
    const canvas = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<Status>("ready");
    const [score, setScore] = useState(0);
    const [best, report] = useBest("dino-best");
    const statusRef = useRef<Status>("ready");
    const duck = useRef(false);
    const game = useRef({
        y: 0,
        vy: 0,
        distance: 0,
        nextGap: 320,
        obstacles: [] as Obstacle[],
        offset: 0,
        blink: 0,
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

        ctx.fillStyle = PALETTE.line;
        ctx.fillRect(0, GROUND + 4, W, 1.5);
        ctx.fillStyle = "rgba(255,255,255,0.14)";
        for (let x = -(g.offset % 48); x < W; x += 48) ctx.fillRect(x, GROUND + 14, 18, 2);

        ctx.textBaseline = "alphabetic";
        ctx.font = "700 26px ui-monospace, SFMono-Regular, monospace";
        for (const o of g.obstacles) {
            ctx.fillStyle = o.color;
            ctx.textAlign = "left";
            ctx.fillText(o.text, o.x, GROUND - o.lift);
        }

        // the runner: the terminal prompt, ducking squashes it, a block cursor trails behind
        const ducking = duck.current && g.y === 0;
        ctx.save();
        ctx.translate(RUN_X, GROUND + g.y);
        if (ducking) ctx.scale(1.25, 0.62);
        ctx.fillStyle = PALETTE.blue;
        ctx.font = "700 32px ui-monospace, SFMono-Regular, monospace";
        ctx.textAlign = "left";
        ctx.fillText("$", 0, 0);
        ctx.restore();
        if (Math.floor(g.blink / 24) % 2 === 0) {
            ctx.fillStyle = PALETTE.ink;
            ctx.fillRect(
                RUN_X + (ducking ? 26 : 21),
                GROUND + g.y - (ducking ? 15 : 26),
                8,
                ducking ? 15 : 26,
            );
        }

        ctx.fillStyle = PALETTE.dim;
        ctx.font = "500 12px ui-monospace, monospace";
        ctx.textAlign = "right";
        ctx.fillText(String(Math.floor(g.distance / 8)).padStart(5, "0"), W - 16, 24);
    }, []);

    const reset = useCallback(() => {
        game.current = {
            y: 0,
            vy: 0,
            distance: 0,
            nextGap: 320,
            obstacles: [],
            offset: 0,
            blink: 0,
        };
        setScore(0);
        set("ready");
        draw();
    }, [draw, set]);

    useEffect(() => reset(), [reset]);

    const jump = useCallback(() => {
        if (statusRef.current === "over") return;
        if (statusRef.current === "ready") set("running");
        const g = game.current;
        if (g.y === 0) g.vy = JUMP;
    }, [set]);

    useRaf(status === "running" && active, (dt) => {
        const g = game.current;
        const speed = Math.min(14, 6 + g.distance / 1400);
        g.distance += speed * dt;
        g.offset += speed * dt;
        g.blink += dt;
        // a duck while airborne drops the runner faster
        g.vy += GRAVITY * dt * (duck.current && g.y < 0 ? 2.2 : 1);
        g.y = Math.min(0, g.y + g.vy * dt);
        if (g.y === 0) g.vy = 0;

        for (const o of g.obstacles) o.x -= speed * dt;
        g.obstacles = g.obstacles.filter((o) => o.x + o.w > -10);
        g.nextGap -= speed * dt;
        if (g.nextGap <= 0) {
            const flyer = g.distance / 8 > 250 && Math.random() < 0.3;
            const kind = flyer
                ? FLYER
                : (GROUND_KINDS[Math.floor(Math.random() * GROUND_KINDS.length)] ?? FLYER);
            g.obstacles.push({
                x: W + 10,
                w: kind.w,
                h: kind.h,
                lift: "lift" in kind ? kind.lift : 0,
                text: kind.text,
                color: kind.color,
            });
            g.nextGap = 240 + Math.random() * 280 + speed * 14;
        }

        const ducking = duck.current && g.y === 0;
        const body = {
            x: RUN_X + 3,
            w: 18,
            top: GROUND + g.y - (ducking ? 17 : 29),
            bottom: GROUND + g.y,
        };
        let dead = false;
        for (const o of g.obstacles) {
            const oBottom = GROUND - o.lift;
            const oTop = oBottom - o.h;
            if (
                body.x < o.x + o.w - 4 &&
                body.x + body.w > o.x + 4 &&
                body.top < oBottom - 3 &&
                body.bottom > oTop + 3
            ) {
                dead = true;
            }
        }
        const points = Math.floor(g.distance / 8);
        setScore(points);
        draw();
        if (dead) {
            report(points);
            set("over");
        }
    });

    useEffect(() => {
        if (!active && statusRef.current === "running") reset();
    }, [active, reset]);

    useGameKeys(active, (event) => {
        if (GAME_KEYS.has(event.key)) event.preventDefault();
        if (event.key === "ArrowDown" || event.key === "s") duck.current = true;
        else if (event.key === " " || event.key === "ArrowUp" || event.key === "w") {
            if (statusRef.current === "over") reset();
            else jump();
        } else if (event.key === "r") reset();
    });

    useEffect(() => {
        if (!active) return;
        const up = (event: KeyboardEvent) => {
            if (event.key === "ArrowDown" || event.key === "s") duck.current = false;
        };
        document.addEventListener("keyup", up);
        return () => document.removeEventListener("keyup", up);
    }, [active]);

    return (
        <GameShell>
            <StatBar
                width={W}
                items={[
                    [ui.score, score],
                    [ui.best, Math.max(best ?? 0, score)],
                ]}
            />
            {/* a click jumps, like a tap; the keyboard has Space and the arrows */}
            <div
                onPointerDown={() => (statusRef.current === "over" ? reset() : jump())}
                className="relative cursor-pointer overflow-hidden rounded-lg border border-line-strong"
            >
                <canvas
                    ref={canvas}
                    role="img"
                    aria-label="Dino Run"
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
            <p className="font-mono text-[11px] text-ink-faint">↑ / space · ↓</p>
        </GameShell>
    );
}
