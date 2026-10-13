"use client";

import { type ReactNode, useState } from "react";
import { Input, type InputMask } from "vaiperui";
import { CodeBlock } from "./CodeBlock";
import { CodeIcon, EyeIcon } from "./icons";
import { TerminalWindow } from "./TerminalWindow";

/**
 * Preview ao vivo: um `Input` real, interativo, com controles de máscara e
 * `customColor` — provando os dois diferenciais do PRODUCT.md em vez de só
 * descrevê-los em prosa. As abas "code"/"live" deixam ver os dois lados: o
 * JSX que produz o resultado, e o resultado rodando de verdade, sincronizados
 * com os controles abaixo.
 *
 * Acessibilidade: o preview e os controles NÃO são decorativos. Na aba
 * "live" é um `Input` de verdade, focável, com label associado, e os chips
 * são botões reais navegáveis por teclado.
 */
const MASKS: InputMask[] = ["cpf", "cnpj", "cep", "phone"];

export type HeroLabels = {
    color: string;
    mask: string;
    colors: { orange: string; green: string; violet: string };
    viewCode: string;
    viewLive: string;
    masks: Record<InputMask, string>;
};

const DEFAULT_COLOR = "#a78bfa";

const COLOR_VALUES = [
    { key: "orange", value: "#ff6600" },
    { key: "green", value: "#22c55e" },
    { key: "violet", value: DEFAULT_COLOR },
] as const;

type View = "code" | "live";

function ViewToggle({
    view,
    onChange,
    labels,
}: {
    view: View;
    onChange: (view: View) => void;
    labels: HeroLabels;
}) {
    const options: Array<{ id: View; label: string; icon: typeof CodeIcon }> = [
        { id: "code", label: labels.viewCode, icon: CodeIcon },
        { id: "live", label: labels.viewLive, icon: EyeIcon },
    ];

    return (
        <div className="flex items-center gap-0.5 rounded-md border border-line-strong bg-bg-0 p-0.5">
            {options.map((option) => (
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

function Chip({
    label,
    active,
    swatch,
    onClick,
}: {
    label: string;
    active: boolean;
    swatch?: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors duration-150 ${
                active
                    ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                    : "border-line-strong text-ink-faint hover:border-accent-blue/60 hover:text-ink"
            }`}
        >
            {swatch && (
                <span
                    aria-hidden="true"
                    className="size-2 rounded-full"
                    style={{ backgroundColor: swatch }}
                />
            )}
            {label}
        </button>
    );
}

function ControlGroup({ legend, children }: { legend: string; children: ReactNode }) {
    return (
        <fieldset className="m-0 flex min-w-0 flex-wrap items-center gap-1.5 border-0 p-0">
            <legend className="mr-1 font-mono text-[10px] text-ink-faint uppercase tracking-wider">
                {legend}
            </legend>
            {children}
        </fieldset>
    );
}

export function HeroBuildTerminal({ labels }: { labels: HeroLabels }) {
    const [view, setView] = useState<View>("live");
    const [mask, setMask] = useState<InputMask>("cpf");
    const [color, setColor] = useState(DEFAULT_COLOR);

    return (
        <div className="flex w-full max-w-lg flex-col gap-4">
            <TerminalWindow
                title={view === "code" ? "Input.tsx" : "preview"}
                bodyClassName={view === "code" ? "p-4" : "p-6"}
                actions={<ViewToggle view={view} onChange={setView} labels={labels} />}
            >
                {view === "code" ? (
                    <CodeBlock
                        code={`import { Input } from "vaiperui";

<Input label="${labels.masks[mask]}" mask="${mask}" customColor="${color}" />`}
                    />
                ) : (
                    <div className="dark preview-theme">
                        <Input
                            key={`${mask}-${color}`}
                            label={labels.masks[mask]}
                            mask={mask}
                            customColor={color}
                            className="w-full"
                        />
                    </div>
                )}
            </TerminalWindow>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-lg border border-line-strong bg-bg-1 px-4 py-3">
                <ControlGroup legend={labels.color}>
                    {COLOR_VALUES.map((option) => (
                        <Chip
                            key={option.value}
                            label={labels.colors[option.key]}
                            swatch={option.value}
                            active={color === option.value}
                            onClick={() => setColor(option.value)}
                        />
                    ))}
                </ControlGroup>
                <ControlGroup legend={labels.mask}>
                    {MASKS.map((option) => (
                        <Chip
                            key={option}
                            label={labels.masks[option]}
                            active={mask === option}
                            onClick={() => setMask(option)}
                        />
                    ))}
                </ControlGroup>
            </div>
        </div>
    );
}
