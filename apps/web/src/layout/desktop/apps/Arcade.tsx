"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { AppIcon } from "../icons";
import { GAME_LIST, type GameId } from "../registry";

type Labels = Dictionary["header"]["window"]["desktop"]["games"];

// Every game, easiest first. The dots are the difficulty, out of five.
export function Arcade({ labels, onPlay }: { labels: Labels; onPlay: (id: GameId) => void }) {
    return (
        <div className="h-full overflow-auto bg-bg-1 p-4">
            <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                {GAME_LIST.map((game) => (
                    <li key={game.id}>
                        <button
                            type="button"
                            onClick={() => onPlay(game.id)}
                            aria-label={`${labels.names[game.id]}, ${labels.difficulty} ${game.level}/5`}
                            className="group flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-line bg-bg-0 px-2 py-4 transition-colors hover:border-accent-blue/50 hover:bg-bg-2 focus-visible:outline-2 focus-visible:outline-accent-blue"
                        >
                            <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110 motion-reduce:transition-none">
                                <AppIcon id={game.id} />
                            </span>
                            <span className="text-center font-mono text-xs text-ink">
                                {labels.names[game.id]}
                            </span>
                            <span aria-hidden="true" className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((dot) => (
                                    <span
                                        key={dot}
                                        className={`size-1.5 rounded-full ${
                                            dot <= game.level ? "bg-accent-blue" : "bg-line-strong"
                                        }`}
                                    />
                                ))}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
