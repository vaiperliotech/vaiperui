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

const W = 440;
const H = 520;
const COLS = 8;
const SHIP_Y = H - 46;
const SHIP_W = 34;
const ENEMY = 26;

type Status = "ready" | "running" | "paused" | "over";
type Enemy = { x: number; y: number; alive: boolean; color: string; points: number; row: number };
type Shot = { x: number; y: number; vy: number; color: string };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };

// the invaders are the header's three dots: red up top, then yellow, then green
const ROWS: Array<{ color: string; points: number }> = [
    { color: PALETTE.red, points: 30 },
    { color: PALETTE.yellow, points: 20 },
    { color: PALETTE.yellow, points: 20 },
    { color: PALETTE.green, points: 10 },
    { color: PALETTE.green, points: 10 },
];
const SHIELD_BLOCK = 5;

function buildEnemies(wave: number): Enemy[] {
    return ROWS.flatMap((row, r) =>
        Array.from({ length: COLS }, (_, c) => ({
            x: 36 + c * 42,
            y: 64 + r * 36 + Math.min(4, wave - 1) * 10,
            alive: true,
            row: r,
            ...row,
        })),
    );
}

function buildShields(): Array<{ x: number; y: number; alive: boolean }> {
    const blocks: Array<{ x: number; y: number; alive: boolean }> = [];
    for (let s = 0; s < 3; s++) {
        const left = 54 + s * 130;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 10; c++) {
                // a notch at the bottom, like the original bunkers
                if (r === 3 && c > 2 && c < 7) continue;
                blocks.push({
                    x: left + c * SHIELD_BLOCK,
                    y: SHIP_Y - 62 + r * SHIELD_BLOCK,
                    alive: true,
                });
            }
        }
    }
    return blocks;
}

