import { readStored } from "./games/shared";

// every record the games keep in the browser; the terminal and the scoreboard widget read them
export const RECORDS: Array<[label: string, key: string]> = [
    ["tic-tac-toe", "tictactoe-score"],
    ["memory 4x4 (moves)", "memory-best:small"],
    ["memory 6x6 (moves)", "memory-best:large"],
    ["color match", "colormatch-best"],
    ["2048", "2048-best"],
    ["wordle", "wordle-stats"],
    ["snake, small map", "snake-best:small"],
    ["snake, large map", "snake-best:large"],
    ["minesweeper easy (s)", "mines-best:easy"],
    ["minesweeper medium (s)", "mines-best:medium"],
    ["minesweeper hard (s)", "mines-best:hard"],
    ["minesweeper very hard (s)", "mines-best:veryHard"],
    ["bug hunt", "bughunt-best"],
    ["flappy", "flappy-best"],
    ["dino run", "dino-best"],
    ["pong (wins)", "pong-wins"],
    ["breakout", "breakout-best"],
    ["stack the buttons", "stack-best"],
    ["space invaders", "invaders-best"],
];

/** One line for a record, or null when the game has not been played yet. */
export function readRecord(key: string): string | null {
    const raw = readStored(`vaiperui:${key}`);
    if (raw === null) return null;
    try {
        if (key === "tictactoe-score") {
            const s = JSON.parse(raw) as { you: number; draw: number; cpu: number };
            return `${s.you}-${s.draw}-${s.cpu}`;
        }
        if (key === "wordle-stats") {
            const s = JSON.parse(raw) as {
                played: number;
                wins: number;
                streak: number;
                bestStreak: number;
            };
            return `${s.wins}/${s.played}`;
        }
    } catch {
        return null;
    }
    return raw;
}
