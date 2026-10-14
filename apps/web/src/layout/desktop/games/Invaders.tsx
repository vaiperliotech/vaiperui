"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { makeT } from "@/data/samples";
import { Lobby, type Room, useRoom } from "./room";
import {
    GAME_KEYS,
    type GameProps,
    GameShell,
    Overlay,
    PALETTE,
    Pills,
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
type Bullet = { x: number; y: number; vx: number; vy: number; owner: number };
type Bomb = { x: number; y: number; vy: number; row: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; color: string };
type Ship = { x: number; hurt: number; triple: number; rapid: number; shield: boolean };
type Drop = { x: number; y: number; kind: number };
type Block = { x: number; y: number; alive: boolean };

// what the host streams to the guest each frame: flat [x, y, extra] triples to keep it small
type State = {
    t: "s";
    e: number[];
    b: number[];
    o: number[];
    d: number[];
    h: string;
    x: number[];
    p: number[][];
    sc: number;
    l: number;
    w: number;
    st: Status;
    k: number;
};
type Msg = State | { t: "i"; x: number } | { t: "f" };

const DROP_CHANCE = 0.12;
const POWER_FRAMES = 600;
const MAX_LIVES = 5;
// T triple shot, R rapid fire, S shield, + extra life
const KINDS = "TRS+";
const KIND_COLORS = [PALETTE.yellow, PALETTE.red, PALETTE.blue, PALETTE.green];
const SHIP_COLORS = [PALETTE.blue, PALETTE.violet];

const makeShip = (x: number): Ship => ({ x, hurt: 0, triple: 0, rapid: 0, shield: false });
const clampX = (x: number) => Math.max(SHIP_W / 2, Math.min(W - SHIP_W / 2, x));

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

function buildShields(): Block[] {
    const blocks: Block[] = [];
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

function newGame(online: boolean) {
    return {
        ships: online ? [makeShip(W / 3), makeShip((W * 2) / 3)] : [makeShip(W / 2)],
        enemies: buildEnemies(1),
        shields: buildShields(),
        bullets: [] as Bullet[],
        bombs: [] as Bomb[],
        drops: [] as Drop[],
        sparks: [] as Spark[],
        dir: 1,
        score: 0,
        lives: online ? MAX_LIVES : 3,
        wave: 1,
        cooldown: [0, 0],
        tick: 0,
    };
}

type Game = ReturnType<typeof newGame>;

const r1 = Math.round;

function snapshot(g: Game, st: Status): State {
    return {
        t: "s",
        e: g.enemies.flatMap((e) => (e.alive ? [r1(e.x * 10) / 10, r1(e.y * 10) / 10, e.row] : [])),
        b: g.bullets.flatMap((b) => [r1(b.x), r1(b.y), b.owner]),
        o: g.bombs.flatMap((b) => [r1(b.x), r1(b.y), b.row]),
        d: g.drops.flatMap((d) => [r1(d.x), r1(d.y), d.kind]),
        h: g.shields.map((b) => (b.alive ? "1" : "0")).join(""),
        x: g.ships.map((s) => r1(s.x)),
        p: g.ships.map((s) => [r1(s.hurt), r1(s.triple), r1(s.rapid), s.shield ? 1 : 0]),
        sc: g.score,
        l: g.lives,
        w: g.wave,
        st,
        k: r1(g.tick),
    };
}

export function Invaders({ active, t, locale }: GameProps) {
    const ui = t.ui;
    const tr = makeT(locale);
    const canvas = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<Status>("ready");
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [wave, setWave] = useState(1);
    const [online, setOnline] = useState(false);
    const [best, report] = useBest("invaders-best");
    const statusRef = useRef<Status>("ready");
    const onlineRef = useRef(false);
    const keys = useRef(new Set<string>());
    const game = useRef<Game>(newGame(false));

    // the latest room, for callbacks that must stay stable
    const roomRef = useRef<Room<Msg> | null>(null);

    // the host streams the whole world; the guest only ever sees this
    const sync = useCallback(() => {
        const room = roomRef.current;
        if (onlineRef.current && room?.live && room.isHost) {
            room.send(snapshot(game.current, statusRef.current));
        }
    }, []);

    const set = useCallback(
        (next: Status) => {
            statusRef.current = next;
            setStatus(next);
            sync();
        },
        [sync],
    );

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
            ctx.fillStyle = shot.owner === 1 ? PALETTE.violet : PALETTE.ink;
            ctx.fillRect(shot.x - 1.5, shot.y - 8, 3, 12);
        }
        for (const shot of g.bombs) {
            ctx.fillStyle = ROWS[shot.row]?.color ?? PALETTE.red;
            ctx.beginPath();
            ctx.roundRect(shot.x - 2, shot.y - 6, 4, 12, 2);
            ctx.fill();
        }

        // power-up capsules
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const drop of g.drops) {
            ctx.fillStyle = KIND_COLORS[drop.kind] ?? PALETTE.ink;
            ctx.beginPath();
            ctx.roundRect(drop.x - 9, drop.y - 7, 18, 14, 6);
            ctx.fill();
            ctx.fillStyle = PALETTE.bg0;
            ctx.fillText(KINDS[drop.kind] ?? "", drop.x, drop.y + 0.5);
        }

        for (const spark of g.sparks) {
            ctx.globalAlpha = Math.max(0, spark.life / 30);
            ctx.fillStyle = spark.color;
            ctx.fillRect(spark.x, spark.y, 3, 3);
        }
        ctx.globalAlpha = 1;

        // each ship is a tiny window: title bar, three dots, and a cannon
        g.ships.forEach((ship, i) => {
            const color = SHIP_COLORS[i] ?? PALETTE.blue;
            if (ship.hurt <= 0 || Math.floor(ship.hurt / 5) % 2 === 0) {
                ctx.fillStyle = color;
                ctx.fillRect(ship.x - 2.5, SHIP_Y - 12, 5, 12);
                ctx.fillStyle = PALETTE.bg3;
                ctx.beginPath();
                ctx.roundRect(ship.x - SHIP_W / 2, SHIP_Y - 2, SHIP_W, 20, 5);
                ctx.fill();
                ctx.strokeStyle = color;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                [PALETTE.red, PALETTE.yellow, PALETTE.green].forEach((dot, d) => {
                    ctx.fillStyle = dot;
                    ctx.beginPath();
                    ctx.arc(ship.x - 8 + d * 8, SHIP_Y + 5, 2.2, 0, Math.PI * 2);
                    ctx.fill();
                });
            }
            if (ship.shield) {
                ctx.strokeStyle = "rgba(77,163,255,0.9)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(ship.x, SHIP_Y + 6, 27, 0, Math.PI * 2);
                ctx.stroke();
            }
            if (g.ships.length > 1) {
                ctx.font = "9px monospace";
                ctx.fillStyle = color;
                ctx.fillText(`P${i + 1}`, ship.x, SHIP_Y + 30);
            }

            // active power-ups, as little badges in the corner of the ship's side
            const badges = [
                ship.triple > 0 ? 0 : -1,
                ship.rapid > 0 ? 1 : -1,
                ship.shield ? 2 : -1,
            ].filter((k) => k >= 0);
            const left = i === 0 ? 8 : W - 8 - badges.length * 24 + 2;
            ctx.font = "bold 10px monospace";
            badges.forEach((k, n) => {
                ctx.fillStyle = KIND_COLORS[k] ?? PALETTE.ink;
                ctx.beginPath();
                ctx.roundRect(left + n * 24, H - 18, 22, 14, 5);
                ctx.fill();
                ctx.fillStyle = PALETTE.bg0;
                ctx.fillText(KINDS[k] ?? "", left + n * 24 + 11, H - 10.5);
            });
        });
    }, []);

    const reset = useCallback(
        (on: boolean) => {
            game.current = newGame(on);
            setScore(0);
            setLives(game.current.lives);
            setWave(1);
            set("ready");
            draw();
        },
        [draw, set],
    );

    useEffect(() => reset(false), [reset]);

    const room = useRoom<Msg>(
        "invaders",
        locale,
        (m) => {
            const g = game.current;
            const net = roomRef.current;
            if (!net) return;
            if (m.t === "i" && net.isHost) {
                const ship = g.ships[1];
                if (ship) ship.x = clampX(m.x);
            } else if (m.t === "f" && net.isHost) {
                if (statusRef.current === "running") fire(1);
            } else if (m.t === "s" && net.isGuest) {
                const mine = g.ships[1]?.x ?? (W * 2) / 3;
                g.enemies = [];
                for (let i = 0; i + 2 < m.e.length; i += 3) {
                    const row = m.e[i + 2] ?? 0;
                    g.enemies.push({
                        x: m.e[i] ?? 0,
                        y: m.e[i + 1] ?? 0,
                        alive: true,
                        row,
                        color: ROWS[row]?.color ?? PALETTE.red,
                        points: ROWS[row]?.points ?? 0,
                    });
                }
                g.bullets = [];
                for (let i = 0; i + 2 < m.b.length; i += 3) {
                    g.bullets.push({
                        x: m.b[i] ?? 0,
                        y: m.b[i + 1] ?? 0,
                        vx: 0,
                        vy: 0,
                        owner: m.b[i + 2] ?? 0,
                    });
                }
                g.bombs = [];
                for (let i = 0; i + 2 < m.o.length; i += 3) {
                    g.bombs.push({
                        x: m.o[i] ?? 0,
                        y: m.o[i + 1] ?? 0,
                        vy: 0,
                        row: m.o[i + 2] ?? 0,
                    });
                }
                g.drops = [];
                for (let i = 0; i + 2 < m.d.length; i += 3) {
                    g.drops.push({ x: m.d[i] ?? 0, y: m.d[i + 1] ?? 0, kind: m.d[i + 2] ?? 0 });
                }
                g.shields.forEach((b, i) => {
                    b.alive = m.h[i] === "1";
                });
                g.ships = m.p.map((p, i) => ({
                    x: i === 1 ? mine : (m.x[i] ?? 0),
                    hurt: p[0] ?? 0,
                    triple: p[1] ?? 0,
                    rapid: p[2] ?? 0,
                    shield: p[3] === 1,
                }));
                g.score = m.sc;
                g.tick = m.k;
                setScore(m.sc);
                setLives(m.l);
                setWave(m.w);
                if (m.st !== statusRef.current) set(m.st);
            }
        },
        () => reset(true),
    );
    roomRef.current = room;
    const guest = online && room.isGuest;

    // a new guest gets the world right away, whatever the status
    // biome-ignore lint/correctness/useExhaustiveDependencies: only the connection matters
    useEffect(() => sync(), [room.live]);

    function changeMode(next: "offline" | "online") {
        const on = next === "online";
        room.leave();
        onlineRef.current = on;
        setOnline(on);
        reset(on);
    }

    function fire(i: number) {
        const g = game.current;
        const ship = g.ships[i];
        if (!ship || (g.cooldown[i] ?? 0) > 0) return;
        const cap = (ship.rapid > 0 ? 6 : 3) * (ship.triple > 0 ? 3 : 1);
        if (g.bullets.filter((b) => b.owner === i).length >= cap) return;
        for (const vx of ship.triple > 0 ? [-1.6, 0, 1.6] : [0]) {
            g.bullets.push({ x: ship.x, y: SHIP_Y - 12, vx, vy: -8, owner: i });
        }
        g.cooldown[i] = ship.rapid > 0 ? 6 : 14;
    }

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

    const moveShip = (ship: Ship, dt: number) => {
        const k = keys.current;
        if (k.has("ArrowLeft") || k.has("a")) ship.x -= 5 * dt;
        if (k.has("ArrowRight") || k.has("d")) ship.x += 5 * dt;
        ship.x = clampX(ship.x);
    };

    // the guest only moves its own ship, tells the host, and draws what the host sent
    useRaf(guest && room.live && active, (dt) => {
        const g = game.current;
        g.tick += dt;
        const ship = g.ships[1];
        if (ship && statusRef.current === "running") {
            moveShip(ship, dt);
            room.send({ t: "i", x: r1(ship.x) });
        }
        draw();
    });

    useRaf(status === "running" && active && !guest, (dt) => {
        const g = game.current;
        g.tick += dt;
        g.cooldown = g.cooldown.map((c) => Math.max(0, c - dt));
        for (const ship of g.ships) {
            ship.hurt = Math.max(0, ship.hurt - dt);
            ship.triple = Math.max(0, ship.triple - dt);
            ship.rapid = Math.max(0, ship.rapid - dt);
        }
        const mine = g.ships[0];
        if (mine) moveShip(mine, dt);

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
                    row: lowest.row,
                });
            }
        }

        for (const shot of g.bullets) {
            shot.y += shot.vy * dt;
            shot.x += shot.vx * dt;
        }
        for (const shot of g.bombs) shot.y += shot.vy * dt;
        for (const drop of g.drops) drop.y += 1.1 * dt;
        g.bullets = g.bullets.filter((shot) => shot.y > -10 && shot.x > -10 && shot.x < W + 10);
        g.bombs = g.bombs.filter((shot) => shot.y < H + 10);
        g.drops = g.drops.filter((drop) => drop.y < H + 10);
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
                if (Math.random() < DROP_CHANCE) {
                    // extra lives are rare; the other three share the rest
                    const kind = Math.random() < 0.1 ? 3 : Math.floor(Math.random() * 3);
                    g.drops.push({ x: target.x, y: target.y, kind });
                }
            }
        }

        // ships catch capsules by touching them
        g.drops = g.drops.filter((drop) => {
            const ship = g.ships.find(
                (s) =>
                    Math.abs(drop.x - s.x) < SHIP_W / 2 + 8 &&
                    drop.y > SHIP_Y - 8 &&
                    drop.y < SHIP_Y + 20,
            );
            if (!ship) return true;
            if (drop.kind === 0) ship.triple = POWER_FRAMES;
            else if (drop.kind === 1) ship.rapid = POWER_FRAMES;
            else if (drop.kind === 2) ship.shield = true;
            else {
                g.lives = Math.min(MAX_LIVES, g.lives + 1);
                setLives(g.lives);
            }
            return false;
        });

        for (const ship of g.ships) {
            if (ship.hurt > 0) continue;
            const hit = g.bombs.find(
                (b) => Math.abs(b.x - ship.x) < SHIP_W / 2 && b.y > SHIP_Y - 4 && b.y < SHIP_Y + 20,
            );
            if (!hit) continue;
            burst(ship.x, SHIP_Y, PALETTE.blue);
            if (ship.shield) {
                // the shield takes this one bomb
                ship.shield = false;
                ship.hurt = 30;
                g.bombs = g.bombs.filter((b) => b !== hit);
            } else {
                g.bombs = [];
                g.lives -= 1;
                ship.hurt = 90;
                setLives(g.lives);
            }
        }

        const lowest = Math.max(...g.enemies.filter((e) => e.alive).map((e) => e.y), 0);
        if (g.lives <= 0 || lowest + ENEMY / 2 >= SHIP_Y - 6) {
            if (!onlineRef.current) report(g.score);
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
        sync();
    });

    useEffect(() => {
        if (!active && statusRef.current === "running" && !guest) set("paused");
    }, [active, set, guest]);

    useGameKeys(active, (event) => {
        const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
        if (GAME_KEYS.has(event.key)) event.preventDefault();
        if (guest) {
            // only the host starts, pauses and restarts
            if (key === " ") {
                if (statusRef.current === "running") room.send({ t: "f" });
            } else keys.current.add(key);
            return;
        }
        if (key === "r") return reset(onlineRef.current);
        if (key === "p" || key === "Escape") {
            if (statusRef.current === "running") set("paused");
            return;
        }
        if (key === " ") {
            if (online && !room.live) return;
            if (statusRef.current === "over") reset(onlineRef.current);
            else if (statusRef.current !== "running") set("running");
            else fire(0);
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

    const waiting = tr(
        "Waiting for the host…",
        "Esperando o anfitrião…",
        "Esperando al anfitrión…",
    );
    const message =
        status === "ready"
            ? guest
                ? waiting
                : ui.start
            : status === "paused"
              ? ui.paused
              : status === "over"
                ? `${ui.over} · ${guest ? waiting : ui.restart}`
                : "";

    return (
        <GameShell>
            <Pills
                value={online ? "online" : "offline"}
                options={[
                    { id: "offline", label: tr("Solo", "Solo", "Solo") },
                    { id: "online", label: "Online" },
                ]}
                onChange={changeMode}
            />
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
                {online && !room.live ? (
                    <Lobby room={room as Room<never>} locale={locale} />
                ) : message ? (
                    <Overlay>{message}</Overlay>
                ) : null}
            </div>
            <p className="font-mono text-[11px] text-ink-faint">← → · space</p>
        </GameShell>
    );
}
