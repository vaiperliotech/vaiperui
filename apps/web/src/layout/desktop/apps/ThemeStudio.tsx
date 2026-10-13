"use client";

import { useState } from "react";
import { Button, Input, Select } from "vaiperui";

import { CodeBlock } from "@/components/CodeBlock";
import { makeT } from "@/data/samples";
import { type AppProps, Label, Pane, Toggle } from "./kit";

const PRESETS = ["#4da3ff", "#a855f7", "#ff6600", "#22c55e", "#f43f5e", "#14b8a6"];

function Picker({
    id,
    value,
    onChange,
}: {
    id: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="flex items-center gap-2">
            <input
                id={id}
                type="color"
                value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#4da3ff"}
                onChange={(event) => onChange(event.target.value)}
                className="size-8 cursor-pointer rounded-md border border-line-strong bg-transparent p-0.5"
            />
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                spellCheck={false}
                aria-label="hex"
                className="h-8 w-28 rounded-md border border-line-strong bg-bg-0 px-2 font-mono text-xs text-ink outline-none focus:border-accent-blue"
            />
        </div>
    );
}

function Surface({
    dark,
    color,
    title,
    options,
}: {
    dark: boolean;
    color: string;
    title: string;
    options: Array<{ value: string; label: string }>;
}) {
    return (
        <div className="min-w-0 flex-1">
            <p className="mb-1.5 font-mono text-[10px] text-ink-faint uppercase tracking-wider">
                {title}
            </p>
            <div className={dark ? "dark" : ""}>
                <div
                    className={`flex flex-col gap-3 rounded-xl border border-line-strong p-4 ${dark ? "bg-neutral-950" : "bg-white"}`}
                >
                    <div className="flex flex-wrap gap-2">
                        <Button customColor={color} size="sm">
                            Solid
                        </Button>
                        <Button customColor={color} size="sm" variant="outlined">
                            Outlined
                        </Button>
                        <Button customColor={color} size="sm" variant="transparent">
                            Ghost
                        </Button>
                    </div>
                    <Input customColor={color} label="Input" placeholder="…" />
                    <Select customColor={color} label="Select" placeholder="…" options={options} />
                </div>
            </div>
        </div>
    );
}

// One color in, `customColor` applied to the three components, on a light and a dark surface.
export function ThemeStudio({ locale }: AppProps) {
    const t = makeT(locale);
    const [light, setLight] = useState("#a855f7");
    const [dark, setDark] = useState("#f472b6");
    const [pair, setPair] = useState(false);
    const options = [
        { value: "a", label: t("First option", "Primeira opção", "Primera opción") },
        { value: "b", label: t("Second option", "Segunda opção", "Segunda opción") },
    ];

    const code = pair
        ? `<Button customColor={{ light: "${light}", dark: "${dark}" }}>Solid</Button>\n<Input customColor={{ light: "${light}", dark: "${dark}" }} />\n<Select customColor={{ light: "${light}", dark: "${dark}" }} />`
        : `<Button customColor="${light}">Solid</Button>\n<Input customColor="${light}" />\n<Select customColor="${light}" />`;

    return (
        <Pane className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
                <div>
                    <Label htmlFor="ts-light">
                        {pair
                            ? t("Light theme", "Tema claro", "Tema claro")
                            : t("Color", "Cor", "Color")}
                    </Label>
                    <Picker id="ts-light" value={light} onChange={setLight} />
                </div>
                {pair ? (
                    <div>
                        <Label htmlFor="ts-dark">
                            {t("Dark theme", "Tema escuro", "Tema oscuro")}
                        </Label>
                        <Picker id="ts-dark" value={dark} onChange={setDark} />
                    </div>
                ) : null}
                <div className="flex items-center gap-1.5">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            aria-label={preset}
                            onClick={() => {
                                setLight(preset);
                                if (!pair) setDark(preset);
                            }}
                            style={{ background: preset }}
                            className="size-5 cursor-pointer rounded-full border border-line-strong transition-transform hover:scale-125"
                        />
                    ))}
                </div>
                <Toggle
                    label={t(
                        "Different color per theme",
                        "Uma cor para cada tema",
                        "Un color por tema",
                    )}
                    checked={pair}
                    onChange={setPair}
                />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <Surface
                    dark={false}
                    color={light}
                    title={t("Light", "Claro", "Claro")}
                    options={options}
                />
                <Surface
                    dark
                    color={pair ? dark : light}
                    title={t("Dark", "Escuro", "Oscuro")}
                    options={options}
                />
            </div>

            <CodeBlock
                alwaysShowCopy
                code={code}
                className="rounded-xl border border-line bg-bg-0 p-4"
            />
        </Pane>
    );
}
