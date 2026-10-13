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
export type UtilityId =
    | "playground"
    | "masklab"
    | "theme"
    | "installer"
    | "changelog"
    | "settings"
    | "notes"
    | "calculator"
    | "clock"
    | "calendar"
    | "converter"
    | "cssgen";
export type SystemId = "trash" | "readme";
export type AppId = "terminal" | "apps" | "arcade" | GameId | UtilityId | SystemId;

type Names = [en: string, pt: string, es: string];

/** The Apps window: the ones about the library first, then everyday tools. */
export const UTILITY_LIST: Array<{
    id: UtilityId;
    group: "lib" | "tools";
    size: [number, number];
    names: Names;
}> = [
    {
        id: "playground",
        group: "lib",
        size: [760, 580],
        names: ["Playground", "Playground", "Playground"],
    },
    {
        id: "masklab",
        group: "lib",
        size: [500, 470],
        names: ["Mask Lab", "Laboratório de Máscaras", "Laboratorio de Máscaras"],
    },
    {
        id: "theme",
        group: "lib",
        size: [800, 580],
        names: ["Theme Studio", "Estúdio de Cores", "Estudio de Color"],
    },
    {
        id: "installer",
        group: "lib",
        size: [640, 580],
        names: ["Installer", "Instalador", "Instalador"],
    },
    {
        id: "changelog",
        group: "lib",
        size: [540, 580],
        names: ["About vaiperui", "Sobre o vaiperui", "Acerca de vaiperui"],
    },
    { id: "notes", group: "tools", size: [680, 460], names: ["Notes", "Notas", "Notas"] },
    {
        id: "calculator",
        group: "tools",
        size: [310, 470],
        names: ["Calculator", "Calculadora", "Calculadora"],
    },
    { id: "clock", group: "tools", size: [480, 500], names: ["Clock", "Relógio", "Reloj"] },
    {
        id: "calendar",
        group: "tools",
        size: [440, 480],
        names: ["Calendar", "Calendário", "Calendario"],
    },
    {
        id: "converter",
        group: "tools",
        size: [480, 480],
        names: ["Converter", "Conversor", "Conversor"],
    },
    { id: "cssgen", group: "tools", size: [760, 560], names: ["CSS Lab", "CSS Lab", "CSS Lab"] },
    { id: "settings", group: "tools", size: [540, 460], names: ["Settings", "Ajustes", "Ajustes"] },
];

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

export const APP_IDS: AppId[] = [
    "terminal",
    "apps",
    "arcade",
    ...GAME_LIST.map((game) => game.id),
    ...UTILITY_LIST.map((app) => app.id),
    "trash",
    "readme",
];

export const WINDOW_SIZES: Record<AppId, [number, number]> = {
    terminal: [580, 360],
    apps: [700, 520],
    arcade: [700, 610],
    ...(Object.fromEntries(GAME_LIST.map((game) => [game.id, game.size])) as Record<
        GameId,
        [number, number]
    >),
    ...(Object.fromEntries(UTILITY_LIST.map((app) => [app.id, app.size])) as Record<
        UtilityId,
        [number, number]
    >),
    trash: [480, 420],
    readme: [540, 440],
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

/** What the terminal accepts after `run`, and as a command of its own. */
export const APP_SLUGS: Record<string, UtilityId> = {
    playground: "playground",
    masklab: "masklab",
    theme: "theme",
    installer: "installer",
    about: "changelog",
    changelog: "changelog",
    notes: "notes",
    calculator: "calculator",
    clock: "clock",
    calendar: "calendar",
    converter: "converter",
    csslab: "cssgen",
    settings: "settings",
};

const SYSTEM_NAMES: Record<SystemId, Names> = {
    trash: ["Trash", "Lixeira", "Papelera"],
    readme: ["readme.txt", "leia-me.txt", "léame.txt"],
};

export const appName = (id: UtilityId | SystemId, locale: "en" | "pt" | "es"): string => {
    const names = SYSTEM_NAMES[id as SystemId] ??
        UTILITY_LIST.find((app) => app.id === id)?.names ?? ["", "", ""];
    return names[{ en: 0, pt: 1, es: 2 }[locale]] ?? "";
};
