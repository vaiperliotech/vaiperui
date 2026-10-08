"use client";

import { useEffect, useState } from "react";
import { Input } from "vaiperui";
import { CodeBlock } from "./CodeBlock";
import { CodeIcon, EyeIcon } from "./icons";
import { TerminalWindow } from "./TerminalWindow";

/**
 * "Instalação ao vivo": digita o real fluxo de instalação caractere a
 * caractere, como se o pacote estivesse sendo montado ali na hora, e termina
 * revelando um preview de verdade — um `Input` real, interativo, com máscara
 * de CPF e `customColor` — provando os dois diferenciais do PRODUCT.md em
 * vez de só descrevê-los em prosa. As abas "code"/"live" deixam ver os dois
 * lados: o JSX que produz o resultado, e o resultado rodando de verdade.
 * Todo passo do código é verificável (README/build real do pacote) — nada
 * de métrica inventada.
 *
 * Acessibilidade: o bloco de instalação é decorativo → aria-hidden (o
 * conteúdo real fica na coluna esquerda). O preview NÃO é decorativo: na
 * aba "live" é um `Input` de verdade, focável, com label associado — nada
 * de aria-hidden nele. prefers-reduced-motion monta o estado final direto,
 * sem animar.
 */
const LINES: string[] = [
    "npm install vaiperui",
    'import "vaiperui/theme.css"',
    'import { Input } from "vaiperui"',
];

const INPUT_CODE = `import { Input } from "vaiperui";

<Input label="CPF" mask="cpf" customColor="#a78bfa" />`;

const CHAR_DELAY = 26;
const LINE_PAUSE = 420;

type View = "code" | "live";

const VIEW_OPTIONS: Array<{ id: View; label: string; icon: typeof CodeIcon }> = [
    { id: "code", label: "Ver código", icon: CodeIcon },
    { id: "live", label: "Ver preview ao vivo", icon: EyeIcon },
];

function ViewToggle({ view, onChange }: { view: View; onChange: (view: View) => void }) {
    return (
        <div className="flex items-center gap-0.5 rounded-md border border-line-strong bg-bg-0 p-0.5">
            {VIEW_OPTIONS.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    aria-pressed={view === option.id}
                    aria-label={option.label}
                    title={option.label}
                    onClick={() => onChange(option.id)}
                    className={`cursor-pointer rounded p-1 transition-colors duration-150 ${
                        view === option.id ? "bg-bg-2 text-ink" : "text-ink-faint hover:text-ink"
                    }`}
                >
                    <option.icon className="size-3.5" />
                </button>
            ))}
        </div>
    );
}

export function HeroBuildTerminal() {
    const [completed, setCompleted] = useState<string[]>([]);
    const [typing, setTyping] = useState("");
    const [done, setDone] = useState(false);
    const [view, setView] = useState<View>("live");

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            setCompleted(LINES);
            setDone(true);
            return;
        }

        let cancelled = false;
        let timer: number;
        const wait = (ms: number) =>
            new Promise<void>((resolve) => {
                timer = window.setTimeout(resolve, ms);
            });

        async function run() {
            for (const line of LINES) {
                for (let i = 1; i <= line.length; i++) {
                    await wait(CHAR_DELAY);
                    if (cancelled) return;
                    setTyping(line.slice(0, i));
                }
                await wait(LINE_PAUSE);
                if (cancelled) return;
                setCompleted((prev) => [...prev, line]);
                setTyping("");
            }
            if (!cancelled) setDone(true);
        }

        run();
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, []);

    return (
        <div className="flex w-full max-w-lg flex-col gap-4">
            <div aria-hidden="true">
                <TerminalWindow title="instalação — zsh">
                    <div className="font-mono text-[12.5px] leading-relaxed text-ink-dim">
                        {completed.map((line) => (
                            <div
                                key={line}
                                className="flex min-h-[1.25em] min-w-0 items-baseline gap-2"
                            >
                                <span className="select-none text-accent-blue">❯</span>
                                <span className="min-w-0 wrap-break-word text-ink">{line}</span>
                            </div>
                        ))}
                        {!done && (
                            <div className="flex min-h-[1.25em] min-w-0 items-baseline gap-2">
                                <span className="select-none text-accent-blue">❯</span>
                                <span className="min-w-0 wrap-break-word text-ink">{typing}</span>
                                <span className="caret-blink select-none text-accent-blue">▍</span>
                            </div>
                        )}
                    </div>
                </TerminalWindow>
            </div>

            <TerminalWindow
                title={view === "code" ? "Input.tsx" : "preview"}
                bodyClassName={view === "code" ? "p-4" : "p-6"}
                actions={<ViewToggle view={view} onChange={setView} />}
            >
                {view === "code" ? (
                    <CodeBlock code={INPUT_CODE} />
                ) : (
                    <div className="dark preview-theme">
                        <Input label="CPF" mask="cpf" customColor="#a78bfa" className="w-full" />
                    </div>
                )}
            </TerminalWindow>
        </div>
    );
}
