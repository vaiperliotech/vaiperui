"use client";

import { useSyncExternalStore } from "react";
import { FlagIcon } from "@/components/Flags";
import { makeT } from "@/data/samples";
import { type Locale, localeNames, locales } from "@/i18n/config";
import {
    getWallpaper,
    setWallpaper,
    subscribeWallpaper,
    WALLPAPERS,
    Wallpaper,
    type WallpaperId,
} from "../wallpaper";
import { type AppProps, Label, Pane } from "./kit";

const NAMES: Record<WallpaperId, [string, string, string]> = {
    blueprint: ["Blueprint", "Planta", "Plano"],
    aurora: ["Aurora", "Aurora", "Aurora"],
    violet: ["Violet", "Violeta", "Violeta"],
    stars: ["Stars", "Estrelas", "Estrellas"],
    plain: ["Plain", "Liso", "Liso"],
};

const RECORD_KEYS = [
    "tictactoe-score",
    "memory-best:small",
    "memory-best:large",
    "colormatch-best",
    "2048-best",
    "wordle-stats",
    "snake-best:small",
    "snake-best:large",
    "mines-best:easy",
    "mines-best:medium",
    "mines-best:hard",
    "mines-best:veryHard",
    "bughunt-best",
    "flappy-best",
    "dino-best",
    "pong-wins",
    "breakout-best",
    "stack-best",
    "invaders-best",
];

export function Settings({
    locale,
    onSwitchLocale,
}: AppProps & { onSwitchLocale: (locale: Locale) => void }) {
    const t = makeT(locale);
    const index = { en: 0, pt: 1, es: 2 }[locale];
    const current = useSyncExternalStore(
        subscribeWallpaper,
        getWallpaper,
        () => "blueprint" as WallpaperId,
    );

    function clearRecords() {
        try {
            for (const key of RECORD_KEYS) localStorage.removeItem(`vaiperui:${key}`);
        } catch {
            // storage blocked: nothing to clear
        }
    }

    return (
        <Pane className="flex flex-col gap-6">
            <section>
                <Label>{t("Wallpaper", "Papel de parede", "Fondo de pantalla")}</Label>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {WALLPAPERS.map((id) => (
                        <button
                            key={id}
                            type="button"
                            aria-pressed={current === id}
                            onClick={() => setWallpaper(id)}
                            className="group flex cursor-pointer flex-col gap-1.5 text-left focus-visible:outline-2 focus-visible:outline-accent-blue"
                        >
                            <span
                                className={`relative block h-16 overflow-hidden rounded-lg border bg-bg-0 transition-colors ${
                                    current === id
                                        ? "border-accent-blue"
                                        : "border-line-strong group-hover:border-ink-faint"
                                }`}
                            >
                                <Wallpaper id={id} scale={0.25} animated={false} />
                            </span>
                            <span
                                className={`font-mono text-[11px] ${current === id ? "text-accent-blue" : "text-ink-dim"}`}
                            >
                                {NAMES[id][index]}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <Label>{t("Language", "Idioma", "Idioma")}</Label>
                <div className="flex flex-wrap gap-2">
                    {locales.map((id) => (
                        <button
                            key={id}
                            type="button"
                            aria-pressed={locale === id}
                            onClick={() => onSwitchLocale(id)}
                            className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
                                locale === id
                                    ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                                    : "border-line-strong text-ink-dim hover:text-ink"
                            }`}
                        >
                            <FlagIcon locale={id} className="h-3 w-4" />
                            {localeNames[id]}
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <Label>{t("Records", "Recordes", "Récords")}</Label>
                <p className="mb-2 text-ink-dim text-xs">
                    {t(
                        "Your scores are kept in this browser only.",
                        "Seus pontos ficam salvos só neste navegador.",
                        "Tus puntos se guardan solo en este navegador.",
                    )}
                </p>
                <button
                    type="button"
                    onClick={clearRecords}
                    className="cursor-pointer rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-ink-dim transition-colors hover:border-[#ff5f57]/60 hover:text-[#ff5f57]"
                >
                    {t("Clear all records", "Apagar todos os recordes", "Borrar todos los récords")}
                </button>
            </section>
        </Pane>
    );
}
