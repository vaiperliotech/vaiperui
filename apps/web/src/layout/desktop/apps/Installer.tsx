"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "vaiperui";

import { CodeBlock } from "@/components/CodeBlock";
import { CheckIcon } from "@/components/icons";
import { makeT } from "@/data/samples";
import { Pills } from "../games/shared";
import type { AppProps } from "./kit";
import { Pane } from "./kit";

const PM = {
    npm: ["npm install vaiperui", "added 3 packages in 2s"],
    pnpm: ["pnpm add vaiperui", "+ vaiperui 1.0.0-beta · Done in 1.4s"],
    yarn: ["yarn add vaiperui", "success Saved 3 new dependencies."],
    bun: ["bun add vaiperui", "installed vaiperui · 3 packages [0.9s]"],
} as const;
type Manager = keyof typeof PM;
type Phase = "idle" | "running" | "done";

// How long each step "runs" while the installer plays
const STEP_MS = [1700, 1000, 900, 700];

// Four steps from nothing to a rendered component. Each one has its code and a copy button, and
// "Run" plays them in order like a real install.
export function Installer({ locale, active }: AppProps) {
    const t = makeT(locale);
    const [manager, setManager] = useState<Manager>("npm");
    const [current, setCurrent] = useState(-1);
    const [phase, setPhase] = useState<Phase>("idle");
    const timer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(timer.current), []);
    useEffect(() => {
        if (!active) window.clearTimeout(timer.current);
    }, [active]);

    const steps = [
        {
            title: t("Install the package", "Instale o pacote", "Instala el paquete"),
            note: t(
                "From npm. React 19+ and Tailwind CSS v4 are needed.",
                "Pelo npm. Precisa de React 19+ e Tailwind CSS v4.",
                "Desde npm. Se necesita React 19+ y Tailwind CSS v4.",
            ),
            code: PM[manager][0],
        },
        {
            title: t("Import the CSS once", "Importe o CSS uma vez", "Importa el CSS una vez"),
            note: t(
                "In your root stylesheet, next to Tailwind.",
                "No seu CSS raiz, junto do Tailwind.",
                "En tu CSS raíz, junto a Tailwind.",
            ),
            code: '@import "tailwindcss";\n@import "vaiperui/theme.css";\n\n@source "../node_modules/vaiperui/dist";',
        },
        {
            title: t(
                "Turn on dark mode (optional)",
                "Ligue o dark mode (opcional)",
                "Activa el modo oscuro (opcional)",
            ),
            note: t(
                "Add the dark class to any ancestor.",
                "Adicione a classe dark em um ancestral.",
                "Agrega la clase dark a un ancestro.",
            ),
            code: '<html lang="en" className="dark">',
        },
        {
            title: t(
                "Render your first component",
                "Renderize seu primeiro componente",
                "Renderiza tu primer componente",
            ),
            note: t(
                "Everything is exported from the package root.",
                "Tudo sai da raiz do pacote.",
                "Todo se exporta desde la raíz del paquete.",
            ),
            code: 'import { Button } from "vaiperui";\n\nexport function Example() {\n  return <Button variantColor="primary">Click here</Button>;\n}',
        },
    ];

    function run() {
        window.clearTimeout(timer.current);
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            setCurrent(steps.length);
            setPhase("done");
            return;
        }
        setPhase("running");
        const play = (index: number) => {
            setCurrent(index);
            if (index >= steps.length) {
                setPhase("done");
                return;
            }
            timer.current = window.setTimeout(() => play(index + 1), STEP_MS[index] ?? 900);
        };
        play(0);
    }

    function reset() {
        window.clearTimeout(timer.current);
        setCurrent(-1);
        setPhase("idle");
    }

    const progress = current < 0 ? 0 : Math.min(100, (current / steps.length) * 100);

    return (
        <Pane className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Pills
                    value={manager}
                    options={(Object.keys(PM) as Manager[]).map((id) => ({ id, label: id }))}
                    onChange={setManager}
                />
                <div className="flex items-center gap-2">
                    {phase !== "idle" ? (
                        <button
                            type="button"
                            onClick={reset}
                            className="cursor-pointer font-mono text-xs text-ink-faint hover:text-ink"
                        >
                            {t("Reset", "Reiniciar", "Reiniciar")}
                        </button>
                    ) : null}
                    <Button
                        size="sm"
                        customColor="#4da3ff"
                        onClick={run}
                        disabled={phase === "running"}
                    >
                        {phase === "running"
                            ? t("Installing…", "Instalando…", "Instalando…")
                            : t("Run", "Executar", "Ejecutar")}
                    </Button>
                </div>
            </div>

            <div className="h-1 overflow-hidden rounded-full bg-bg-3" aria-hidden="true">
                <div
                    className="h-full rounded-full bg-accent-blue transition-[width] duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <ol className="flex flex-col gap-3">
                {steps.map((step, index) => {
                    const state =
                        current > index || phase === "done"
                            ? "done"
                            : current === index
                              ? "running"
                              : "idle";
                    return (
                        <li
                            key={step.title}
                            className={`rounded-xl border bg-bg-0 p-3 transition-colors ${state === "running" ? "border-accent-blue/60" : "border-line"}`}
                        >
                            <div className="mb-2 flex items-center gap-2.5">
                                <span
                                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] ${
                                        state === "done"
                                            ? "border-[#28c840] bg-[#28c840] text-[#05070d]"
                                            : state === "running"
                                              ? "border-accent-blue text-accent-blue"
                                              : "border-line-strong text-ink-faint"
                                    }`}
                                >
                                    {state === "done" ? (
                                        <CheckIcon className="size-3" />
                                    ) : (
                                        index + 1
                                    )}
                                </span>
                                <div className="min-w-0">
                                    <p className="font-display font-semibold text-ink text-sm">
                                        {step.title}
                                    </p>
                                    <p className="text-ink-dim text-xs">{step.note}</p>
                                </div>
                            </div>
                            <CodeBlock
                                alwaysShowCopy
                                code={step.code}
                                className="rounded-lg bg-bg-1 p-3 pr-20"
                            />
                            {index === 0 && state !== "idle" ? (
                                <p className="mt-2 font-mono text-[11px] text-ink-faint">
                                    {state === "running" ? "resolving…" : `✓ ${PM[manager][1]}`}
                                </p>
                            ) : null}
                            {index === 3 && state === "done" ? (
                                <div className="mt-3 flex items-center gap-3 rounded-lg border border-line bg-white p-3">
                                    <Button variantColor="primary" ripple>
                                        {t("Click here", "Clique aqui", "Haz clic aquí")}
                                    </Button>
                                    <span className="font-mono text-[11px] text-neutral-500">
                                        {t("It works.", "Funcionou.", "Funciona.")}
                                    </span>
                                </div>
                            ) : null}
                        </li>
                    );
                })}
            </ol>
        </Pane>
    );
}
