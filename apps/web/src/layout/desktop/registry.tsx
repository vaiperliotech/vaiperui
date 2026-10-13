import type { ComponentType, ReactNode } from "react";

import type { GameProps } from "./games/shared";

export type GameId =
    | "tictactoe"
    | "memory"
    | "colormatch"
    | "g2048"
    | "wordle"
    | "snake"
    | "mines"
    | "bughunt"
    | "flappy"
    | "dino"
    | "pong"
    | "breakout"
    | "stack"
    | "invaders";
export type AppId = "terminal" | "arcade" | GameId;

/** Easiest first: the order of the Games window. `level` is 1 (relaxed) to 5 (hard). */
export const GAME_LIST: Array<{ id: GameId; level: 1 | 2 | 3 | 4 | 5; size: [number, number] }> = [
    { id: "tictactoe", level: 1, size: [340, 520] },
    { id: "memory", level: 1, size: [370, 540] },
    { id: "colormatch", level: 1, size: [400, 540] },
    { id: "g2048", level: 2, size: [410, 560] },
    { id: "wordle", level: 2, size: [410, 640] },
    { id: "snake", level: 2, size: [420, 470] },
    { id: "mines", level: 3, size: [380, 520] },
    { id: "bughunt", level: 3, size: [430, 570] },
    { id: "flappy", level: 3, size: [400, 650] },
    { id: "dino", level: 3, size: [620, 340] },
    { id: "pong", level: 4, size: [540, 520] },
    { id: "breakout", level: 4, size: [540, 600] },
    { id: "stack", level: 5, size: [420, 640] },
    { id: "invaders", level: 5, size: [500, 680] },
];

export const APP_IDS: AppId[] = ["terminal", "arcade", ...GAME_LIST.map((game) => game.id)];

export const WINDOW_SIZES: Record<AppId, [number, number]> = {
    terminal: [580, 360],
    arcade: [700, 610],
    ...(Object.fromEntries(GAME_LIST.map((game) => [game.id, game.size])) as Record<
        GameId,
        [number, number]
    >),
};

/** What the terminal accepts after `play`, and as a command of its own. */
export const GAME_SLUGS: Record<string, GameId> = {
    tictactoe: "tictactoe",
    memory: "memory",
    colormatch: "colormatch",
    "2048": "g2048",
    wordle: "wordle",
    snake: "snake",
    minesweeper: "mines",
    bughunt: "bughunt",
    flappy: "flappy",
    dino: "dino",
    pong: "pong",
    breakout: "breakout",
    stack: "stack",
    invaders: "invaders",
};

export type { ComponentType, GameProps, ReactNode };