export function Invaders({ active, t }: GameProps) {
    const ui = t.ui;
    const canvas = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<Status>("ready");
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [wave, setWave] = useState(1);
    const [best, report] = useBest("invaders-best");
    const statusRef = useRef<Status>("ready");
    const keys = useRef(new Set<string>());
    const game = useRef({
        ship: W / 2,
        enemies: buildEnemies(1),
        shields: buildShields(),
        bullets: [] as Shot[],
        bombs: [] as Shot[],
        sparks: [] as Spark[],
        dir: 1,
        score: 0,
        lives: 3,
        wave: 1,
        cooldown: 0,
        hurt: 0,
        tick: 0,
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
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(0, H - 24, W, 1.5);

        for (const e of g.enemies) {
            if (!e.alive) continue;
            const wobble = Math.sin((g.tick + e.row * 10) / 14) * 1.5;
            ctx.fillStyle = e.color;
            ctx.beginPath();
            ctx.arc(e.x, e.y + wobble, ENEMY / 2, 0, Math.PI * 2);
            ctx.fill();
            // a face, so the dots look like they mean it
            ctx.fillStyle = PALETTE.bg0;
            ctx.beginPath();
            ctx.arc(e.x - 4.5, e.y - 2 + wobble, 2.2, 0, Math.PI * 2);
            ctx.arc(e.x + 4.5, e.y - 2 + wobble, 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(e.x - 4, e.y + 5 + wobble, 8, 1.8);
        }

        ctx.fillStyle = "rgba(77,163,255,0.55)";
        for (const block of g.shields) {
            if (block.alive) ctx.fillRect(block.x, block.y, SHIELD_BLOCK - 0.6, SHIELD_BLOCK - 0.6);
        }

        for (const shot of g.bullets) {
            ctx.fillStyle = shot.color;
            ctx.fillRect(shot.x - 1.5, shot.y - 8, 3, 12);
        }
        for (const shot of g.bombs) {
            ctx.fillStyle = shot.color;
            ctx.beginPath();
            ctx.roundRect(shot.x - 2, shot.y - 6, 4, 12, 2);
            ctx.fill();
        }
        for (const spark of g.sparks) {
            ctx.globalAlpha = Math.max(0, spark.life / 30);
            ctx.fillStyle = spark.color;
            ctx.fillRect(spark.x, spark.y, 3, 3);
        }
        ctx.globalAlpha = 1;

        // the ship is a tiny window: title bar, three dots, and a cannon
        if (g.hurt <= 0 || Math.floor(g.hurt / 5) % 2 === 0) {
            ctx.fillStyle = PALETTE.blue;
            ctx.fillRect(g.ship - 2.5, SHIP_Y - 12, 5, 12);
            ctx.fillStyle = PALETTE.bg3;
            ctx.beginPath();
            ctx.roundRect(g.ship - SHIP_W / 2, SHIP_Y - 2, SHIP_W, 20, 5);
            ctx.fill();
            ctx.strokeStyle = PALETTE.blue;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            [PALETTE.red, PALETTE.yellow, PALETTE.green].forEach((color, i) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(g.ship - 8 + i * 8, SHIP_Y + 5, 2.2, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }, []);

    const reset = useCallback(() => {
        game.current = {
            ship: W / 2,
            enemies: buildEnemies(1),
            shields: buildShields(),
            bullets: [],
            bombs: [],
            sparks: [],
            dir: 1,
            score: 0,
            lives: 3,
            wave: 1,
            cooldown: 0,
            hurt: 0,
            tick: 0,
        };
        setScore(0);
        setLives(3);
        setWave(1);
        set("ready");
        draw();
    }, [draw, set]);

    useEffect(() => reset(), [reset]);

    const burst = useCallback((x: number, y: number, color: string) => {
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.8 + Math.random() * 2.4;
            game.current.sparks.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 30,
                color,
            });
        }
    }, []);

    useRaf(status === "running" && active, (dt) => {
        const g = game.current;
        const k = keys.current;
        g.tick += dt;
        g.cooldown = Math.max(0, g.cooldown - dt);
        g.hurt = Math.max(0, g.hurt - dt);
        if (k.has("ArrowLeft") || k.has("a")) g.ship -= 5 * dt;
        if (k.has("ArrowRight") || k.has("d")) g.ship += 5 * dt;
        g.ship = Math.max(SHIP_W / 2, Math.min(W - SHIP_W / 2, g.ship));

        // the formation speeds up as it thins out
        const alive = g.enemies.filter((e) => e.alive);
        const speed = (0.5 + (1 - alive.length / (ROWS.length * COLS)) * 2.3 + g.wave * 0.12) * dt;
        const left = Math.min(...alive.map((e) => e.x));
        const right = Math.max(...alive.map((e) => e.x));
        if ((g.dir > 0 && right + ENEMY / 2 > W - 8) || (g.dir < 0 && left - ENEMY / 2 < 8)) {
            g.dir *= -1;
            for (const e of alive) e.y += 16;
        } else {
            for (const e of alive) e.x += g.dir * speed;
        }

        // one of the lowest dots in a random column drops a bomb
        if (Math.random() < (0.012 + g.wave * 0.003) * dt && alive.length > 0) {
            const column = alive[Math.floor(Math.random() * alive.length)];
            if (column) {
                const lowest = alive
                    .filter((e) => Math.abs(e.x - column.x) < 20)
                    .reduce((a, b) => (a.y > b.y ? a : b));
                g.bombs.push({
                    x: lowest.x,
                    y: lowest.y + 10,
                    vy: 2.6 + g.wave * 0.2,
                    color: lowest.color,
                });
            }
        }

        for (const shot of g.bullets) shot.y += shot.vy * dt;
        for (const shot of g.bombs) shot.y += shot.vy * dt;
        g.bullets = g.bullets.filter((shot) => shot.y > -10);
        g.bombs = g.bombs.filter((shot) => shot.y < H + 10);
        for (const spark of g.sparks) {
            spark.x += spark.vx * dt;
            spark.y += spark.vy * dt;
            spark.life -= dt;
        }
        g.sparks = g.sparks.filter((spark) => spark.life > 0);

        // shots wear the shields down, from either side
        for (const list of [g.bullets, g.bombs]) {
            for (const shot of list) {
                const block = g.shields.find(
                    (b) =>
                        b.alive &&
                        Math.abs(shot.x - (b.x + 2.5)) < 4 &&
                        Math.abs(shot.y - (b.y + 2.5)) < 6,
                );
                if (block) {
                    block.alive = false;
                    shot.y = list === g.bullets ? -50 : H + 50;
                }
            }
        }

        for (const shot of g.bullets) {
            const target = g.enemies.find(
                (e) => e.alive && Math.hypot(e.x - shot.x, e.y - shot.y) < ENEMY / 2 + 2,
            );
            if (target) {
                target.alive = false;
                shot.y = -50;
                g.score += target.points;
                setScore(g.score);
                burst(target.x, target.y, target.color);
            }
        }

        if (g.hurt <= 0) {
            const hit = g.bombs.find(
                (b) => Math.abs(b.x - g.ship) < SHIP_W / 2 && b.y > SHIP_Y - 4 && b.y < SHIP_Y + 20,
            );
            if (hit) {
                g.bombs = [];
                g.lives -= 1;
                g.hurt = 90;
                setLives(g.lives);
                burst(g.ship, SHIP_Y, PALETTE.blue);
            }
        }

        const lowest = Math.max(...g.enemies.filter((e) => e.alive).map((e) => e.y), 0);
        if (g.lives <= 0 || lowest + ENEMY / 2 >= SHIP_Y - 6) {
            report(g.score);
            set("over");
        } else if (!g.enemies.some((e) => e.alive)) {
            g.wave += 1;
            g.enemies = buildEnemies(g.wave);
            g.bombs = [];
            g.bullets = [];
            g.dir = 1;
            setWave(g.wave);
        }
        draw();
    });

    useEffect(() => {
        if (!active && statusRef.current === "running") set("paused");
    }, [active, set]);

    useGameKeys(active, (event) => {
        const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
        if (GAME_KEYS.has(event.key)) event.preventDefault();
        if (key === "r") return reset();
        if (key === "p" || key === "Escape") {
            if (statusRef.current === "running") set("paused");
            return;
        }
        if (key === " ") {
            if (statusRef.current === "over") reset();
            else if (statusRef.current !== "running") set("running");
            else {
                const g = game.current;
                if (g.cooldown <= 0 && g.bullets.length < 3) {
                    g.bullets.push({ x: g.ship, y: SHIP_Y - 12, vy: -8, color: PALETTE.ink });
                    g.cooldown = 14;
                }
            }
            return;
        }
        keys.current.add(key);
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
                    [ui.wave, wave],
                    [ui.lives, "♥".repeat(Math.max(0, lives)) || "–"],
                    [ui.best, Math.max(best ?? 0, score)],
                ]}
            />
            <div className="relative overflow-hidden rounded-lg border border-line-strong">
                <canvas
                    ref={canvas}
                    role="img"
                    aria-label="Space Invaders"
                    style={{ width: W, height: H }}
                    className="block"
                />
                {message ? <Overlay>{message}</Overlay> : null}
            </div>
            <p className="font-mono text-[11px] text-ink-faint">← → · space</p>
        </GameShell>
    );
}
